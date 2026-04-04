import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Card, CardContent, PageHeader, Button, FormSelect, MonthPicker, FilterToggleButton } from '@/shared/ui';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { useCohortAnalysis } from '@/entities/analysis';
import type { SegmentType } from '@/entities/analysis';

const SEGMENT_OPTIONS = [
  { value: 'all', label: '전체 고객' },
  { value: 'high_consult', label: '고상담 고객' },
  { value: 'big_spender', label: '고액 결제자' },
  { value: 'vip', label: 'VIP 유저' },
];

const ANALYSIS_PERIOD_OPTIONS = [
  { value: '1', label: '1개월' },
  { value: '2', label: '2개월' },
  { value: '3', label: '3개월' },
  { value: '4', label: '4개월' },
  { value: '5', label: '5개월' },
  { value: '6', label: '6개월' },
  { value: '7', label: '7개월' },
  { value: '8', label: '8개월' },
  { value: '9', label: '9개월' },
  { value: '10', label: '10개월' },
  { value: '11', label: '11개월' },
  { value: '12', label: '12개월' },
];

// --- 히트맵 셀 색상 (main-blue #5e72e4 기반 그라데이션) ---
const getHeatmapStyle = (value: number | null): { style: React.CSSProperties; className: string } => {
  if (value === null) return { style: {}, className: 'bg-gray-100 text-gray-400' };
  const pct = value * 100;

  // main-blue(#5e72e4) 기반, opacity로 농도 조절 — 100%가 가장 진하고 점점 연해짐
  if (pct >= 90) return { style: { backgroundColor: '#5e72e4', color: '#fff' }, className: '' };
  if (pct >= 80) return { style: { backgroundColor: 'rgba(94,114,228,0.85)', color: '#fff' }, className: '' };
  if (pct >= 70) return { style: { backgroundColor: 'rgba(94,114,228,0.70)', color: '#fff' }, className: '' };
  if (pct >= 60) return { style: { backgroundColor: 'rgba(94,114,228,0.55)', color: '#2d3a8c' }, className: '' };
  if (pct >= 50) return { style: { backgroundColor: 'rgba(94,114,228,0.42)', color: '#2d3a8c' }, className: '' };
  if (pct >= 40) return { style: { backgroundColor: 'rgba(94,114,228,0.30)', color: '#3b4caa' }, className: '' };
  if (pct >= 30) return { style: { backgroundColor: 'rgba(94,114,228,0.20)', color: '#4a5ab8' }, className: '' };
  if (pct >= 20) return { style: { backgroundColor: 'rgba(94,114,228,0.12)', color: '#5e72e4' }, className: '' };
  if (pct >= 10) return { style: { backgroundColor: 'rgba(94,114,228,0.06)', color: '#7b8be8' }, className: '' };
  return { style: { backgroundColor: 'rgba(94,114,228,0.03)', color: '#9aa5ed' }, className: '' };
};

const formatPercent = (value: number | null): string => {
  if (value === null) return '-';
  return `${(value * 100).toFixed(2)}%`;
};

