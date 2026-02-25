import type { Customer, CustomerFeature } from './types';
import { formatNumber, getStatusColor, getStatusLabel, getAlertLevel } from './utils';

interface Props {
  customer: Customer;
  featureData: CustomerFeature;
  onClose: () => void;
}

const CustomerDetailHeader = ({ customer, featureData, onClose }: Props) => {
  const alertLevel = getAlertLevel(featureData.consultation.last7dConsultCount);

  return (
    <div className="border-b border-gray-200 bg-white px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold text-gray-900">
              {customer.name}
            </h2>
            {customer.isVip && (
              <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-600">
                VIP
              </span>
            )}
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-medium ${getStatusColor(
                featureData.lifecycle.isTerminatedFlag,
                featureData.lifecycle.isDormantFlag,
              )}`}
            >
              {getStatusLabel(
                featureData.lifecycle.isTerminatedFlag,
                featureData.lifecycle.isDormantFlag,
              )}
            </span>
            {featureData.lifecycle.isNewCustomerFlag && (
              <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                신규 가입
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <span>최근 7일 상담:</span>
              <span
                className={`font-semibold ${
                  alertLevel === 'high'
                    ? 'text-red-600'
                    : alertLevel === 'medium'
                      ? 'text-orange-600'
                      : 'text-gray-900'
                }`}
              >
                {featureData.consultation.last7dConsultCount}건
              </span>
              {alertLevel !== 'low' && <span className="text-red-600">⚠️</span>}
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5">
              <span>불만:</span>
              <span
                className={`font-semibold ${
                  featureData.consultation.totalComplaintCount > 0
                    ? 'text-red-600'
                    : 'text-gray-900'
                }`}
              >
                {featureData.consultation.totalComplaintCount}건
              </span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5">
              <span>마지막 상담:</span>
              <span className="font-semibold text-gray-900">
                {featureData.consultation.lastConsultDaysAgo}일 전
              </span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5">
              <span>누적 결제:</span>
              <span className="font-semibold text-indigo-600">
                {formatNumber(featureData.monetary.totalRevenue)}원
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomerDetailHeader;
