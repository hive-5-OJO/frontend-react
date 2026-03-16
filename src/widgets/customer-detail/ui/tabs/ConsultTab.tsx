import type { ConsultTimelineItem } from '@/entities/customer/model/types';
import { Badge, Card, CardContent } from '@/shared/ui';

interface Props {
  timeline: ConsultTimelineItem[];
}

const getDirectionStyle = (direction: string) => {
  if (direction === 'IN') return { bg: 'bg-info-100', text: 'text-info-700', label: '인바운드' };
  return { bg: 'bg-success-100', text: 'text-success-700', label: '아웃바운드' };
};

const getSatisfactionStyle = (score?: number) => {
  if (!score) return { border: 'border-gray-200', bg: 'bg-gray-50', label: '미평가', variant: 'secondary' as const };
  if (score >= 4) return { border: 'border-emerald-300', bg: 'bg-emerald-50', label: `만족 (${score}/5)`, variant: 'success' as const };
  if (score >= 3) return { border: 'border-amber-300', bg: 'bg-amber-50', label: `보통 (${score}/5)`, variant: 'warning' as const };
  return { border: 'border-rose-300', bg: 'bg-rose-50', label: `불만족 (${score}/5)`, variant: 'error' as const };
};

const ConsultTab = ({ timeline }: Props) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">상담 이력</h3>
        <span className="text-sm text-gray-500">총 {timeline.length}건</span>
      </div>

      {/* 만족도 범례 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
          <span className="text-xs text-gray-600">만족 (4~5)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-amber-400"></span>
          <span className="text-xs text-gray-600">보통 (3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-400"></span>
          <span className="text-xs text-gray-600">불만족 (1~2)</span>
        </div>
      </div>

      {timeline.length > 0 ? (
        <div className="space-y-3">
          {timeline.map((item, idx) => {
            const direction = getDirectionStyle(item.direction);
            const satisfaction = getSatisfactionStyle(item.satisfactionScore);

            return (
              <Card key={idx} className={`border-l-4 ${satisfaction.border} ${satisfaction.bg}`}>
                <CardContent className="p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <Badge variant={satisfaction.variant}>{satisfaction.label}</Badge>
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {item.category}
                    </span>
                    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${direction.bg} ${direction.text}`}>
                      {direction.label}
                    </span>
                    <span className="ml-auto text-xs text-gray-500">{item.date}</span>
                  </div>
                  <p className="text-sm text-gray-800">{item.content}</p>
                  {item.promotionName && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-xs text-gray-500">연관 프로모션:</span>
                      <span className="text-xs font-medium text-primary-600">{item.promotionName}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-sm text-gray-500">상담 이력이 없습니다.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConsultTab;