// --- 메인 컴포넌트 ---
const CohortAnalysisPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isQueried, setIsQueried] = useState(false);
  const [segmentType, setSegmentType] = useState<SegmentType | ''>('');
  const [queriedSegment, setQueriedSegment] = useState<SegmentType>('all');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [analysisPeriod, setAnalysisPeriod] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [queryTrigger, setQueryTrigger] = useState(0);

  // 조회 시점의 필터 스냅샷
  const [queriedStartMonth, setQueriedStartMonth] = useState('');
  const [queriedEndMonth, setQueriedEndMonth] = useState('');
  const [queriedAnalysisPeriod, setQueriedAnalysisPeriod] = useState('12');

  // API 호출 - 조회 버튼을 눌렀을 때의 segment로만 호출
  const { data: apiResponse, isLoading, error } = useCohortAnalysis(
    {
      segment: queriedSegment,
    },
    isQueried
  );

  // API 응답에서 데이터 추출 후 프론트에서 필터링
  const filteredData = useMemo(() => {
    if (!isQueried || !apiResponse?.data) return [];
    
    return apiResponse.data
      .filter((row) => {
        if (queriedStartMonth && row.join_month < queriedStartMonth) return false;
        if (queriedEndMonth && row.join_month > queriedEndMonth) return false;
        return true;
      })
      .sort((a, b) => a.join_month.localeCompare(b.join_month));
  }, [isQueried, apiResponse, queriedStartMonth, queriedEndMonth]);

  const handleQuery = () => {
    if (!segmentType || !startMonth || !endMonth || !analysisPeriod) {
      setAlertMessage('분석 기준, 가입 월 (시작/끝), 분석 기간을 모두 선택해 주세요.');
      setAlertOpen(true);
      return;
    }
    setQueriedSegment(segmentType);
    setQueriedStartMonth(startMonth);
    setQueriedEndMonth(endMonth);
    setQueriedAnalysisPeriod(analysisPeriod);
    setIsQueried(true);
    setQueryTrigger((prev) => prev + 1);
  };

  // 조회 버튼을 눌러서 데이터가 로드된 후, 선택 범위가 데이터 범위를 벗어나면 알림
  useEffect(() => {
    if (queryTrigger > 0 && !isLoading && apiResponse?.data && apiResponse.data.length > 0) {
      const months = apiResponse.data.map((r) => r.join_month).sort();
      const dataMin = months[0];
      const dataMax = months[months.length - 1];

      const outOfRange =
        (startMonth && startMonth < dataMin) ||
        (endMonth && endMonth > dataMax);

      if (outOfRange) {
        setAlertMessage('선택한 기간에 해당하는 분석 데이터가 존재하지 않습니다. 기간을 변경해 주세요.');
        setAlertOpen(true);
        setIsQueried(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryTrigger, isLoading, apiResponse]);

  // 열 헤더 계산 (1개월 ~ 분석기간)
  const columnHeaders = useMemo(() => {
    const maxPeriod = parseInt(queriedAnalysisPeriod);
    return Array.from({ length: maxPeriod }, (_, i) => i + 1);
  }, [queriedAnalysisPeriod]);

  // 요약 통계
  const summaryStats = useMemo(() => {
    if (filteredData.length === 0) return null;

    const maxPeriod = parseInt(queriedAnalysisPeriod);
    const allValues: number[] = [];
    const month1Values: number[] = [];
    const month3Values: number[] = [];
    const month6Values: number[] = [];

    for (const row of filteredData) {
      for (let i = 1; i <= maxPeriod; i++) {
        const val = row[String(i)];
        if (typeof val === 'number') {
          allValues.push(val);
          if (i === 1) month1Values.push(val);
          if (i === 3) month3Values.push(val);
          if (i === 6) month6Values.push(val);
        }
      }
    }

    const avg = (arr: number[]) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

    return {
      avgRetention: avg(allValues),
      retention1: avg(month1Values),
      retention3: avg(month3Values),
      retention6: avg(month6Values),
    };
  }, [filteredData, queriedAnalysisPeriod]);

  const segmentLabel = SEGMENT_OPTIONS.find((o) => o.value === queriedSegment)?.label ?? '';

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 pb-6">
        {/* 필터 섹션 */}
        <div className="flex-shrink-0 rounded-xl border border-gray-100 bg-white shadow-sm">
          <div className="p-6 pb-4">
            <PageHeader
              title="코호트 분석"
              description="가입 시점별 고객 그룹의 리텐션 추이를 히트맵으로 분석합니다"
              actions={
                <FilterToggleButton isOpen={isFilterOpen} onToggle={() => setIsFilterOpen(!isFilterOpen)} />
              }
            />
          </div>

          {isFilterOpen && (
            <div className="space-y-4 px-6 pb-6">
              <div className="flex items-end gap-4">
                <FormSelect
                  label="분석 기준"
                  placeholder="기준 선택"
                  value={segmentType}
                  onChange={(v) => { setSegmentType(v as SegmentType); }}
                  className="w-[160px]"
                  options={SEGMENT_OPTIONS}
                />
                <MonthPicker
                  label="가입 월 (시작)"
                  value={startMonth}
                  onChange={(v) => { setStartMonth(v); }}
                  className="w-[160px]"
                  placeholder="시작 월 선택"
                />
                <MonthPicker
                  label="가입 월 (끝)"
                  value={endMonth}
                  onChange={(v) => { setEndMonth(v); }}
                  className="w-[160px]"
                  placeholder="종료 월 선택"
                />
                <FormSelect
                  label="분석 기간"
                  placeholder="기간 선택"
                  value={analysisPeriod}
                  onChange={(v) => { setAnalysisPeriod(v); }}
                  className="w-[140px]"
                  options={ANALYSIS_PERIOD_OPTIONS}
                />
                <Button variant="primary" size="md" className="ml-auto shrink-0" onClick={handleQuery} disabled={isLoading}>
                  {isLoading ? '조회 중...' : '조회하기'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {isQueried && filteredData.length > 0 && !isLoading && (
          <>
            {/* 요약 카드 */}
            {summaryStats && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-gray-500">분석 대상</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">{segmentLabel}</p>
                    <p className="mt-1 text-xs text-gray-400">{filteredData.length}개 코호트</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-gray-500">+1개월 리텐션</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {(summaryStats.retention1 * 100).toFixed(2)}%
                    </p>
                    <p className="mt-1 text-xs text-gray-400">1개월 후 평균</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-gray-500">+3개월 리텐션</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {(summaryStats.retention3 * 100).toFixed(2)}%
                    </p>
                    <p className="mt-1 text-xs text-gray-400">3개월 후 평균</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-gray-500">+6개월 리텐션</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {(summaryStats.retention6 * 100).toFixed(2)}%
                    </p>
                    <p className="mt-1 text-xs text-gray-400">6개월 후 평균</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 히트맵 테이블 */}
            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">리텐션 히트맵</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    가입 월별 경과 기간에 따른 리텐션 비율 (%) · 색상이 진할수록 높은 리텐션
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="sticky left-0 z-10 w-[1500px] min-w-[150px] max-w-[150px] border-b border-r border-gray-200 bg-gray-50 px-3 py-2.5 text-left text-xs font-semibold text-gray-600">
                          가입 월
                        </th>
                        {columnHeaders.map((month) => (
                          <th
                            key={month}
                            className="min-w-[70px] border-b border-gray-200 bg-gray-50 px-2 py-2.5 text-center text-xs font-semibold text-gray-600"
                          >
                            {month}개월
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((row) => (
                        <tr key={row.join_month}>
                          <td className="sticky left-0 z-10 w-[100px] min-w-[100px] max-w-[100px] border-b border-r border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-900">
                            {row.join_month}
                          </td>
                          {columnHeaders.map((month) => {
                            const val = row[String(month)] as number | null;
                            const { style, className } = getHeatmapStyle(val);
                            return (
                              <td key={month} className="border-b border-gray-100 px-0.5 py-0.5">
                                <div
                                  className={`flex items-center justify-center rounded px-1 py-1.5 text-xs font-medium ${className}`}
                                  style={style}
                                  title={val !== null ? `${(val * 100).toFixed(2)}%` : '데이터 없음'}
                                >
                                  {formatPercent(val)}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 범례 */}
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                  <span>낮음</span>
                  <div className="flex gap-0.5">
                    <div className="h-4 w-6 rounded" style={{ backgroundColor: 'rgba(94,114,228,0.03)' }} title="10% 미만" />
                    <div className="h-4 w-6 rounded" style={{ backgroundColor: 'rgba(94,114,228,0.06)' }} title="10-20%" />
                    <div className="h-4 w-6 rounded" style={{ backgroundColor: 'rgba(94,114,228,0.12)' }} title="20-30%" />
                    <div className="h-4 w-6 rounded" style={{ backgroundColor: 'rgba(94,114,228,0.20)' }} title="30-40%" />
                    <div className="h-4 w-6 rounded" style={{ backgroundColor: 'rgba(94,114,228,0.30)' }} title="40-50%" />
                    <div className="h-4 w-6 rounded" style={{ backgroundColor: 'rgba(94,114,228,0.42)' }} title="50-60%" />
                    <div className="h-4 w-6 rounded" style={{ backgroundColor: 'rgba(94,114,228,0.55)' }} title="60-70%" />
                    <div className="h-4 w-6 rounded" style={{ backgroundColor: 'rgba(94,114,228,0.70)' }} title="70-80%" />
                    <div className="h-4 w-6 rounded" style={{ backgroundColor: 'rgba(94,114,228,0.85)' }} title="80-90%" />
                    <div className="h-4 w-6 rounded" style={{ backgroundColor: '#5e72e4' }} title="90% 이상" />
                  </div>
                  <span>높음</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {isQueried && filteredData.length === 0 && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium text-gray-500">해당 조건의 데이터가 없습니다</p>
            <p className="mt-1 text-sm text-gray-400">필터 조건을 변경해 보세요</p>
          </div>
        )}

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-lg font-medium text-gray-600">코호트 분석 데이터를 불러오는 중...</p>
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

        {!isQueried && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium text-gray-500">분석 기준을 설정하고 조회하기를 눌러주세요</p>
            <p className="mt-1 text-sm text-gray-400">코호트 리텐션 히트맵이 이곳에 표시됩니다</p>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title="알림"
        description={alertMessage}
        confirmLabel="확인"
        showCancel={false}
      />
    </DashboardLayout>
  );
};

export default CohortAnalysisPage;
