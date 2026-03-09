import type { Customer, CustomerFeature, TabType, ConsultTimelineItem } from '@/entities/customer/model/types';
import { Card, CardContent } from '@/shared/ui';
import { getCategoryColor } from '@/shared/constants/consultCategories';
import LifecycleSection from '../sections/LifecycleSection';
import PaymentSection from '../sections/PaymentSection';
import UsageSection from '../sections/UsageSection';
import ConsultSection from '../sections/ConsultSection';

interface Props {
  customer: Customer;
  featureData: CustomerFeature;
  timeline: ConsultTimelineItem[];
  onTabChange: (tab: TabType) => void;
}

const getDirectionStyle = (direction: string) => {
  if (direction === 'IN') return { bg: 'bg-info-100', text: 'text-info-700', label: '인바운드' };
  return { bg: 'bg-success-100', text: 'text-success-700', label: '아웃바운드' };
};

const FeatureTab = ({ featureData, timeline, onTabChange }: Props) => {
  const recentTimeline = timeline.slice(0, 5);

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
      <div className="space-y-4 md:space-y-6">
        <LifecycleSection featureData={featureData} />
        <PaymentSection featureData={featureData} />
        <UsageSection featureData={featureData} />
      </div>
      <div className="space-y-4 md:space-y-6">
        <ConsultSection featureData={featureData} />

        {/* 최근 상담 이력 */}
        <Card variant="clickable" onClick={() => onTabChange('consult')}>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">최근 상담 이력</h3>
            {recentTimeline.length > 0 ? (
              <div className="space-y-3">
                {recentTimeline.map((item, idx) => {
                  const style = getDirectionStyle(item.direction);
                  const catColor = getCategoryColor(item.category);
                  return (
                    <div key={idx} className={`flex gap-3 border-l-2 ${catColor.border} pl-4`}>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className={`rounded ${catColor.bg} px-2 py-0.5 text-xs font-medium ${catColor.text}`}>
                            {item.category}
                          </span>
                          <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
                            {style.label}
                          </span>
                          <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                        <p className="text-sm text-gray-700">{item.content}</p>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => onTabChange('consult')}
                  className="mt-2 w-full rounded-lg border border-primary-200 bg-primary-50/50 py-2 text-center text-sm font-medium text-primary-600 transition hover:bg-primary-100"
                >
                  클릭하여 전체 보기 →
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">상담 이력이 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeatureTab;
