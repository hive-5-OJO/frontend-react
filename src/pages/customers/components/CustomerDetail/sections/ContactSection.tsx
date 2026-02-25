import type { Customer } from '../types';

interface Props {
  customer: Customer;
}

const ContactSection = ({ customer }: Props) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">연락처 정보</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">전화번호:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {customer.phone}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
          <div className="flex-1">
            <span className="text-sm text-gray-600">이메일:</span>
            <span className="ml-2 text-sm font-semibold text-gray-900">
              {customer.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
