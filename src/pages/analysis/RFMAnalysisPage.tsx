import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Card, CardContent, PageHeader, Button, MonthPicker, Badge, FilterToggleButton } from '@/shared/ui';
import { ROUTES } from '@/shared/constants/routes';
import { useRFMAnalysis, useRFMKpi } from '@/entities/analysis';
import type { RFMSegmentType, KpiStatus } from '@/entities/analysis';

ChartJS.register(ArcElement, Tooltip, Legend);

// --- 타입 정의 ---
type CustomerType = 'vip' | 'potential_vip' | 'normal' | 'churn_risk' | 'churned';

interface KpiData {
  baseMonth: string;
  crr: number;
  nrr: number;
  churnRate: number;
  crrStatus: KpiStatus;
  nrrStatus: KpiStatus;
  churnStatus: KpiStatus;
}

// --- 상수 ---
const SEGMENT_CONFIG: Record<CustomerType, { label: string; color: string; badgeVariant: CustomerType }> = {
  vip: { label: 'VIP', color: '#8b5cf6', badgeVariant: 'vip' },
  potential_vip: { label: '잠재 VIP', color: '#6366f1', badgeVariant: 'potential_vip' },
  normal: { label: '일반', color: '#9ca3af', badgeVariant: 'normal' },
  churn_risk: { label: '이탈 우려', color: '#f97316', badgeVariant: 'churn_risk' },
  churned: { label: '이탈', color: '#ef4444', badgeVariant: 'churned' },
};

// RFM API 타입을 CustomerType으로 매핑
const RFM_TYPE_TO_CUSTOMER_TYPE: Record<RFMSegmentType, CustomerType> = {
  VIP: 'vip',
  LOYAL: 'potential_vip',
  COMMON: 'normal',
  RISK: 'churn_risk',
  LOST: 'churned',
};

const STATUS_STYLE: Record<KpiStatus, { label: string; className: string }> = {
  HEALTHY: { label: '양호', className: 'text-success-600' },
  WARNING: { label: '주의', className: 'text-warning-600' },
  DANGER: { label: '위험', className: 'text-error-600' },
};

/**
 * KPI 상태별 해석 메시지
 *
 * CRR (고객 유지율 - Customer Retention Rate)
 *   HEALTHY: 90% 이상 → 고객 유지가 안정적
 *   WARNING: 80~90% → 이탈 고객 증가 추세, 주의 필요
 *   DANGER:  80% 미만 → 고객 이탈이 심각한 수준
 *
 * NRR (순 매출 유지율 - Net Revenue Retention)
 *   HEALTHY: 100% 이상 → 기존 고객 매출이 성장 중
 *   WARNING: 90~100% → 매출 정체, 업셀링 전략 필요
 *   DANGER:  90% 미만 → 매출 감소 추세, 긴급 대응 필요
 *
 * Churn Rate (이탈률)
 *   HEALTHY: 5% 이하 → 이탈률이 안정적
 *   WARNING: 5~10% → 이탈률 증가 추세, 리텐션 전략 필요
 *   DANGER:  10% 초과 → 이탈률이 위험 수준
 */
const KPI_MESSAGES: Record<string, Record<KpiStatus, string>> = {
  crr: {
    HEALTHY: '고객 유지가 안정적입니다. 현재 리텐션 전략을 유지하세요.',
    WARNING: '이탈 고객이 증가하고 있습니다. 리텐션 캠페인을 검토하세요.',
    DANGER: '고객 이탈이 심각한 수준입니다. 즉각적인 대응이 필요합니다.',
  },
  nrr: {
    HEALTHY: '기존 고객 매출이 성장 중입니다. 업셀링 전략이 효과적입니다.',
    WARNING: '매출이 정체 상태입니다. 업셀링/크로스셀링 전략을 강화하세요.',
    DANGER: '매출이 감소하고 있습니다. 긴급 매출 회복 전략이 필요합니다.',
  },
  churnRate: {
    HEALTHY: '이탈률이 안정적입니다. 현재 고객 관리 수준을 유지하세요.',
    WARNING: '이탈률이 증가 추세입니다. 이탈 우려 고객 대상 관리가 필요합니다.',
    DANGER: '이탈률이 위험 수준입니다. 이탈 방지 프로그램을 즉시 가동하세요.',
  },
};

