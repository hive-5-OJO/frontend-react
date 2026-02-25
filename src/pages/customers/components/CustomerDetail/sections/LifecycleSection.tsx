import type { CustomerFeature } from '../types';

interface Props {
  featureData: CustomerFeature;
}

const LifecycleSection = ({ featureData }: Props) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">생애주기 정보</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">가입일:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.lifecycle.signupDate}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">가입 후 경과:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.lifecycle.memberLifetimeDays}일
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">마지막 활동:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.lifecycle.daysSinceLastActivity}일 전
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">계약 만료:</span>
            <span
              className={`ml-2 text-sm font-semibold ${
                featureData.lifecycle.contractEndDaysLeft < 30
                  ? 'text-error-600'
                  : 'text-gray-900'
              }`}
            >
              {featureData.lifecycle.contractEndDaysLeft}일 남음
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifecycleSection;
