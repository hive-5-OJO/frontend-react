import { Card, CardContent } from '@/shared/ui';
import { useConsultCategories } from '@/entities/dashboard';

const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-red-500', 'bg-amber-500', 'bg-purple-500'];

const ConsultCategoryCard = () => {
  const { data, isLoading, error } = useConsultCategories();

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

  if (error || !data || !data.items) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-full items-center justify-center p-5">
          <p className="text-sm text-gray-500">데이터를 불러올 수 없습니다</p>
        </CardContent>
      </Card>
    );
  }

  // 상위 5개만 표시
  const topCategories = data.items.slice(0, 5);

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-5">
        <h4 className="mb-1 text-base font-bold text-gray-900">상담 카테고리 통계</h4>
        <p className="mb-4 text-xs text-gray-400">
          총 {data.totalCount.toLocaleString()}건 · 상위 5개 카테고리
        </p>
        <div className="flex-1 space-y-3">
          {topCategories.map((cat, i) => (
            <div key={cat.categoryId} className="flex items-center gap-3">
              <span className="w-32 text-sm text-gray-700">{cat.categoryName}</span>
              <div className="group relative flex-1">
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${colors[i % colors.length]}`}
                    style={{ width: `${cat.ratio}%` }}
                  />
                </div>
                {/* 툴팁 */}
                <div className="pointer-events-none absolute -top-10 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                  {cat.categoryName}: {cat.count.toLocaleString()}건 ({cat.ratio}%)
                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900" />
                </div>
              </div>
              <span className="w-12 text-right text-sm font-semibold text-gray-900">
                {cat.ratio}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultCategoryCard;
