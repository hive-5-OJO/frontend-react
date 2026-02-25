import type { RFMScore } from '../types';
import {
  formatNumber,
  getRecencyScore,
  getFrequencyScore,
  getMonetaryScore,
  getRFMSegment,
} from '../utils';
import { Radar, Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface Props {
  rfmData: RFMScore;
}

const RFMTab = ({ rfmData }: Props) => {
  const recencyScore = getRecencyScore(rfmData.recency);
  const frequencyScore = getFrequencyScore(rfmData.frequency);
  const monetaryScore = getMonetaryScore(rfmData.monetary);
  const segment = getRFMSegment(recencyScore + frequencyScore + monetaryScore);

  const radarData = {
    labels: ['Recency', 'Frequency', 'Monetary'],
    datasets: [
      {
        label: 'RFM 점수',
        data: [recencyScore, frequencyScore, monetaryScore],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(99, 102, 241, 1)',
      },
    ],
  };

  const radarOptions: ChartOptions<'radar'> = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const barData = {
    labels: ['Recency', 'Frequency', 'Monetary'],
    datasets: [
      {
        label: '점수',
        data: [recencyScore, frequencyScore, monetaryScore],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* RFM 세그먼트 카드 */}
      <div className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">고객 세그먼트</p>
            <h3 className="mt-1 text-3xl font-bold">{segment.label}</h3>
            <p className="mt-2 text-sm opacity-90">
              총 RFM 점수: {recencyScore + frequencyScore + monetaryScore}/15
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">업데이트</p>
            <p className="text-sm font-medium">
              {new Date(rfmData.updatedAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>
      </div>

      {/* 차트 그리드 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          <h3 className="mb-3 text-base font-bold text-gray-900 md:mb-4 md:text-lg">
            RFM 종합 분석
          </h3>
          <div style={{ height: '250px', width: '100%', position: 'relative' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          <h3 className="mb-3 text-base font-bold text-gray-900 md:mb-4 md:text-lg">항목별 점수</h3>
          <div style={{ height: '250px', width: '100%', position: 'relative' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* RFM 상세 지표 */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {/* Recency */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recency</h3>
            <span className="rounded-full bg-primary-100 px-3 py-1 text-sm font-bold text-primary-600">
              {recencyScore}/5
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">마지막 구매일</span>
              <span className="font-semibold text-gray-900">
                {new Date(rfmData.recency).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">경과 일수</span>
              <span className="font-semibold text-gray-900">
                {Math.floor(
                  (new Date('2026-02-10').getTime() -
                    new Date(rfmData.recency).getTime()) /
                    (1000 * 60 * 60 * 24),
                )}
                일
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-primary-600 transition-all"
                style={{ width: `${(recencyScore / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Frequency */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Frequency</h3>
            <span className="rounded-full bg-info-100 px-3 py-1 text-sm font-bold text-info-600">
              {frequencyScore}/5
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">구매 횟수</span>
              <span className="font-semibold text-gray-900">
                {rfmData.frequency}회
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">평가 등급</span>
              <span className="font-semibold text-gray-900">
                {frequencyScore === 5
                  ? '매우 높음'
                  : frequencyScore >= 4
                    ? '높음'
                    : frequencyScore >= 3
                      ? '보통'
                      : '낮음'}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-info-600 transition-all"
                style={{ width: `${(frequencyScore / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Monetary */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Monetary</h3>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-600">
              {monetaryScore}/5
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">구매 금액</span>
              <span className="font-semibold text-gray-900">
                {formatNumber(rfmData.monetary)}원
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">가치 등급</span>
              <span className="font-semibold text-gray-900">
                {monetaryScore === 5
                  ? '최우수'
                  : monetaryScore >= 4
                    ? '우수'
                    : monetaryScore >= 3
                      ? '보통'
                      : '낮음'}
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${(monetaryScore / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 세그먼트별 추천 액션 */}
      <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-6 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-primary-900">
          <span>💡</span>
          <span>추천 마케팅 전략</span>
        </h3>
        <div className="space-y-2 text-sm text-primary-800">
          {segment.label === 'Champions' && (
            <>
              <p>• 최우수 고객입니다. VIP 프로그램 제공을 권장합니다.</p>
              <p>• 신제품 출시 시 우선 안내 대상입니다.</p>
              <p>• 추천 프로그램을 통한 신규 고객 유치를 유도하세요.</p>
            </>
          )}
          {segment.label === 'Loyal Customers' && (
            <>
              <p>• 충성도 높은 고객입니다. 리워드 프로그램을 제공하세요.</p>
              <p>• 정기적인 혜택 제공으로 관계를 유지하세요.</p>
              <p>• 업셀링/크로스셀링 기회를 모색하세요.</p>
            </>
          )}
          {segment.label === 'Potential Loyalists' && (
            <>
              <p>• 충성 고객으로 전환 가능성이 높습니다.</p>
              <p>• 멤버십 프로그램 가입을 유도하세요.</p>
              <p>• 개인화된 추천 상품을 제공하세요.</p>
            </>
          )}
          {segment.label === 'At Risk' && (
            <>
              <p className="text-orange-700">
                • 이탈 위험이 있습니다. 즉각적인 관리가 필요합니다.
              </p>
              <p className="text-orange-700">
                • 특별 할인이나 프로모션을 제공하세요.
              </p>
              <p className="text-orange-700">
                • 고객 만족도 조사를 실시하세요.
              </p>
            </>
          )}
          {segment.label === 'Lost' && (
            <>
              <p className="text-error-700">
                • 이탈한 고객입니다. 재활성화 캠페인이 필요합니다.
              </p>
              <p className="text-error-700">• 윈백 프로모션을 진행하세요.</p>
              <p className="text-error-700">
                • 이탈 사유를 파악하고 개선하세요.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFMTab;
