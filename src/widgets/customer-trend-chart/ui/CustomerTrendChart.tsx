import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent } from '@/shared/ui';
import type { DashboardDailyStat } from '@/entities/dashboard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  dailyStats: DashboardDailyStat[];
}

const CustomerTrendChart = ({ dailyStats }: Props) => {
  const { labels, newCustomers, churnedCustomers, activeCustomers, summary } = useMemo(() => {
    const sorted = [...dailyStats].sort((a, b) => a.date.localeCompare(b.date));
    return {
      labels: sorted.map((d) => {
        const date = new Date(d.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }),
      newCustomers: sorted.map((d) => d.newCustomers),
      churnedCustomers: sorted.map((d) => d.churnedCustomers),
      activeCustomers: sorted.map((d) => d.activeCustomers),
      summary: {
        newCustomers: sorted.reduce((s, d) => s + d.newCustomers, 0),
        churnedCustomers: sorted.reduce((s, d) => s + d.churnedCustomers, 0),
        activeCustomers: sorted.reduce((s, d) => s + d.activeCustomers, 0),
      },
    };
  }, [dailyStats]);

  const chartData = {
    labels,
    datasets: [
      {
        label: '신규 고객',
        data: newCustomers,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
      },
      {
        label: '이탈 고객',
        data: churnedCustomers,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(239, 68, 68)',
      },
      {
        label: '활성 고객',
        data: activeCustomers,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: 'rgb(34, 197, 94)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, padding: 16, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: function (context: { dataset: { label?: string }; parsed: { y: number | null } }) {
            return `${context.dataset.label}: ${(context.parsed.y ?? 0).toLocaleString()}명`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: {
          callback: function (value: string | number) {
            return `${value}명`;
          },
        },
      },
      x: { grid: { display: false } },
    },
  } as const;

  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <h4 className="mb-3 text-base font-bold text-gray-900">최근 7일 트렌드</h4>
        <div style={{ height: '220px' }}>
          <Line data={chartData} options={options} />
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-lg bg-gray-50 p-3">
          <span className="text-sm font-medium text-gray-500">최근 7일</span>
          <div className="flex gap-4 text-sm">
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
              신규 고객 <span className="font-bold">{summary.newCustomers.toLocaleString()}명</span>
            </span>
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-red-500"></span>
              이탈 고객 <span className="font-bold">{summary.churnedCustomers.toLocaleString()}명</span>
            </span>
            <span>
              <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-500"></span>
              활성 고객 <span className="font-bold">{summary.activeCustomers.toLocaleString()}명</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerTrendChart;
