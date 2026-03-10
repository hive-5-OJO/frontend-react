import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Card, CardContent, PageHeader, Button, FormSelect, MonthPicker, FilterToggleButton } from '@/shared/ui';

// --- 타입 정의 ---
interface CohortRow {
  join_month: string;
  segment_type: string;
  [key: string]: number | null | string;
}

type SegmentType = 'all' | 'high_consult' | 'big_spender' | 'vip';

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

// --- Mock 데이터 생성 (2025-01 ~ 2026-03) ---
// 현재 시점: 2026-03 기준, 각 코호트는 가입 월부터 현재까지 경과한 개월 수만큼만 데이터 보유
const CURRENT_MONTH = '2026-03';

const generateMockData = (): CohortRow[] => {
  const segments: SegmentType[] = ['all', 'high_consult', 'big_spender', 'vip'];
  const months = [
    '2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06',
    '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12',
    '2026-01', '2026-02', '2026-03',
  ];
  const rows: CohortRow[] = [];

  const [curY, curM] = CURRENT_MONTH.split('-').map(Number);

  for (const segment of segments) {
    for (let mi = 0; mi < months.length; mi++) {
      const row: CohortRow = { join_month: months[mi], segment_type: segment };

      // 가입 월부터 현재까지 경과 개월 수
      const [joinY, joinM] = months[mi].split('-').map(Number);
      const monthsElapsed = (curY - joinY) * 12 + (curM - joinM);

      // 세그먼트별 초기 리텐션
      let base = segment === 'vip' ? 0.95 :
                 segment === 'big_spender' ? 0.92 :
                 segment === 'high_consult' ? 0.88 : 0.85;

      for (let i = 0; i <= 12; i++) {
        if (i > monthsElapsed) {
          row[String(i)] = null; // 아직 도래하지 않은 기간
        } else if (i === 0) {
          row[String(i)] = 1;
        } else {
          base = base * (0.96 + Math.random() * 0.04);
          row[String(i)] = Math.max(0.1, Math.min(1, base));
        }
      }
      rows.push(row);
    }
  }
  return rows;
};

const mockCohortData: CohortRow[] = generateMockData();

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
  return `${(value * 100).toFixed(1)}%`;
};

// --- 메인 컴포넌트 ---
const CohortAnalysisPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isQueried, setIsQueried] = useState(false);
  const [segmentType, setSegmentType] = useState<SegmentType>('all');
  const [startMonth, setStartMonth] = useState('2025-01');
  const [endMonth, setEndMonth] = useState('2026-03');
  const [analysisPeriod, setAnalysisPeriod] = useState('12');

  const handleQuery = () => {
    setIsQueried(true);
  };

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    if (!isQueried) return [];

    // 1. 선택한 segment_type만 필터
    const rows = mockCohortData.filter((row) => row.segment_type === segmentType);

    // 2. 시작 월 ~ 끝 월 범위의 코호트만 선택
    return rows.filter((row) => {
      return row.join_month >= startMonth && row.join_month <= endMonth;
    }).sort((a, b) => a.join_month.localeCompare(b.join_month));
  }, [isQueried, segmentType, startMonth, endMonth]);

  // 열 헤더 계산 (0개월 ~ 분석기간)
  const columnHeaders = useMemo(() => {
    const maxPeriod = parseInt(analysisPeriod);
    return Array.from({ length: maxPeriod + 1 }, (_, i) => `${i}개월`);
  }, [analysisPeriod]);

  // 요약 통계
  const summaryStats = useMemo(() => {
    if (filteredData.length === 0) return null;

    const maxPeriod = parseInt(analysisPeriod);
    const allValues: number[] = [];
    const month1Values: number[] = [];
    const month3Values: number[] = [];
    const month6Values: number[] = [];

    for (const row of filteredData) {
      for (let i = 0; i <= maxPeriod; i++) {
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
  }, [filteredData, analysisPeriod]);

  const segmentLabel = SEGMENT_OPTIONS.find((o) => o.value === segmentType)?.label ?? '';

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
                  onChange={(v) => setSegmentType(v as SegmentType)}
                  className="w-[160px]"
                  options={SEGMENT_OPTIONS}
                />
                <MonthPicker
                  label="가입 월 (시작)"
                  value={startMonth}
                  onChange={setStartMonth}
                  className="w-[160px]"
                />
                <MonthPicker
                  label="가입 월 (끝)"
                  value={endMonth}
                  onChange={setEndMonth}
                  className="w-[160px]"
                />
                <FormSelect
                  label="분석 기간"
                  placeholder="기간 선택"
                  value={analysisPeriod}
                  onChange={setAnalysisPeriod}
                  className="w-[140px]"
                  options={ANALYSIS_PERIOD_OPTIONS}
                />
                <Button variant="primary" size="md" className="ml-auto shrink-0" onClick={handleQuery}>
                  조회하기
                </Button>
              </div>
            </div>
          )}
        </div>

        {isQueried && filteredData.length > 0 && (
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
                      {(summaryStats.retention1 * 100).toFixed(1)}%
                    </p>
                    <p className="mt-1 text-xs text-gray-400">1개월 후 평균</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-gray-500">+3개월 리텐션</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {(summaryStats.retention3 * 100).toFixed(1)}%
                    </p>
                    <p className="mt-1 text-xs text-gray-400">3개월 후 평균</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <p className="text-sm font-medium text-gray-500">+6개월 리텐션</p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      {(summaryStats.retention6 * 100).toFixed(1)}%
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
                        {columnHeaders.map((header, i) => (
                          <th
                            key={i}
                            className="min-w-[70px] border-b border-gray-200 bg-gray-50 px-2 py-2.5 text-center text-xs font-semibold text-gray-600"
                          >
                            {header}
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
                          {columnHeaders.map((_, i) => {
                            const val = row[String(i)] as number | null;
                            const { style, className } = getHeatmapStyle(val);
                            return (
                              <td key={i} className="border-b border-gray-100 px-0.5 py-0.5">
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

        {isQueried && filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium text-gray-500">해당 조건의 데이터가 없습니다</p>
            <p className="mt-1 text-sm text-gray-400">필터 조건을 변경해 보세요</p>
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
    </DashboardLayout>
  );
};

export default CohortAnalysisPage;
