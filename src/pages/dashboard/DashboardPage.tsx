import { DashboardLayout } from '@/widgets/dashboard-layout';
import { Card, Icon, MetricCard } from '@/shared/ui';
import increaseIcon from '@/assets/icons/increase-icon.svg';
import decreaseIcon from '@/assets/icons/decrease-icon.svg';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="my-3 ml-5 flex flex-col gap-2">
        <h2 className="text-2xl font-bold">관리자님, 안녕하세요!</h2>
        <h3 className="text-white/60">CRM 및 마케팅 데이터 인사이트를 확인하세요.</h3>
      </div>

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
          label="신규 고객"
          value="850"
          unit="명"
          trend={{ value: 5.2, isPositive: false, comparison: '지난주 대비' }}
          icon={<Icon src={decreaseIcon} alt="decrease" size="md" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 ml-3 text-xl font-bold">고객 인사이트</h2>
          <Card className="h-80 p-6">최근 7일 트렌드, 고객 분포 현황 등</Card>
        </div>
        <div>
          <h2 className="mb-2 ml-3 text-xl font-bold">상담 인사이트 요약</h2>
          <Card className="h-80 p-6">상담 통계 차트 등</Card>
        </div>
        <div>
          <h2 className="mb-2 ml-3 text-xl font-bold">상담 인사이트 요약</h2>
          <Card className="h-80 p-6">차트 영역</Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
