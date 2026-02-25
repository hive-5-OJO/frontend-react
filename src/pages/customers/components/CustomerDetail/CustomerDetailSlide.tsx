import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadarController,
  ArcElement,
} from 'chart.js';
import type { CustomerDetailSlideProps, TabType, CustomerFeature, RFMScore, LTVData } from './types';
import CustomerDetailHeader from './CustomerDetailHeader';
import CustomerDetailTabs from './CustomerDetailTabs';
import CustomerDetailFooter from './CustomerDetailFooter';
import InfoTab from './tabs/InfoTab';
import RFMTab from './tabs/RFMTab';
import LTVTab from './tabs/LTVTab';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadarController,
  ArcElement,
);

const CustomerDetailSlide = ({
  customer,
  isOpen,
  onClose,
}: CustomerDetailSlideProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('info');

  // Mock data
  const mockRFMData: RFMScore = {
    recency: '2026-01-15T14:30:00',
    frequency: 3,
    monetary: 50000,
    score: 3,
    updatedAt: '2026-01-31T04:00:00',
  };

  const mockLTVData: LTVData = {
    memberId: customer?.id || 1,
    ltvAmount: 1850000,
    ltvGrade: 'TOP_10',
    expectedChurnDate: '2026-08-15',
    avgOrderValue: 95000.3,
  };

  const mockFeatureData: CustomerFeature = {
    memberId: customer?.id || 10001,
    featureBaseDate: '2026-02-10',
    consultation: {
      totalConsultCount: 120,
      last7dConsultCount: 3,
      last30dConsultCount: 10,
      avgMonthlyConsultCount: 4.2,
      lastConsultDate: '2026-02-08',
      nightConsultCount: 5,
      weekendConsultCount: 7,
      topConsultCategory: 'PAYMENT',
      totalComplaintCount: 2,
      lastConsultDaysAgo: 2,
    },
    monetary: {
      totalRevenue: 3500000,
      lastPaymentAmount: 120000,
      avgMonthlyBill: 98000.5,
      lastPaymentDate: '2026-02-05',
      paymentCount6m: 6,
      monthlyRevenue: 110000,
      paymentDelayCount: 0,
      prevMonthlyRevenue: 100000,
      isVipPrevMonth: 'true',
      avgOrderVal: 95000.3,
      purchaseCycle: 32,
    },
    lifecycle: {
      memberLifetimeDays: 540,
      daysSinceLastActivity: 3,
      contractEndDaysLeft: 180,
      isDormantFlag: false,
      isNewCustomerFlag: customer?.isNewCustomer || false,
      isTerminatedFlag: false,
      signupDate: customer?.joinedAt || '2024-08-20',
    },
    usage: {
      totalUsageAmount: 98000,
      avgDailyUsage: 3200.5,
      maxUsageAmount: 7000,
      usagePeakHour: 21,
      premiumServiceCount: 2,
      lastActivityDate: '2026-02-09',
      usageActiveDays30d: 25,
    },
  };

  const rfmData = mockRFMData;
  const ltvData = mockLTVData;
  const featureData = mockFeatureData;

  // ESC 키로 닫기
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      return () => document.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  if (!customer) return null;

  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-500 ${
          isOpen ? 'opacity-30' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* 슬라이드 패널 */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full transform items-center transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '55%', padding: '24px 0' }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-l-2xl bg-gray-50 shadow-2xl">
          <CustomerDetailHeader
            customer={customer}
            featureData={featureData}
            onClose={onClose}
          />

          <CustomerDetailTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* 내용 */}
          <div className="scrollbar-hide flex-1 overflow-y-auto p-8">
            {activeTab === 'info' && (
              <InfoTab customer={customer} featureData={featureData} />
            )}
            {activeTab === 'rfm' && <RFMTab rfmData={rfmData} />}
            {activeTab === 'ltv' && <LTVTab ltvData={ltvData} />}
          </div>

          <CustomerDetailFooter onClose={onClose} />
        </div>
      </div>
    </>
  );
};

export default CustomerDetailSlide;
