import type { CustomerFeature } from '../types';

interface Props {
  featureData: CustomerFeature;
}

const AIInsightSection = ({ featureData }: Props) => {
  return (
    <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6 shadow-sm">
      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-indigo-900">
        <span>💡</span>
        <span>AI 인사이트</span>
      </h3>
      <div className="space-y-2 text-sm text-indigo-800">
        {featureData.consultation.last7dConsultCount >= 5 && (
          <p>• 최근 상담 빈도가 높습니다. 우선 대응이 필요합니다.</p>
        )}
        {featureData.lifecycle.contractEndDaysLeft < 60 && (
          <p>• 계약 만료가 임박했습니다. 갱신 안내를 권장합니다.</p>
        )}
        {featureData.monetary.paymentDelayCount === 0 && (
          <p>• 결제 이력이 우수한 고객입니다.</p>
        )}
        {featureData.usage.usageActiveDays30d >= 25 && (
          <p>• 서비스 활용도가 높은 충성 고객입니다.</p>
        )}
        {featureData.consultation.totalComplaintCount > 0 && (
          <p className="text-red-700">
            • 불만 상담 이력이 있습니다. 세심한 관리가 필요합니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default AIInsightSection;
