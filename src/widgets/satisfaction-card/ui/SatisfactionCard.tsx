import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Card, CardContent } from '@/shared/ui';
import { satisfactionData } from '@/pages/dashboard/mockDashboardData';

ChartJS.register(ArcElement, Tooltip);

const colors = ['#3B82F6', '#60A5FA', '#F59E0B', '#F97316', '#EF4444'];

const SatisfactionCard = () => {
  // 도넛 중앙 텍스트 플러그인
  const centerTextPlugin = {
    id: 'satisfactionCenterText',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    beforeDraw(chart: any) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      ctx.save();

      ctx.font = 'bold 22px Pretendard, sans-serif';
      ctx.fillStyle = '#111827';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(satisfactionData.averageScore), centerX, centerY - 6);

      ctx.font = '10px Pretendard, sans-serif';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText('평균', centerX, centerY + 12);

      ctx.restore();
    },
  };

  const chartData = {
    labels: satisfactionData.scoreDistribution.map((d) => d.label),
    datasets: [
      {
        data: satisfactionData.scoreDistribution.map((d) => d.count),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (ctx: { label?: string; raw?: unknown }) => {
            const count = ctx.raw as number;
            const ratio = ((count / satisfactionData.totalEvaluations) * 100).toFixed(1);
            return `${ctx.label}: ${count.toLocaleString()}건 (${ratio}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-5">
        <h4 className="mb-1 text-base font-bold text-gray-900">상담 만족도 통계</h4>
        <p className="mb-3 text-xs text-gray-400">
          총 {satisfactionData.totalEvaluations.toLocaleString()}건
        </p>

        <div className="flex flex-1 items-center gap-5">
          {/* 도넛 차트 */}
          <div className="relative flex-shrink-0" style={{ width: '110px', height: '110px' }}>
            <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
          </div>

          {/* 분포 리스트 */}
          <div className="flex-1 space-y-2">
            {satisfactionData.scoreDistribution.map((d, i) => (
              <div key={d.score} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: colors[i] }}
                />
                <span className="w-14 text-gray-600">{d.label}</span>
                <div className="group relative flex-1">
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(d.count / satisfactionData.totalEvaluations) * 100}%`,
                        backgroundColor: colors[i],
                      }}
                    />
                  </div>
                  {/* 툴팁 */}
                  <div className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {d.label}: {d.count}건 ({((d.count / satisfactionData.totalEvaluations) * 100).toFixed(1)}%)
                    <div className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-gray-900" />
                  </div>
                </div>
                <span className="w-8 text-right font-medium text-gray-700">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SatisfactionCard;
