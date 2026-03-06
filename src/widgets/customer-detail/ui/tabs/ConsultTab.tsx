import type { ConsultTimelineItem } from '@/entities/customer/model/types';
import { Badge } from '@/shared/ui';
import { getCategoryColor } from '@/shared/constants/consultCategories';

interface Props {
  timeline: ConsultTimelineItem[];
}

const getDirectionStyle = (direction: string) => {
  if (direction === 'IN') return { bg: 'bg-info-100', text: 'text-info-700', label: '인바운드' };
  return { bg: 'bg-success-100', text: 'text-success-700', label: '아웃바운드' };
};

const getSatisfactionLabel = (score?: number) => {
  if (!score) return null;
  if (score >= 4) return { label: `만족 (${score}/5)`, variant: 'success' as const };
  if (score >= 3) return { label: `보통 (${score}/5)`, variant: 'warning' as const };
  return { label: `불만족 (${score}/5)`, variant: 'error' as const };
};

const ConsultTab = ({ timeline }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">상담 이력</h3>
        <span className="text-sm text-gray-500">총 {timeline.length}건</span>
      </div>

      {timeline.length > 0 ? (
        <div className="space-y-3">
          {timeline.map((item, idx) => {
            const style = getDirectionStyle(item.direction);
            const satisfaction = getSatisfactionLabel(item.satisfactionScore);
            const catColor = getCategoryColor(item.category);

            return (
              <div
                key={idx}
                className={`rounded-lg border-l-4 ${catColor.border} bg-white p-4 shadow-sm`}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className={`rounded ${catColor.bg} px-2 py-0.5 text-xs font-medium ${catColor.text}`}>
                    {item.category}
                  </span>
                  <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                  {satisfaction && (
                    <Badge variant={satisfaction.variant}>{satisfaction.label}</Badge>
                  )}
                  <span className="ml-auto text-xs text-gray-500">{item.date}</span>
                </div>
                <p className="text-sm text-gray-800">{item.content}</p>
                {item.promotionName && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-xs text-gray-500">연관 프로모션:</span>
                    <span className="text-xs font-medium text-primary-600">{item.promotionName}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-gray-500">상담 이력이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ConsultTab;
