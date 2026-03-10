import { Card, CardContent } from '@/shared/ui';
import { useOutboundStats } from '@/entities/dashboard';

const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500'];

const OutboundCard = () => {
  const { data, isLoading, error } = useOutboundStats();

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center p-5">
          <div className="text-center">
            <div className="mb-2 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-sm text-gray-500">데이터를 불러오는 중...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data || !data.promotionStats) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center p-5">
          <p className="text-sm text-gray-500">데이터를 불러올 수 없습니다</p>
        </CardContent>
      </Card>
    );
  }

  // 총 시도 횟수 대비 각 프로모션의 비율 계산
  const maxAttempt = Math.max(...data.promotionStats.map(p => p.attempt));

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-5">
        <h4 className="mb-1 text-base font-bold text-gray-900">아웃바운드 통계</h4>
        <p className="mb-4 text-xs text-gray-400">
          총 {data.totalAttempt.toLocaleString()}건
        </p>

        <div className="flex-1 space-y-3">
          {data.promotionStats.map((promo, i) => {
            const percentage = ((promo.attempt / data.totalAttempt) * 100).toFixed(1);
            return (
              <div key={promo.promotionName} className="flex items-center gap-3">
                <span className="w-32 truncate text-sm text-gray-700">
                  {promo.promotionName}
                </span>
                <div className="group relative flex-1">
                  <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${colors[i % colors.length]}`}
                      style={{ width: `${(promo.attempt / maxAttempt) * 100}%` }}
                    />
                  </div>
                  {/* 툴팁 */}
                  <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {promo.promotionName}: {promo.attempt.toLocaleString()}건 ({percentage}%)
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900" />
                  </div>
                </div>
                <span className="w-16 text-right text-sm font-semibold text-gray-900">
                  {promo.attempt.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OutboundCard;
