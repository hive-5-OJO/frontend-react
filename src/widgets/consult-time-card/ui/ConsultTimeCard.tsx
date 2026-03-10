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
import { useConsultTimeStats } from '@/entities/dashboard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const ConsultTimeCard = () => {
  const { data, isLoading, error } = useConsultTimeStats();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center p-5">
          <div className="text-center">
            <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-sm text-gray-500">데이터를 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center p-5">
          <p className="text-sm text-gray-500">데이터를 불러올 수 없습니다</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: data.map((d) => `${d.hour}시`),
    datasets: [
      {
        label: '인바운드',
        data: data.map((d) => d.inbound),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderRadius: 3,
      },
      {
        label: '아웃바운드',
        data: data.map((d) => d.outbound),
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
      tooltip: {
        callbacks: {
          footer: (tooltipItems: { dataIndex: number }[]) => {
            const index = tooltipItems[0].dataIndex;
            return `총 상담: ${data[index].total.toLocaleString()}건`;
          },
        },
      },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { 
        stacked: true, 
        grid: { color: 'rgba(0,0,0,0.05)' }, 
        ticks: { 
          font: { size: 11 },
          callback: (value: string | number) => {
            return typeof value === 'number' ? value.toLocaleString() : value;
          },
        },
      },
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
