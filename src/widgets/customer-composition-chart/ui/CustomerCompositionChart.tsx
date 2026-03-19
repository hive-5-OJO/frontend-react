import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent } from '@/shared/ui';
import type { DashboardSegments } from '@/entities/dashboard';

ChartJS.register(ArcElement, Tooltip, Legend);

const formatNumber = (n: number) => n.toLocaleString();

interface Props {
  segments?: DashboardSegments;
}

const SEGMENT_CONFIG = [
  { key: 'vip' as const, label: 'VIP', color: '#3B82F6' },
  { key: 'potentialVip' as const, label: '잠재 VIP', color: '#8B5CF6' },
  { key: 'general' as const, label: '일반', color: '#F59E0B' },
  { key: 'atRisk' as const, label: '이탈 우려', color: '#F97316' },
  { key: 'churned' as const, label: '이탈', color: '#EF4444' },
];

const CustomerCompositionChart = ({ segments }: Props) => {
  const segmentData = useMemo(() => {
    if (!segments) return [];
    return SEGMENT_CONFIG.map((s) => ({
      ...s,
      count: segments[s.key],
    }));
  }, [segments]);

  const total = segmentData.reduce((sum, s) => sum + s.count, 0);

  // 도넛 중앙 텍스트 플러그인
  const centerTextPlugin = {
    id: 'compositionCenterText',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeDraw(chart: any) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();

      ctx.font = '11px Pretendard, sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('전체', centerX, centerY - 10);

      ctx.font = 'bold 16px Pretendard, sans-serif';
      ctx.fillStyle = '#111827';
      ctx.fillText(`${formatNumber(total)}명`, centerX, centerY + 10);

      ctx.restore();
    },
  };

  const chartData = {
    labels: segmentData.map((s) => s.label),
    datasets: [
      {
        data: segmentData.map((s) => s.count),
        backgroundColor: segmentData.map((s) => s.color),
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { label?: string; raw?: unknown }) => {
            const count = ctx.raw as number;
            const ratio = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
            return `${ctx.label}: ${count.toLocaleString()}명 (${ratio}%)`;
          },
        },
      },
    },
  };

  if (!segments) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center p-5">
          <p className="text-gray-400">데이터를 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-5">
        <h4 className="text-base font-bold text-gray-900">현재 고객 구성</h4>

        <div className="flex flex-1 flex-col items-center gap-4 overflow-hidden sm:flex-row sm:gap-6">
          <div className="relative flex-shrink-0" style={{ width: '180px', height: '180px' }}>
            <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
          </div>

          <div className="w-full min-w-0 flex-1 space-y-3">
            {segmentData.map((s) => {
              const ratio = total > 0 ? ((s.count / total) * 100).toFixed(1) : '0.0';
              return (
                <div key={s.key} className="flex items-center gap-2 text-sm sm:gap-3">
                  <span
                    className="h-3 w-3 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="w-14 flex-shrink-0 truncate text-gray-600 sm:w-16">{s.label}</span>
                  <span className="min-w-0 flex-1 truncate font-semibold text-gray-900">
                    {formatNumber(s.count)}명
                  </span>
                  <span className="flex-shrink-0 rounded bg-gray-50 px-1.5 py-0.5 text-xs font-medium text-gray-500">
                    {ratio}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerCompositionChart;
