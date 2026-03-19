import type { RFMScore } from '@/entities/customer/model/types';
import { Card, CardContent, Badge, Alert, AlertDescription } from '@/shared/ui';
import {
  formatNumber,
  // getRecencyScore,
  // getFrequencyScore,
  // getMonetaryScore,
  getRFMSegment,
} from '../../utils';
import { Radar, Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

interface Props {
  rfmData: RFMScore;
}

const RFMTab = ({ rfmData }: Props) => {
  console.log('RFMTab check:', rfmData);
  // const recencyScore = getRecencyScore(rfmData.rScore);
  // const frequencyScore = getFrequencyScore(rfmData.fScore);
  // const monetaryScore = getMonetaryScore(rfmData.mScore);
  const recencyScore = rfmData.rScore;
  const frequencyScore = rfmData.fScore;
  const monetaryScore = rfmData.mScore;
  const segment = getRFMSegment(rfmData.segmentType);

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
    scales: { r: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } } },
    plugins: { legend: { display: false } },
  };

  const barData = {
    labels: ['Recency', 'Frequency', 'Monetary'],
    datasets: [
      {
        label: '점수',
        data: [recencyScore, frequencyScore, monetaryScore],
        backgroundColor: ['rgba(99, 102, 241, 0.8)', 'rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)'],
        borderColor: ['rgba(99, 102, 241, 1)', 'rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const barOptions: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } } },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
        <CardContent className="p-6">
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
        </CardContent>
      </Card>

      <Alert variant="default" className="border-2 border-primary-200 bg-primary-50">
        <AlertDescription className="text-primary-800">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-primary-900">
            <span>💡</span>
            <span>추천 마케팅 전략</span>
          </h3>
          <div className="space-y-2 text-sm">
            {segment.label === 'Champions' && (
              <>
                <p>• 최우수 고객입니다. VIP 프로그램 제공을 권장합니다.</p>
                <p>• 신제품 출시 시 우선 안내 대상입니다.</p>
              </>
            )}
            {segment.label === 'Loyal Customers' && (
              <>
                <p>• 충성도 높은 고객입니다. 리워드 프로그램을 제공하세요.</p>
                <p>• 업셀링/크로스셀링 기회를 모색하세요.</p>
              </>
            )}
            {segment.label === 'Potential Loyalists' && (
              <>
                <p>• 잠재 충성 고객입니다. 멤버십 혜택을 제공하세요.</p>
                <p>• 정기적인 소통으로 관계를 강화하세요.</p>
              </>
            )}
            {segment.label === 'New Customers' && (
              <>
                <p>• 신규 고객입니다. 온보딩 프로그램을 제공하세요.</p>
                <p>• 첫 구매 후 만족도 조사를 진행하세요.</p>
              </>
            )}
            {segment.label === 'At Risk' && (
              <>
                <p className="text-warning-700">
                  • 이탈 위험이 있습니다. 즉각적인 관리가 필요합니다.
                </p>
                <p>• 특별 할인이나 프로모션을 제공하세요.</p>
              </>
            )}
            {segment.label === 'Lost' && (
              <>
                <p className="text-error-700">
                  • 이탈한 고객입니다. 재활성화 캠페인이 필요합니다.
                </p>
                <p>• 윈백 이메일이나 특별 오퍼를 발송하세요.</p>
              </>
            )}
            {![
              'Champions',
              'Loyal Customers',
              'Potential Loyalists',
              'New Customers',
              'At Risk',
              'Lost',
            ].includes(segment.label) && (
              <>
                <p>• 고객 세그먼트에 맞는 맞춤형 마케팅을 진행하세요.</p>
                <p>• 정기적인 고객 분석으로 변화를 모니터링하세요.</p>
              </>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4 md:p-6">
            <h3 className="mb-3 text-base font-bold text-gray-900 md:mb-4 md:text-lg">
              RFM 종합 분석
            </h3>
            <div style={{ height: '250px', width: '100%', position: 'relative' }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <h3 className="mb-3 text-base font-bold text-gray-900 md:mb-4 md:text-lg">
              항목별 점수
            </h3>
            <div style={{ height: '250px', width: '100%', position: 'relative' }}>
              <Bar data={barData} options={barOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Recency</h3>
              <Badge variant="primary" className="px-3 py-1">
                {recencyScore}/5
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">마지막 구매일</span>
                <span className="font-medium text-gray-900">
                  {new Date(rfmData.recency).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">경과 일수</span>
                <span className="font-medium text-gray-900">
                  {Math.floor(
                    (new Date().getTime() - new Date(rfmData.recency).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                  일
                </span>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-primary-600 transition-all"
                style={{ width: `${(recencyScore / 5) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Frequency</h3>
              <Badge variant="info" className="px-3 py-1">
                {frequencyScore}/5
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">구매 횟수</span>
                <span className="font-medium text-gray-900">{rfmData.frequency}회</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">평가 등급</span>
                <span className="font-medium text-gray-900">
                  {frequencyScore >= 4 ? '높음' : frequencyScore >= 3 ? '보통' : '낮음'}
                </span>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-info-600 transition-all"
                style={{ width: `${(frequencyScore / 5) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Monetary</h3>
              <Badge variant="success" className="px-3 py-1">
                {monetaryScore}/5
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">구매 금액</span>
                <span className="font-medium text-gray-900">
                  {formatNumber(rfmData.monetary)}원
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">가치 등급</span>
                <span className="font-medium text-gray-900">
                  {monetaryScore >= 4 ? '보통' : monetaryScore >= 3 ? '보통' : '낮음'}
                </span>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-success-600 transition-all"
                style={{ width: `${(monetaryScore / 5) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default RFMTab;
