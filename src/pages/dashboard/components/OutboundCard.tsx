import { Card, CardContent } from '@/shared/ui';
import { outboundData } from '../mockDashboardData';

const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-amber-500'];

const OutboundCard = () => {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-5">
        <h4 className="mb-1 text-base font-bold text-gray-900">아웃바운드 통계</h4>
        <p className="mb-4 text-xs text-gray-400">
          총 {outboundData.totalAttempt.toLocaleString()}건
        </p>
        <div className="mb-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {outboundData.successCount.toLocaleString()}건
            </span>
            <span className="text-sm text-gray-500">성공</span>
          </div>
          <span className="text-lg font-semibold text-primary-600">
            {outboundData.successRate}%
          </span>
        </div>

        <div className="flex-1 space-y-3">
          {outboundData.promotionStats.map((promo, i) => {
            const rate = ((promo.success / promo.attempt) * 100).toFixed(1);
            return (
              <div key={promo.promotionName} className="flex items-center gap-3">
                <span className="w-24 truncate text-sm text-gray-700">
                  {promo.promotionName}
                </span>
                <div className="group relative flex-1">
                  <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${colors[i % colors.length]}`}
                      style={{ width: `${(promo.success / promo.attempt) * 100}%` }}
                    />
                  </div>
                  {/* 툴팁 */}
                  <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    {promo.promotionName}: {promo.success.toLocaleString()}/{promo.attempt.toLocaleString()}건 ({rate}%)
                    <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900" />
                  </div>
                </div>
                <span className="w-12 text-right text-sm font-semibold text-gray-900">
                  {rate}%
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
