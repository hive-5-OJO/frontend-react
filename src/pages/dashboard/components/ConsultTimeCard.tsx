import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Card, CardContent } from '@/shared/ui';
import { consultTimeData } from '../mockDashboardData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ConsultTimeCard = () => {
  const chartData = {
    labels: consultTimeData.map((d) => `${d.hour}시`),
    datasets: [
      {
        label: '인바운드',
        data: consultTimeData.map((d) => d.inbound),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 3,
      },
      {
        label: '아웃바운드',
        data: consultTimeData.map((d) => d.outbound),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, padding: 12, font: { size: 11 } },
      },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 } } },
    },
  };

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-5">
        <h4 className="mb-3 text-base font-bold text-gray-900">상담 시간대별 통계</h4>
        <div className="min-h-0 flex-1">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultTimeCard;
