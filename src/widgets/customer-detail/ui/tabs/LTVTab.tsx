import type { LTVData } from '@/entities/customer/model/types';
import { Card, CardContent, Badge } from '@/shared/ui';
import { formatNumber } from '../../utils';
import { Bar } from 'react-chartjs-2';
import { Star } from 'lucide-react';

interface Props {
  ltvData: LTVData;
}

const LTVTab = ({ ltvData }: Props) => {
  // LTV 등급 계산 (LTV 값 기준)
  const getLTVGrade = (ltv: number) => {
    if (ltv >= 2700000) return { label: 'TOP 10%', color: 'bg-purple-100 text-purple-700', icon: true };
    if (ltv >= 1800000) return { label: 'TOP 30%', color: 'bg-blue-100 text-blue-700', icon: false };
    if (ltv >= 900000) return { label: '평균 이상', color: 'bg-green-100 text-green-700', icon: false };
    return { label: '평균 이하', color: 'bg-gray-100 text-gray-700', icon: false };
  };

  const ltvGradeInfo = getLTVGrade(ltvData.ltv);

  const ltvChartData = {
    labels: ['1개월', '3개월', '6개월', '12개월', '예상 LTV'],
    datasets: [
      {
        label: '누적 수익 (원)',
        data: [
          Math.floor(ltvData.avgValue),
          Math.floor(ltvData.avgValue * 3),
          Math.floor(ltvData.avgValue * 6),
          Math.floor(ltvData.avgValue * 12),
          Math.floor(ltvData.ltv),
        ],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ltvChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: string | number) {
            return formatNumber(Math.floor(Number(value))) + '원';
          },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context: { parsed: { y: number | null } }) {
            return formatNumber(Math.floor(context.parsed.y || 0)) + '원';
          },
        },
      },
    },
  } as const;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">고객 생애 가치 (LTV)</p>
              <h3 className="mt-1 text-4xl font-bold">{formatNumber(Math.floor(ltvData.ltv))}원</h3>
              <div className="mt-3 flex items-center gap-2">
                <Badge
                  className={`${ltvGradeInfo.color} border-0 px-3 py-1`}
                >
                  {ltvGradeInfo.icon && <Star className="mr-1 h-3.5 w-3.5 fill-current" />}
                  {ltvGradeInfo.label}
                </Badge>
                <span className="text-sm opacity-90">등급</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">서비스 이용 기간</p>
              <p className="text-lg font-bold">{ltvData.lifespanDays}일</p>
              <p className="mt-1 text-sm opacity-90">({Math.floor(ltvData.lifespanDays / 30)}개월)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">예상 수익 추이</h3>
          <div style={{ height: '300px', width: '100%', position: 'relative' }}>
            <Bar data={ltvChartData} options={ltvChartOptions} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">주요 지표</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-gray-600">평균 주문 금액</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatNumber(Math.floor(ltvData.avgValue))}원
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-gray-600">총 결제 금액</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatNumber(Math.floor(ltvData.totalRevenue))}원
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm text-gray-600">결제 횟수</span>
                <span className="text-base font-semibold text-gray-900">
                  {ltvData.frequency}회
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">서비스 이용 기간</span>
                <span className="text-base font-semibold text-gray-900">
                  {ltvData.lifespanDays}일
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">고객 가치 등급</h3>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">현재 등급</span>
              <Badge
                className={`${ltvGradeInfo.color} border-0 px-4 py-2 text-base`}
              >
                {ltvGradeInfo.icon && <Star className="mr-1 h-4 w-4 fill-current" />}
                {ltvGradeInfo.label}
              </Badge>
            </div>

            {/* 등급 바 */}
            <div className="relative mb-2">
              <div className="flex h-8 overflow-hidden rounded-full">
                <div className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500"></div>
                <div className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                <div className="flex-1 bg-gradient-to-r from-blue-500 to-teal-500"></div>
                <div className="flex-1 bg-gradient-to-r from-teal-500 to-gray-400"></div>
              </div>
            </div>

            {/* 등급 레이블 */}
            <div className="flex justify-between text-xs text-gray-600">
              <span>TOP 10%</span>
              <span>TOP 30%</span>
              <span>평균 이상</span>
              <span>평균 이하</span>
            </div>

            <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
              <p className="flex items-start gap-2 text-sm text-purple-700">
                <svg
                  className="mt-0.5 h-5 w-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">
                  {ltvData.ltv >= 2700000 && '최상위 고객입니다. VIP 대우와 특별 관리가 필요합니다.'}
                  {ltvData.ltv >= 1800000 && ltvData.ltv < 2700000 && '상위 고객입니다. 프리미엄 서비스를 제공하세요.'}
                  {ltvData.ltv >= 900000 && ltvData.ltv < 1800000 && '평균 이상 고객입니다. 지속적인 관리가 필요합니다.'}
                  {ltvData.ltv < 900000 && '평균 이하 고객입니다. LTV 향상 전략이 필요합니다.'}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LTVTab;
