import type { Customer, CustomerFeature } from '../types';
import { formatNumber, getStatusLabel } from '../utils';

interface Props {
  customer: Customer;
  featureData: CustomerFeature;
}

const ServiceSection = ({ customer, featureData }: Props) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">이용 서비스</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">현재 요금제:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {customer.service || '-'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">월 요금:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {formatNumber(featureData.monetary.avgMonthlyBill)}원
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">부가 서비스:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.usage.premiumServiceCount}개
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">상태:</span>
            <span
              className={`ml-2 text-sm font-semibold ${
                featureData.lifecycle.isTerminatedFlag
                  ? 'text-gray-600'
                  : featureData.lifecycle.isDormantFlag
                    ? 'text-orange-600'
                    : 'text-success-600'
              }`}
            >
              {getStatusLabel(
                featureData.lifecycle.isTerminatedFlag,
                featureData.lifecycle.isDormantFlag,
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSection;
