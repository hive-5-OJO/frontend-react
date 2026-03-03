import type { RFMScore } from '@/entities/customer/model/types';
import {
  formatNumber,
  getRecencyScore,
  getFrequencyScore,
  getMonetaryScore,
  getRFMSegment,
} from '../../utils';
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

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          <h3 className="mb-3 text-base font-bold text-gray-900 md:mb-4 md:text-lg">RFM 종합 분석</h3>
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

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        {[
          { label: 'Recency', score: recencyScore, color: 'primary', detail: `마지막 구매일: ${new Date(rfmData.recency).toLocaleDateString('ko-KR')}` },
          { label: 'Frequency', score: frequencyScore, color: 'info', detail: `구매 횟수: ${rfmData.frequency}회` },
          { label: 'Monetary', score: monetaryScore, color: 'green', detail: `구매 금액: ${formatNumber(rfmData.monetary)}원` },
        ].map(({ label, score, color, detail }) => (
          <div key={label} className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{label}</h3>
              <span className={`rounded-full bg-${color}-100 px-3 py-1 text-sm font-bold text-${color}-600`}>
                {score}/5
              </span>
            </div>
            <p className="text-sm text-gray-600">{detail}</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className={`h-full bg-${color}-600 transition-all`} style={{ width: `${(score / 5) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border-2 border-primary-200 bg-primary-50 p-6 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-primary-900">
          <span>💡</span><span>추천 마케팅 전략</span>
        </h3>
        <div className="space-y-2 text-sm text-primary-800">
          {segment.label === 'Champions' && (
            <><p>• 최우수 고객입니다. VIP 프로그램 제공을 권장합니다.</p><p>• 신제품 출시 시 우선 안내 대상입니다.</p></>
          )}
          {segment.label === 'Loyal Customers' && (
            <><p>• 충성도 높은 고객입니다. 리워드 프로그램을 제공하세요.</p><p>• 업셀링/크로스셀링 기회를 모색하세요.</p></>
          )}
          {segment.label === 'At Risk' && (
            <p className="text-orange-700">• 이탈 위험이 있습니다. 즉각적인 관리가 필요합니다.</p>
          )}
          {segment.label === 'Lost' && (
            <p className="text-error-700">• 이탈한 고객입니다. 재활성화 캠페인이 필요합니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RFMTab;