// --- 메인 컴포넌트 ---
const RFMAnalysisPage = () => {
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isQueried, setIsQueried] = useState(false);
  const [baseMonth, setBaseMonth] = useState(getCurrentMonth);

  // API 호출 - 세그먼트 데이터
  const { data: apiResponse, isLoading: isLoadingSegments, error: errorSegments } = useRFMAnalysis(
    { baseMonth },
    isQueried
  );

  // API 호출 - KPI 데이터
  const { data: kpiResponse, isLoading: isLoadingKpi, error: errorKpi } = useRFMKpi(
    { baseMonth },
    isQueried
  );

  const isLoading = isLoadingSegments || isLoadingKpi;
  const error = errorSegments || errorKpi;

  const handleQuery = () => {
    setIsQueried(true);
  };

  const handleSegmentClick = (segmentType: CustomerType) => {
    // 고객 목록 페이지로 이동하면서 세그먼트 타입을 쿼리 파라미터로 전달
    navigate(`${ROUTES.CUSTOMERS}?customerType=${segmentType}`);
  };

  // API 응답 데이터 가공
  const SEGMENT_ORDER: CustomerType[] = ['vip', 'potential_vip', 'normal', 'churn_risk', 'churned'];

  const segmentsData = useMemo(() => {
    if (!apiResponse?.data?.segmentDetailList) return [];
    
    return apiResponse.data.segmentDetailList.map((segment) => {
      const customerType = RFM_TYPE_TO_CUSTOMER_TYPE[segment.type];
      return {
        type: customerType,
        label: SEGMENT_CONFIG[customerType].label,
        count: segment.count,
        ratio: segment.ratio,
        avgR: segment.avgR,
        avgF: segment.avgF,
        avgM: segment.avgM,
      };
    })
    .sort((a, b) => 
      SEGMENT_ORDER.indexOf(a.type) - SEGMENT_ORDER.indexOf(b.type)
    );
  }, [apiResponse]);

  const totalCustomers = apiResponse?.data?.totalCount || 0;

  // KPI 데이터
  const kpiData: KpiData | null = useMemo(() => {
    if (!kpiResponse?.data) return null;
    return kpiResponse.data;
  }, [kpiResponse]);

  // 도넛 중앙 텍스트 플러그인 (캔버스 레벨에서 그려서 툴팁보다 아래에 위치)
  const centerTextPlugin = {
    id: 'centerText',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeDraw(chart: any) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();

      // "전체 고객"
      ctx.font = '12px Pretendard, sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('전체 고객', centerX, centerY - 10);

      // 고객 수
      ctx.font = 'bold 20px Pretendard, sans-serif';
      ctx.fillStyle = '#111827';
      ctx.fillText(`${totalCustomers.toLocaleString()}명`, centerX, centerY + 14);

      ctx.restore();
    },
  };

  const chartData = {
    labels: segmentsData.map((s) => SEGMENT_CONFIG[s.type].label),
    datasets: [
      {
        data: segmentsData.map((s) => s.count),
        backgroundColor: segmentsData.map((s) => SEGMENT_CONFIG[s.type].color),
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { label?: string; parsed: number }) => {
            const ratio = ((ctx.parsed / totalCustomers) * 100).toFixed(1);
            return `${ctx.label}: ${ctx.parsed.toLocaleString()}명 (${ratio}%)`;
          },
        },
      },
    },
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-6">
        {/* 필터 섹션 */}
        <div className="flex-shrink-0 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="p-6 pb-4">
            <PageHeader
              title="RFM 분석"
              description="고객 세그먼트별 분포 및 리텐션 KPI 분석"
              actions={
                <FilterToggleButton isOpen={isFilterOpen} onToggle={() => setIsFilterOpen(!isFilterOpen)} />
              }
            />
          </div>

          {isFilterOpen && (
            <div className="space-y-4 px-6 pb-6">
              <div className="flex items-end gap-4">
                <MonthPicker
                  label="기준 년월"
                  value={baseMonth}
                  onChange={setBaseMonth}
                  className="w-[160px]"
                />
                <Button variant="primary" size="md" className="ml-auto shrink-0" onClick={handleQuery} disabled={isLoading}>
                  {isLoading ? '조회 중...' : '조회하기'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {isQueried && !isLoading && !error && segmentsData.length > 0 && (
          <>
            {/* KPI 카드 */}
            {kpiData && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">고객 유지율 (CRR)</p>
                      <span className={`text-xs font-semibold ${STATUS_STYLE[kpiData.crrStatus].className}`}>
                        {STATUS_STYLE[kpiData.crrStatus].label}
                      </span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {(kpiData.crr * 100).toFixed(0)}%
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{kpiData.baseMonth} 기준</p>
                    <p className={`mt-2 text-xs ${STATUS_STYLE[kpiData.crrStatus].className}`}>
                      {KPI_MESSAGES.crr[kpiData.crrStatus]}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">순 매출 유지율 (NRR)</p>
                      <span className={`text-xs font-semibold ${STATUS_STYLE[kpiData.nrrStatus].className}`}>
                        {STATUS_STYLE[kpiData.nrrStatus].label}
                      </span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {(kpiData.nrr * 100).toFixed(0)}%
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{kpiData.baseMonth} 기준</p>
                    <p className={`mt-2 text-xs ${STATUS_STYLE[kpiData.nrrStatus].className}`}>
                      {KPI_MESSAGES.nrr[kpiData.nrrStatus]}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-500">이탈률</p>
                      <span className={`text-xs font-semibold ${STATUS_STYLE[kpiData.churnStatus].className}`}>
                        {STATUS_STYLE[kpiData.churnStatus].label}
                      </span>
                    </div>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {(kpiData.churnRate * 100).toFixed(0)}%
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{kpiData.baseMonth} 기준</p>
                    <p className={`mt-2 text-xs ${STATUS_STYLE[kpiData.churnStatus].className}`}>
                      {KPI_MESSAGES.churnRate[kpiData.churnStatus]}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 세그먼트 분포 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* 도넛 차트 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-1 text-base font-bold text-gray-900">세그먼트 분포</h3>
                  <p className="mb-4 text-sm text-gray-500">고객 분류별 비율</p>
                  <div className="relative mx-auto" style={{ height: '280px', maxWidth: '280px' }}>
                    <Doughnut data={chartData} options={chartOptions} plugins={[centerTextPlugin]} />
                  </div>
                  {/* 커스텀 범례 */}
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    {segmentsData.map((s) => (
                      <div key={s.type} className="flex items-center gap-1.5">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: SEGMENT_CONFIG[s.type].color }}
                        />
                        <span className="text-xs text-gray-600">{SEGMENT_CONFIG[s.type].label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 세그먼트 상세 테이블 */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-1 text-base font-bold text-gray-900">세그먼트 상세</h3>
                  <p className="mb-4 text-sm text-gray-500">각 세그먼트별 고객 수 및 비율 · 클릭하여 고객 목록 보기</p>
                  <div className="space-y-3">
                    {segmentsData.map((s) => (
                      <button
                        key={s.type}
                        onClick={() => handleSegmentClick(s.type)}
                        className="flex w-full items-center gap-3 rounded-lg border border-gray-100 p-3 text-left transition-all hover:border-primary-300 hover:bg-primary-50/30 hover:shadow-md active:scale-[0.99]"
                      >
                        <Badge variant={SEGMENT_CONFIG[s.type].badgeVariant}>
                          {SEGMENT_CONFIG[s.type].label}
                        </Badge>
                        <div className="flex-1">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              {s.count.toLocaleString()}명
                            </span>
                            <span className="text-sm font-semibold text-gray-700">{s.ratio.toFixed(1)}%</span>
                          </div>
                          {/* 비율 바 */}
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${s.ratio}%`,
                                backgroundColor: SEGMENT_CONFIG[s.type].color,
                              }}
                            />
                          </div>
                        </div>
                        <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-lg font-medium text-gray-600">RFM 분석 데이터를 불러오는 중...</p>
            <p className="mt-1 text-sm text-gray-400">잠시만 기다려주세요</p>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <div className="mb-4 flex justify-center">
              <svg className="h-16 w-16 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="mb-2 text-lg font-semibold text-error-600">데이터를 불러오는데 실패했습니다</p>
            <p className="mb-4 text-sm text-gray-600">잠시 후 다시 시도해주세요</p>
            {error instanceof Error && (
              <details className="mt-4 rounded-lg bg-gray-100 p-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-gray-700">
                  오류 상세 정보
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-gray-600">
                  {error.message}
                </pre>
              </details>
            )}
          </div>
        )}

        {/* 데이터 없음 */}
        {isQueried && !isLoading && !error && segmentsData.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium text-gray-500">해당 기간의 데이터가 없습니다</p>
            <p className="mt-1 text-sm text-gray-400">다른 기준 년월을 선택해 보세요</p>
          </div>
        )}

        {!isQueried && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium text-gray-500">기준 년월을 선택하고 조회하기를 눌러주세요</p>
            <p className="mt-1 text-sm text-gray-400">RFM 분석 결과가 이곳에 표시됩니다</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default RFMAnalysisPage;
