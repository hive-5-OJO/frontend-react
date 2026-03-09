import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Icon, MetricCard } from '@/shared/ui';
import increaseIcon from '@/assets/icons/increase-icon.svg';
import decreaseIcon from '@/assets/icons/decrease-icon.svg';
import CustomerTrendChart from '@/widgets/customer-trend-chart/ui/CustomerTrendChart';
import CustomerCompositionChart from '@/widgets/customer-composition-chart/ui/CustomerCompositionChart';
import ConsultCategoryCard from '@/widgets/consult-category-card/ui/ConsultCategoryCard';
import ConsultTimeCard from '@/widgets/consult-time-card/ui/ConsultTimeCard';
import OutboundCard from '@/widgets/outbound-card/ui/OutboundCard';
import SatisfactionCard from '@/widgets/satisfaction-card/ui/SatisfactionCard';

const DashboardPage = () => {
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
          value="100,850"
          unit="명"
          trend={{ value: 5.2, isPositive: true, comparison: '지난주 대비' }}
          icon={<Icon src={increaseIcon} alt="increase" size="md" />}
        />
        <MetricCard
          label="이 달 새 활성 고객"
          value="1,850"
          unit="명"
          trend={{ value: 5.2, isPositive: true, comparison: '지난주 대비' }}
          icon={<Icon src={increaseIcon} alt="increase" size="md" />}
        />
        <MetricCard
          label="신규 고객"
          value="850"
          unit="명"
          trend={{ value: 5.2, isPositive: true, comparison: '지난주 대비' }}
          icon={<Icon src={increaseIcon} alt="increase" size="md" />}
        />
        <MetricCard
          label="이 달 위험 고객"
          value="1,240"
          unit="명"
          trend={{ value: 5.2, isPositive: false, comparison: '지난주 대비' }}
          icon={<Icon src={decreaseIcon} alt="decrease" size="md" />}
        />
      </div>

      {/* 고객 인사이트 */}
      <h2 className="mb-3 ml-3 text-xl font-bold text-gray-900">고객 인사이트</h2>
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CustomerTrendChart />
        <CustomerCompositionChart />
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
