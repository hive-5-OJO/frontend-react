import { useEffect, useRef, useState } from 'react';
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
import type { TabType, CustomerFeature } from '@/entities/customer/model/types';
import type { Customer } from '@/entities/customer/model/types';
import { useCustomer, useCustomerFeatures, useCustomerTimeline, useCustomerRFM, useCustomerLTV } from '@/entities/customer/model/useCustomerQueries';
import CustomerDetailHeader from './CustomerDetailHeader';
import CustomerDetailTabs from './CustomerDetailTabs';
import CustomerDetailFooter from './CustomerDetailFooter';
import AIInsightSection from './sections/AIInsightSection';
import InfoTab from './tabs/InfoTab';
import FeatureTab from './tabs/FeatureTab';
import RFMTab from './tabs/RFMTab';
import LTVTab from './tabs/LTVTab';
import ConsultTab from './tabs/ConsultTab';

interface CustomerDetailSlideProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
}

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
  const contentRef = useRef<HTMLDivElement>(null);

  // API로 고객 상세 정보 조회
  const { data: customerDetail, isLoading: isLoadingDetail } = useCustomer(
    customer?.id || 0,
    !!customer?.id && isOpen
  );

  // API로 고객 특성 정보 조회
  const { data: featureData, isLoading: isLoadingFeatures } = useCustomerFeatures(
    customer?.id || 0,
    !!customer?.id && isOpen
  );

  // API로 고객 상담 타임라인 조회
  const { data: timeline, isLoading: isLoadingTimeline } = useCustomerTimeline(
    customer?.id || 0,
    !!customer?.id && isOpen
  );

  // API로 고객 RFM 점수 조회
  const { data: rfmData, isLoading: isLoadingRFM } = useCustomerRFM(
    customer?.id || 0,
    !!customer?.id && isOpen
  );

  // API로 고객 LTV 데이터 조회
  const { data: ltvData, isLoading: isLoadingLTV } = useCustomerLTV(
    customer?.id || 0,
    !!customer?.id && isOpen
  );

  // 고객이 변경되거나 슬라이드가 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setActiveTab('info');
      contentRef.current?.scrollTo(0, 0);
    }
  }, [customer, isOpen]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    contentRef.current?.scrollTo(0, 0);
  };

  // Mock data (API 연동 완료 후 주석 처리)
  // const mockRFMData: RFMScore = {
  //   recency: '2026-01-15T14:30:00',
  //   frequency: 3,
  //   monetary: 50000,
  //   score: 3,
  //   updatedAt: '2026-01-31T04:00:00',
  // };

  // const mockLTVData: LTVData = {
  //   memberId: customer?.id || 1,
  //   ltvAmount: 1850000,
  //   ltvGrade: 'TOP_10',
  //   expectedChurnDate: '2026-08-15',
  //   avgOrderValue: 95000.3,
  // };

  // const mockFeatureData: CustomerFeature = {
  //   memberId: customer?.id || 10001,
  //   featureBaseDate: '2026-02-10',
  //   consultation: {
  //     totalConsultCount: 120,
  //     last7dConsultCount: 3,
  //     last30dConsultCount: 10,
  //     avgMonthlyConsultCount: 4.2,
  //     lastConsultDate: '2026-02-08',
  //     nightConsultCount: 5,
  //     weekendConsultCount: 7,
  //     topConsultCategory: 'PAYMENT',
  //     totalComplaintCount: 2,
  //     lastConsultDaysAgo: 2,
  //   },
  //   monetary: {
  //     totalRevenue: 3500000,
  //     lastPaymentAmount: 120000,
  //     avgMonthlyBill: 98000.5,
  //     lastPaymentDate: '2026-02-05',
  //     paymentCount6m: 6,
  //     monthlyRevenue: 110000,
  //     paymentDelayCount: 0,
  //     prevMonthlyRevenue: 100000,
  //     isVipPrevMonth: 'true',
  //     avgOrderVal: 95000.3,
  //     purchaseCycle: 32,
  //   },
  //   lifecycle: {
  //     memberLifetimeDays: 540,
  //     daysSinceLastActivity: 3,
  //     contractEndDaysLeft: 180,
  //     isDormantFlag: false,
  //     isNewCustomerFlag: customer?.isNewCustomer || false,
  //     isTerminatedFlag: false,
  //     signupDate: customer?.joinedAt || '2024-08-20',
  //   },
  //   usage: {
  //     totalUsageAmount: 98000,
  //     avgDailyUsage: 3200.5,
  //     maxUsageAmount: 7000,
  //     usagePeakHour: 21,
  //     premiumServiceCount: 2,
  //     lastActivityDate: '2026-02-09',
  //     usageActiveDays30d: 25,
  //   },
  // };

  // const mockTimeline: ConsultTimelineItem[] = [
  //   {
  //     date: '2026-02-10',
  //     category: '요금/청구서 문의',
  //     direction: 'IN',
  //     content: '지난달보다 요금이 많이 나왔다는 불만 접수',
  //     promotionName: '신년 맞이 요금제 업그레이드',
  //     satisfactionScore: 3,
  //   },
  //   {
  //     date: '2026-02-08',
  //     category: '납부/연체/미납',
  //     direction: 'IN',
  //     content: '결제 오류로 인한 이중 청구 확인 요청',
  //     satisfactionScore: 2,
  //   },
  //   {
  //     date: '2026-02-05',
  //     category: '요금제 변경',
  //     direction: 'IN',
  //     content: '프리미엄 요금제에서 스탠다드로 변경 문의',
  //     satisfactionScore: 4,
  //   },
  //   {
  //     date: '2026-02-01',
  //     category: '할인/쿠폰/프로모션',
  //     direction: 'OUT',
  //     content: 'VIP 고객 대상 특별 할인 프로모션 안내',
  //     promotionName: 'VIP 전용 30% 할인',
  //     satisfactionScore: 3,
  //   },
  //   {
  //     date: '2026-01-28',
  //     category: '부가서비스',
  //     direction: 'IN',
  //     content: '부가서비스 해지 요청',
  //     satisfactionScore: 3,
  //   },
  // ];

  // API 데이터 사용 (목 데이터는 fallback으로만 사용)
  // const rfmData = mockRFMData;
  // const ltvData = mockLTVData;
  // const featureDataToUse = featureData || mockFeatureData;
  // const timelineToUse = timeline || mockTimeline;

  // Body 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      // 현재 스크롤 위치 저장
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // 원래 스크롤 위치로 복원
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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

  // 로딩 중일 때
  const isLoading = isLoadingDetail || isLoadingFeatures || isLoadingTimeline || isLoadingRFM || isLoadingLTV;

  // API에서 받은 상세 정보와 목록에서 받은 정보 병합
  const enrichedCustomer: Customer = customerDetail
    ? {
        ...customer,
        ...customerDetail,
        // 목록에서 받은 정보 유지
        service: customer.service,
        period: customer.period,
        consultFrequency: customer.consultFrequency,
        consultCategory: customer.consultCategory,
        customerType: customer.customerType,
      }
    : {
        ...customer,
        gender: customer.gender || (customer.id % 2 === 0 ? 'M' : 'F'),
        birthDate: customer.birthDate || '2002-03-01',
        region: customer.region || '서울',
        status: customer.status || 'ACTIVE',
        consent: customer.consent || {
          personalAccepted: 'Y',
          marketingAccepted: customer.id % 3 === 0 ? 'N' : 'Y',
          isConverted: customer.id % 2 === 0 ? 'Y' : 'N',
          acceptedAt: '2026-02-22T22:39:56',
          expiresAt: null,
        },
        subscriptions: customer.subscriptions || [
          {
            subscribeId: 1,
            product: { planId: 1, productName: '프리미엄 멤버십', productType: 'MONTHLY', price: 9900 },
            quantity: 1,
            totalPrice: 9900,
            startedAt: '2026-02-19T14:48:33',
            status: 'ACTIVE',
          },
        ],
      };

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
        className={`fixed top-0 right-0 z-50 flex h-full w-full transform items-center transition-transform duration-500 ease-out md:w-4/5 lg:w-3/4 xl:w-[55%] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ padding: '12px 0 12px 0' }}
      >
        <div className="flex h-full w-full flex-col overflow-hidden rounded-l-xl bg-gray-50 shadow-2xl md:rounded-l-2xl">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
                <p className="text-gray-600">고객 정보를 불러오는 중...</p>
              </div>
            </div>
          ) : (
            <>
              <CustomerDetailHeader
                customer={customer}
                featureData={featureData}
                onClose={onClose}
              />

              <CustomerDetailTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />

              {/* 내용 */}
              <div ref={contentRef} className="scrollbar-hide flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                {activeTab === 'info' && (
                  <InfoTab customer={enrichedCustomer} />
                )}
                {activeTab === 'feature' && featureData && (
                  <>
                    <div className="mb-4 md:mb-6">
                      <AIInsightSection featureData={featureData} />
                    </div>
                    <FeatureTab
                      customer={enrichedCustomer}
                      featureData={featureData}
                      timeline={timeline || []}
                      onTabChange={handleTabChange}
                    />
                  </>
                )}
                {activeTab === 'consult' && (
                  <ConsultTab timeline={timeline || []} />
                )}
                {activeTab === 'rfm' && rfmData && (
                  <RFMTab rfmData={rfmData} />
                )}
                {activeTab === 'rfm' && !rfmData && (
                  <div className="text-center py-20 text-gray-500">
                    RFM 분석 데이터를 불러오는 중입니다...
                  </div>
                )}
                {activeTab === 'ltv' && ltvData && (
                  <LTVTab ltvData={ltvData} />
                )}
                {activeTab === 'ltv' && !ltvData && (
                  <div className="text-center py-20 text-gray-500">
                    LTV 분석 데이터를 불러오는 중입니다...
                  </div>
                )}
              </div>

              <CustomerDetailFooter onClose={onClose} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CustomerDetailSlide;
