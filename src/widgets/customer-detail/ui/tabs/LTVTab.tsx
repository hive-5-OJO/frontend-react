import type { LTVData } from '@/entities/customer/model/types';
import { Card, CardContent, Badge, Alert, AlertDescription } from '@/shared/ui';
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
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">고객 생애 가치</p>
              <h3 className="mt-1 text-4xl font-bold">{formatNumber(ltvData.ltvAmount)}원</h3>
              <div className="mt-3 flex items-center gap-2">
                <Badge
                  className={`${ltvGradeInfo.bgColor} ${ltvGradeInfo.color} border-0 px-3 py-1`}
                >
                  {ltvGradeInfo.label}
                </Badge>
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
            <h3 className="mb-4 text-lg font-bold text-gray-900">이탈 위험도 분석</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3">
                <span className="text-sm text-gray-600">예상 이탈일</span>
                <span className="text-base font-semibold text-gray-900">
                  {new Date(ltvData.expectedChurnDate).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">남은 기간</span>
                <span className="text-2xl font-bold text-success-600">{daysUntilChurn}일</span>
              </div>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-success-600 transition-all"
                style={{ width: `${Math.min((daysUntilChurn / 365) * 100, 100)}%` }}
              />
            </div>
            <Alert variant="success" className="mt-4 border-success-200 bg-success-50">
              <AlertDescription className="text-success-700">
                <p className="flex items-center gap-2 text-sm">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">
                    안정적인 고객입니다. 현재 관계를 유지하세요.
                  </span>
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">고객 가치 등급</h3>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">현재 등급</span>
              <Badge
                className={`${ltvGradeInfo.bgColor} ${ltvGradeInfo.color} border-0 px-4 py-2 text-base`}
              >
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
                <div className="flex-1 bg-gray-400"></div>
              </div>
            </div>

            {/* 등급 레이블 */}
            <div className="flex justify-between text-xs text-gray-600">
              <span>TOP 10%</span>
              <span>TOP 20%</span>
              <span>TOP 30%</span>
              <span>MIDDLE</span>
              <span>LOW</span>
            </div>

            <Alert variant="default" className="mt-4 border-purple-200 bg-purple-50">
              <AlertDescription className="text-purple-700">
                <p className="flex items-start gap-2 text-sm">
                  <svg
                    className="mt-0.5 h-5 w-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">
                    최상위 고객입니다. VIP 대우와 특별 관리가 필요합니다.
                  </span>
                </p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      <Alert variant="default" className="border-2 border-purple-200 bg-purple-50">
        <AlertDescription className="text-purple-800">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-purple-900">
            <span>💡</span>
            <span>LTV 향상 전략</span>
          </h3>
          <div className="space-y-2 text-sm">
            {ltvData.ltvGrade === 'TOP_10' && (
              <>
                <p>• 최상위 고객입니다. 전담 매니저 배정을 고려하세요.</p>
                <p>• 프리미엄 서비스 및 독점 혜택을 제공하세요.</p>
              </>
            )}
            {ltvData.ltvGrade === 'TOP_20' && (
              <>
                <p>• 상위 고객입니다. VIP 프로그램 가입을 제안하세요.</p>
                <p>• 고가 상품 추천으로 LTV를 증대시킬 수 있습니다.</p>
              </>
            )}
            {daysUntilChurn < 60 && (
              <p className="font-semibold text-error-700">
                ⚠️ 이탈 예정일이 임박했습니다. 리텐션 캠페인을 즉시 실행하세요.
              </p>
            )}
            {daysUntilChurn >= 60 && daysUntilChurn < 120 && (
              <p className="text-warning-700">
                • 이탈 예정일이 다가오고 있습니다. 사전 예방 조치를 취하세요.
              </p>
            )}
            <p>
              • 평균 주문 금액: {formatNumber(Math.round(ltvData.avgOrderValue))}원 - 고가 상품
              추천으로 증대 가능
            </p>
            <p>• 정기적인 소통과 맞춤형 제안으로 고객 관계를 강화하세요.</p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LTVTab;
