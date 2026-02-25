import type { CustomerFeature } from '../types';
import { formatNumber } from '../utils';

interface Props {
  featureData: CustomerFeature;
}

const UsageSection = ({ featureData }: Props) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">이용 현황</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">당월 총 이용량:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {formatNumber(featureData.usage.totalUsageAmount)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">일 평균 이용량:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {formatNumber(Math.round(featureData.usage.avgDailyUsage))}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">최대 일일 이용량:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {formatNumber(featureData.usage.maxUsageAmount)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">주 사용 시간대:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.usage.usagePeakHour}시
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">부가서비스:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.usage.premiumServiceCount}개
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">30일 활동일:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.usage.usageActiveDays30d}일
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">마지막 이용:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.usage.lastActivityDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageSection;
