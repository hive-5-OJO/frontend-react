import type { CustomerFeature } from '../types';
import { getCategoryLabel } from '../utils';

interface Props {
  featureData: CustomerFeature;
}

const ConsultSection = ({ featureData }: Props) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">상담 요약</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">전체 상담:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.consultation.totalConsultCount}건
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">최근 7일:</span>
            <span
              className={`ml-2 text-sm font-semibold ${
                featureData.consultation.last7dConsultCount >= 5
                  ? 'text-red-600'
                  : featureData.consultation.last7dConsultCount >= 3
                    ? 'text-orange-600'
                    : 'text-gray-900'
              }`}
            >
              {featureData.consultation.last7dConsultCount}건
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">최근 30일:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.consultation.last30dConsultCount}건
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">월 평균:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.consultation.avgMonthlyConsultCount.toFixed(1)}건
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">마지막 상담:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.consultation.lastConsultDaysAgo}일 전
            </span>
            <span className="ml-1 text-xs text-gray-500">
              ({featureData.consultation.lastConsultDate})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">주요 카테고리:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {getCategoryLabel(featureData.consultation.topConsultCategory)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">야간 상담:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.consultation.nightConsultCount}건 🌙
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">주말 상담:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {featureData.consultation.weekendConsultCount}건
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">불만 상담:</span>
            <span
              className={`ml-2 text-sm font-semibold ${
                featureData.consultation.totalComplaintCount > 0
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            >
              {featureData.consultation.totalComplaintCount}건
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultSection;
