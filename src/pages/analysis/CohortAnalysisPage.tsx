import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Card, CardContent, PageHeader, Button, FormSelect, MonthPicker } from '@/shared/ui';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const mockCohortResult = {
  summary: {
    avgRetention: 68.5,
    threeMonthRetention: 42.3,
    sixMonthRetention: 28.7,
  },
  retentionTrend: {
    labels: ['1개월', '2개월', '3개월', '4개월', '5개월', '6개월'],
    datasets: [
      { cohort: '2024-09', data: [72, 58, 45, 38, 32, 28] },
      { cohort: '2024-08', data: [68, 54, 42, 35, 29, 25] },
      { cohort: '2024-07', data: [70, 56, 44, 37, 31, 27] },
    ],
  },
  cohortComparison: {
    labels: ['2024-07', '2024-08', '2024-09'],
    customers: [9120, 7850, 8420],
    retention1m: [70, 68, 72],
    retention3m: [44, 42, 45],
    retention6m: [27, 25, 28],
  },
  table: [
    { cohort: '2024-09', customers: 8420, months: [72, 58, 45, 38, 32, 28] },
    { cohort: '2024-08', customers: 7850, months: [68, 54, 42, 35, 29, 25] },
    { cohort: '2024-07', customers: 9120, months: [70, 56, 44, 37, 31, 27] },
  ],
};

const cohortColors = [
  { border: 'rgb(99, 102, 241)', bg: 'rgba(99, 102, 241, 0.1)' },
  { border: 'rgb(16, 185, 129)', bg: 'rgba(16, 185, 129, 0.1)' },
  { border: 'rgb(245, 158, 11)', bg: 'rgba(245, 158, 11, 0.1)' },
];

const getRetentionColor = (value: number) => {
  if (value >= 50) return 'bg-green-100 text-green-700';
  if (value >= 30) return 'bg-yellow-100 text-yellow-700';
  return 'bg-orange-100 text-orange-700';
};

const CohortAnalysisPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isQueried, setIsQueried] = useState(false);

  const handleQuery = () => {
    setIsQueried(true);
  };

  const lineChartData = {
    labels: mockCohortResult.retentionTrend.labels,
    datasets: mockCohortResult.retentionTrend.datasets.map((ds, i) => ({
      label: ds.cohort,
      data: ds.data,
      borderColor: cohortColors[i].border,
      backgroundColor: cohortColors[i].bg,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointHoverRadius: 6,
    })),
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) =>
            `${ctx.dataset.label}: ${ctx.parsed.y ?? 0}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (v: string | number) => `${v}%` },
      },
    },
  };

  const barChartData = {
    labels: mockCohortResult.cohortComparison.labels,
    datasets: [
      {
        label: '1개월 유지율',
        data: mockCohortResult.cohortComparison.retention1m,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderRadius: 4,
      },
      {
        label: '3개월 유지율',
        data: mockCohortResult.cohortComparison.retention3m,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderRadius: 4,
      },
      {
        label: '6개월 유지율',
        data: mockCohortResult.cohortComparison.retention6m,
        backgroundColor: 'rgba(245, 158, 11, 0.7)',
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) =>
            `${ctx.dataset.label}: ${ctx.parsed.y ?? 0}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (v: string | number) => `${v}%` },
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
              title="코호트 분석"
              description="시간 경과에 따른 고객 그룹별 행동 패턴 분석"
              actions={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  leftIcon={
                    <svg
                      className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  }
                >
                  {isFilterOpen ? '필터 접기' : '필터 펼치기'}
                </Button>
              }
            />
          </div>

          {isFilterOpen && (
            <div className="space-y-4 px-6 pb-6">
              <div className="flex items-end gap-4">
                <FormSelect
                  label="분석 기준"
                  placeholder="기준 선택"
                  value="rfm"
                  className="w-[160px]"
                  options={[
                    { value: 'rfm', label: 'RFM 세그먼트' },
                    { value: 'consult', label: '상담 횟수' },
                  ]}
                />
                <FormSelect
                  label="기간 단위"
                  placeholder="단위 선택"
                  value="month"
                  className="w-[120px]"
                  options={[
                    { value: 'month', label: '월' },
                    { value: 'year', label: '년' },
                  ]}
                />
                <MonthPicker
                  label="기준 년월"
                  value="2024-09"
                  className="w-[160px]"
                />
                <FormSelect
                  label="분석 기간"
                  placeholder="기간 선택"
                  value="6"
                  className="w-[120px]"
                  options={[
                    { value: '3', label: '3개월' },
                    { value: '6', label: '6개월' },
                    { value: '9', label: '9개월' },
                    { value: '12', label: '12개월' },
                    { value: '18', label: '18개월' },
                    { value: '24', label: '24개월' },
                  ]}
                />
                <Button variant="primary" size="md" className="ml-auto shrink-0" onClick={handleQuery}>
                  조회하기
                </Button>
              </div>
            </div>
          )}
        </div>

        {isQueried && (
          <>
            {/* 코호트 요약 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-sm font-semibold text-gray-500">평균 재방문율</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockCohortResult.summary.avgRetention}%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">첫 달 이후 재방문 비율</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-sm font-semibold text-gray-500">3개월 유지율</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockCohortResult.summary.threeMonthRetention}%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">3개월 후 활성 고객 비율</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-sm font-semibold text-gray-500">6개월 유지율</h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {mockCohortResult.summary.sixMonthRetention}%
                  </p>
                  <p className="mt-1 text-xs text-gray-500">6개월 후 활성 고객 비율</p>
                </CardContent>
              </Card>
            </div>

            {/* 차트 섹션 */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* 유지율 추이 라인 차트 */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="mb-1 text-base font-bold text-gray-900">유지율 추이</h4>
                  <p className="mb-4 text-sm text-gray-500">코호트별 시간 경과에 따른 유지율 변화</p>
                  <div style={{ height: '280px' }}>
                    <Line data={lineChartData} options={lineChartOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* 코호트별 비교 바 차트 */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="mb-1 text-base font-bold text-gray-900">코호트별 유지율 비교</h4>
                  <p className="mb-4 text-sm text-gray-500">각 코호트의 1/3/6개월 유지율 비교</p>
                  <div style={{ height: '280px' }}>
                    <Bar data={barChartData} options={barChartOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 코호트 테이블 */}
            <div className="flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900">코호트 분석 테이블</h3>
                <p className="mt-1 text-sm text-gray-500">
                  각 코호트의 시간 경과에 따른 재방문율 (%)
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-y border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">코호트</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">고객 수</th>
                      {mockCohortResult.retentionTrend.labels.map((label) => (
                        <th key={label} className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockCohortResult.table.map((row) => (
                      <tr key={row.cohort} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.cohort}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {row.customers.toLocaleString()}
                        </td>
                        {row.months.map((val, i) => (
                          <td key={i} className="px-6 py-4 text-center text-sm">
                            <span className={`inline-block rounded px-2 py-1 ${getRetentionColor(val)}`}>
                              {val}%
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!isQueried && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white py-20 shadow-sm">
            <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-lg font-medium text-gray-500">필터를 설정하고 조회하기를 눌러주세요</p>
            <p className="mt-1 text-sm text-gray-400">분석 결과가 이곳에 표시됩니다</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CohortAnalysisPage;