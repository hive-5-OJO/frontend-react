import type { CustomerFeature } from '../types';
import { formatNumber } from '../utils';

interface Props {
  featureData: CustomerFeature;
}

const PaymentSection = ({ featureData }: Props) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">결제 정보</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">누적 결제 금액:</span>
            <span className="ml-2 text-sm font-semibold text-indigo-600">
              {formatNumber(featureData.monetary.totalRevenue)}원
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">당월 결제:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {formatNumber(featureData.monetary.monthlyRevenue)}원
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">전월 결제:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {formatNumber(featureData.monetary.prevMonthlyRevenue)}원
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">최근 결제:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {formatNumber(featureData.monetary.lastPaymentAmount)}원
            </span>
            <span className="ml-1 text-xs text-gray-500">
              ({featureData.monetary.lastPaymentDate})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">6개월 평균:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {formatNumber(Math.round(featureData.monetary.avgMonthlyBill))}원
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">구매 주기:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.monetary.purchaseCycle}일
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">연체 횟수:</span>
            <span
              className={`ml-2 text-sm font-semibold ${
                featureData.monetary.paymentDelayCount > 0
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {featureData.monetary.paymentDelayCount}회
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSection;
