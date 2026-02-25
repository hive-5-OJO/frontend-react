import type { LTVData } from '../types';
import { formatNumber, getLTVGradeInfo, getDaysUntilChurn } from '../utils';
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
      legend: {
        display: false,
      },
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
      {/* LTV 등급 카드 */}
      <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">고객 생애 가치</p>
            <h3 className="mt-1 text-4xl font-bold">
              {formatNumber(ltvData.ltvAmount)}원
            </h3>
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`rounded-full ${ltvGradeInfo.bgColor} px-3 py-1 text-sm font-bold ${ltvGradeInfo.color}`}
              >
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

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-vip-100 p-2">
              <svg
                className="h-5 w-5 text-vip-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-600">총 LTV</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(ltvData.ltvAmount)}원
          </p>
          <p className="mt-1 text-xs text-gray-500">예상 생애 가치</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-info-100 p-2">
              <svg
                className="h-5 w-5 text-info-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-600">평균 주문액</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(Math.round(ltvData.avgOrderValue))}원
          </p>
          <p className="mt-1 text-xs text-gray-500">건당 평균 금액</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-full bg-green-100 p-2">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-600">예상 거래</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {Math.round(ltvData.ltvAmount / ltvData.avgOrderValue)}회
          </p>
          <p className="mt-1 text-xs text-gray-500">생애 예상 거래 횟수</p>
        </div>
      </div>

      {/* LTV 추이 차트 */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-gray-900">예상 수익 추이</h3>
        <div className="flex items-center justify-center">
          <div className="w-full">
            <Bar data={ltvChartData} options={ltvChartOptions} />
          </div>
        </div>
      </div>

      {/* 상세 분석 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        {/* 이탈 위험도 */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            이탈 위험도 분석
          </h3>
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">예상 이탈일</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date(ltvData.expectedChurnDate).toLocaleDateString(
                    'ko-KR',
                  )}
                </span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-600">남은 기간</span>
                <span
                  className={`text-sm font-semibold ${
                    daysUntilChurn < 30
                      ? 'text-error-600'
                      : daysUntilChurn < 90
                        ? 'text-warning-600'
                        : 'text-success-600'
                  }`}
                >
                  {daysUntilChurn}일
                </span>
              </div>
              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full transition-all ${
                    daysUntilChurn < 30
                      ? 'bg-error-600'
                      : daysUntilChurn < 90
                        ? 'bg-warning-600'
                        : 'bg-success-600'
                  }`}
                  style={{
                    width: `${Math.min(100, (daysUntilChurn / 365) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                {daysUntilChurn < 30 ? (
                  <span className="text-error-600">
                    ⚠️ 이탈 위험이 매우 높습니다. 즉각적인 리텐션 활동이
                    필요합니다.
                  </span>
                ) : daysUntilChurn < 90 ? (
                  <span className="text-warning-600">
                    ⚠️ 이탈 위험이 있습니다. 고객 관리가 필요합니다.
                  </span>
                ) : (
                  <span className="text-success-600">
                    ✓ 안정적인 고객입니다. 현재 관계를 유지하세요.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 가치 등급 분석 */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            고객 가치 등급
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">현재 등급</span>
              <span
                className={`rounded-full ${ltvGradeInfo.bgColor} px-3 py-1 text-sm font-bold ${ltvGradeInfo.color}`}
              >
                {ltvGradeInfo.label}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">TOP 10%</span>
                <span className="text-gray-500">TOP 20%</span>
                <span className="text-gray-500">TOP 30%</span>
                <span className="text-gray-500">MIDDLE</span>
                <span className="text-gray-500">LOW</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full">
                <div className="w-1/5 bg-vip-600"></div>
                <div className="w-1/5 bg-primary-600"></div>
                <div className="w-1/5 bg-info-600"></div>
                <div className="w-1/5 bg-success-600"></div>
                <div className="w-1/5 bg-gray-400"></div>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm text-gray-700">
                {ltvData.ltvGrade === 'TOP_10' ? (
                  <span className="text-vip-600">
                    ⭐ 최상위 고객입니다. VIP 대우와 특별 관리가 필요합니다.
                  </span>
                ) : ltvData.ltvGrade === 'TOP_20' ? (
                  <span className="text-primary-600">
                    ⭐ 우수 고객입니다. 지속적인 관계 유지가 중요합니다.
                  </span>
                ) : ltvData.ltvGrade === 'TOP_30' ? (
                  <span className="text-info-600">
                    상위 고객입니다. 업셀링 기회를 모색하세요.
                  </span>
                ) : (
                  <span className="text-gray-600">
                    일반 고객입니다. 가치 향상 전략이 필요합니다.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LTV 향상 전략 */}
      <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-6 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-purple-900">
          <span>💡</span>
          <span>LTV 향상 전략</span>
        </h3>
        <div className="space-y-2 text-sm text-purple-800">
          {ltvData.ltvGrade === 'TOP_10' && (
            <>
              <p>• 최상위 고객입니다. 전담 매니저 배정을 고려하세요.</p>
              <p>
                • 프리미엄 서비스와 독점 혜택을 제공하여 충성도를 강화하세요.
              </p>
              <p>• 장기 계약 유도를 통해 안정적인 관계를 유지하세요.</p>
            </>
          )}
          {ltvData.ltvGrade === 'TOP_20' && (
            <>
              <p>• 우수 고객입니다. TOP 10%로 상향 가능성이 있습니다.</p>
              <p>• 크로스셀링과 업셀링을 통해 거래 금액을 증대하세요.</p>
              <p>• 정기적인 혜택 제공으로 만족도를 높이세요.</p>
            </>
          )}
          {ltvData.ltvGrade === 'TOP_30' && (
            <>
              <p>• 상위 고객입니다. 추가 가치 창출 기회가 있습니다.</p>
              <p>• 개인화된 추천을 통해 구매 빈도를 높이세요.</p>
              <p>• 멤버십 프로그램 가입을 유도하세요.</p>
            </>
          )}
          {daysUntilChurn < 60 && (
            <p className="text-error-700">
              ⚠️ 이탈 예정일이 임박했습니다. 리텐션 캠페인을 즉시 실행하세요.
            </p>
          )}
          <p>
            • 평균 주문 금액: {formatNumber(Math.round(ltvData.avgOrderValue))}원
            - 고가 상품 추천으로 증대 가능
          </p>
        </div>
      </div>
    </div>
  );
};

export default LTVTab;
