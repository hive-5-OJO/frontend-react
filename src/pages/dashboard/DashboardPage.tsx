import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Icon, MetricCard } from '@/shared/ui';
import increaseIcon from '@/assets/icons/increase-icon.svg';
import decreaseIcon from '@/assets/icons/decrease-icon.svg';
import decreaseBlueIcon from '@/assets/icons/decrease-blue-icon.svg';
import increaseRedIcon from '@/assets/icons/increase-red-icon.svg';
import CustomerTrendChart from '@/widgets/customer-trend-chart/ui/CustomerTrendChart';
import CustomerCompositionChart from '@/widgets/customer-composition-chart/ui/CustomerCompositionChart';
import ConsultCategoryCard from '@/widgets/consult-category-card/ui/ConsultCategoryCard';
import ConsultTimeCard from '@/widgets/consult-time-card/ui/ConsultTimeCard';
import OutboundCard from '@/widgets/outbound-card/ui/OutboundCard';
import SatisfactionCard from '@/widgets/satisfaction-card/ui/SatisfactionCard';
import { useDashboardSummary } from '@/entities/dashboard';

const DashboardPage = () => {
  const { data: summary, isLoading } = useDashboardSummary();

  const cards = summary?.cards;
  const dailyStats = summary?.dailyStats || [];
  const segments = summary?.segments;

  const formatCount = (count?: number) =>
    count !== undefined ? count.toLocaleString() : '-';

  const getTrendIcon = (percent?: number) => {
    if (percent === undefined) return null;
    return percent >= 0
      ? <Icon src={increaseIcon} alt="increase" size="md" />
      : <Icon src={decreaseIcon} alt="decrease" size="md" />;
  };

  // 위험 고객 전용 아이콘 (감소=긍정=파랑, 증가=부정=빨강)
  const getAtRiskTrendIcon = (percent?: number) => {
    if (percent === undefined) return null;
    return percent <= 0
      ? <Icon src={decreaseBlueIcon} alt="decrease" size="md" />
      : <Icon src={increaseRedIcon} alt="increase" size="md" />;
  };

  return (
    <DashboardLayout>
      <div className="my-3 ml-5 flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-white/90">관리자님, 안녕하세요!</h2>
        <h3 className="text-white/60">CRM 및 마케팅 데이터 인사이트를 확인하세요.</h3>
      </div>

      {/* 상단 메트릭 카드 */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="현재 고객"
          value={isLoading ? '...' : formatCount(cards?.currentCustomers.count)}
          unit="명"
          trend={cards ? {
            value: cards.currentCustomers.percentChange,
            isPositive: cards.currentCustomers.percentChange >= 0,
            comparison: '지난달 대비',
          } : undefined}
          icon={getTrendIcon(cards?.currentCustomers.percentChange)}
        />
        <MetricCard
          label="이 달 새 활성 고객"
          value={isLoading ? '...' : formatCount(cards?.newActiveCustomers.count)}
          unit="명"
          trend={cards ? {
            value: cards.newActiveCustomers.percentChange,
            isPositive: cards.newActiveCustomers.percentChange >= 0,
            comparison: '지난달 대비',
          } : undefined}
          icon={getTrendIcon(cards?.newActiveCustomers.percentChange)}
        />
        <MetricCard
          label="신규 고객"
          value={isLoading ? '...' : formatCount(cards?.newCustomers.count)}
          unit="명"
          trend={cards ? {
            value: cards.newCustomers.percentChange,
            isPositive: cards.newCustomers.percentChange >= 0,
            comparison: '지난달 대비',
          } : undefined}
          icon={getTrendIcon(cards?.newCustomers.percentChange)}
        />
        <MetricCard
          label="이 달 위험 고객"
          value={isLoading ? '...' : formatCount(cards?.atRiskCustomers.count)}
          unit="명"
          trend={cards ? {
            value: cards.atRiskCustomers.percentChange,
            isPositive: cards.atRiskCustomers.percentChange <= 0,
            comparison: '지난달 대비',
          } : undefined}
          icon={getAtRiskTrendIcon(cards?.atRiskCustomers.percentChange)}
        />
      </div>

      {/* 고객 인사이트 */}
      <h2 className="mb-3 ml-3 text-xl font-bold text-gray-900">고객 인사이트</h2>
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CustomerTrendChart dailyStats={dailyStats} />
        <CustomerCompositionChart segments={segments} />
      </div>

      {/* 상담 인사이트 요약 */}
      <h2 className="mb-3 ml-3 text-xl font-bold text-gray-900">상담 인사이트 요약</h2>
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ConsultCategoryCard />
        <ConsultTimeCard />
        <OutboundCard />
        <SatisfactionCard />
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
