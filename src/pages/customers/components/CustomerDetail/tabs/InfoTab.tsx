import type { Customer, CustomerFeature } from '../types';
import ServiceSection from '../sections/ServiceSection';
import LifecycleSection from '../sections/LifecycleSection';
import PaymentSection from '../sections/PaymentSection';
import UsageSection from '../sections/UsageSection';
import ConsultSection from '../sections/ConsultSection';
import ConsultTimelineSection from '../sections/ConsultTimelineSection';
import ContactSection from '../sections/ContactSection';
import AIInsightSection from '../sections/AIInsightSection';

interface Props {
  customer: Customer;
  featureData: CustomerFeature;
}

const InfoTab = ({ customer, featureData }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
      {/* 왼쪽 컬럼 */}
      <div className="space-y-4 md:space-y-6">
        <ServiceSection customer={customer} featureData={featureData} />
        <LifecycleSection featureData={featureData} />
        <PaymentSection featureData={featureData} />
        <UsageSection featureData={featureData} />
      </div>

      {/* 오른쪽 컬럼 */}
      <div className="space-y-4 md:space-y-6">
        <ConsultSection featureData={featureData} />
        <ConsultTimelineSection />
        <ContactSection customer={customer} />
        <AIInsightSection featureData={featureData} />
      </div>
    </div>
  );
};

export default InfoTab;
