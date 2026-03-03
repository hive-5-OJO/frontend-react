import type { LTVData } from '@/entities/customer/model/types';
import { formatNumber, getLTVGradeInfo, getDaysUntilChurn } from '../../utils';
import { Bar } from 'react-chartjs-2';

interface Props {
  ltvData: LTVData;
}

const LTVTab = ({ ltvData }: Props) => {
  const ltvGradeInfo = getLTVGradeInfo(ltvData.ltvGrade);
  const daysUntilChurn = getDaysUntilChurn(ltvData.expectedChurnDate);

  const ltvChartData = {
    labels: ['1개월', '3개월', '6개월', '12개월', '예상 LTV'],
    datasets: [
      {
        label: '누적 수익 (원)',
        data: [
          ltvData.avgOrderValue,
          ltvData.avgOrderValue * 3,
          ltvData.avgOrderValue * 6,
          ltvData.avgOrderValue * 12,
          ltvData.ltvAmount,
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ltvChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            return formatNumber(Number(value)) + '원';
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: { parsed: { y: number | null } }) {
            return formatNumber(context.parsed.y || 0) + '원';
          },
        },
      },
    },
  } as const;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">고객 생애 가치</p>
            <h3 className="mt-1 text-4xl font-bold">{formatNumber(ltvData.ltvAmount)}원</h3>
            <div className="mt-3 flex items-center gap-2">
              <span className={`rounded-full ${ltvGradeInfo.bgColor} px-3 py-1 text-sm font-bold ${ltvGradeInfo.color}`}>
                {ltvGradeInfo.label}
              </span>
              <span className="text-sm opacity-90">등급</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">예상 이탈일</p>
            <p className="text-lg font-bold">
              {new Date(ltvData.expectedChurnDate).toLocaleDateString('ko-KR')}
            </p>
            <p className="mt-1 text-sm opacity-90">({daysUntilChurn}일 남음)</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-900">예상 수익 추이</h3>
        <Bar data={ltvChartData} options={ltvChartOptions} />
      </div>

      <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-6 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-purple-900">
          <span>💡</span><span>LTV 향상 전략</span>
        </h3>
        <div className="space-y-2 text-sm text-purple-800">
          {ltvData.ltvGrade === 'TOP_10' && (
            <p>• 최상위 고객입니다. 전담 매니저 배정을 고려하세요.</p>
          )}
          {daysUntilChurn < 60 && (
            <p className="text-error-700">⚠️ 이탈 예정일이 임박했습니다. 리텐션 캠페인을 즉시 실행하세요.</p>
          )}
          <p>• 평균 주문 금액: {formatNumber(Math.round(ltvData.avgOrderValue))}원 - 고가 상품 추천으로 증대 가능</p>
        </div>
      </div>
    </div>
  );
};

export default LTVTab;
