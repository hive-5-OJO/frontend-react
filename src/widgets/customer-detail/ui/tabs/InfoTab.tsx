import type { Customer } from '@/entities/customer/model/types';
import { Badge, Card, CardContent } from '@/shared/ui';
import { CUSTOMER_TYPE_LABELS, type CustomerType } from '@/entities/customer/model/types';
import { useCustomerMemo } from '@/entities/customer/model/useCustomerQueries';
import { useAuthStore } from '@/entities/user/model/store';
import { maskPhone, maskEmail } from '@/shared/utils';

interface Props {
  customer: Customer;
  onMemoClick?: () => void;
}

const InfoRow = ({ label, value, valueClassName }: { label: string; value: React.ReactNode; valueClassName?: string }) => (
  <div className="flex items-center gap-2">
    <span className="h-2 w-2 rounded-full bg-primary-600"></span>
    <div className="flex-1">
      <span className="text-base text-gray-600">{label}:</span>
      <span className={`ml-2 text-base font-semibold ${valueClassName || 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  </div>
);

const getGenderLabel = (gender?: string) => {
  if (gender === 'M') return '남성';
  if (gender === 'F') return '여성';
  return '-';
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'ACTIVE': return '활성';
    case 'DORMANT': return '휴면';
    case 'TERMINATED': return '해지';
    default: return status || '-';
  }
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'ACTIVE': return 'text-success-600';
    case 'DORMANT': return 'text-orange-600';
    case 'TERMINATED': return 'text-gray-500';
    default: return 'text-gray-900';
  }
};

const getProductTypeLabel = (type: string) => {
  switch (type) {
    case 'MONTHLY': return '월간';
    case 'YEARLY': return '연간';
    case 'DAILY': return '일간';
    default: return type;
  }
};

const getSubscriptionStatusColor = (status: string) => {
  switch (status) {
    case 'ACTIVE': return 'success';
    case 'CANCELLED': return 'error';
    case 'PAUSED': return 'warning';
    default: return 'secondary';
  }
};

const getSubscriptionStatusLabel = (status: string) => {
  switch (status) {
    case 'ACTIVE': return '이용중';
    case 'CANCELLED': return '해지';
    case 'PAUSED': return '일시정지';
    default: return status;
  }
};

const InfoTab = ({ customer, onMemoClick }: Props) => {
  const { data: memo } = useCustomerMemo(customer.id);
  // const { data: recommendation, isLoading: isLoadingRecommend } = useCustomerRecommendation(customer.id);
  const user = useAuthStore((state) => state.user);
  const isMarketing = user?.role === 'MARKETING';

  const displayPhone = isMarketing ? maskPhone(customer.phone) : customer.phone;
  const displayEmail = isMarketing ? maskEmail(customer.email) : customer.email;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* AI 맞춤 서비스 추천 -> 임시 주석처리*/}
      {/* {isLoadingRecommend ? (
        <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6 shadow-md">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-indigo-900">
            <span>🎯</span>
            <span>AI 맞춤 서비스 추천</span>
          </h3>
          <p className="text-sm text-indigo-700">추천 정보를 불러오는 중...</p>
        </div>
      ) : recommendation && recommendation.length > 0 ? (
        <div className="rounded-lg border-2 border-indigo-200 bg-indigo-50 p-6 shadow-md">
          <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-indigo-900">
            <span>🎯</span>
            <span>AI 맞춤 서비스 추천</span>
          </h3>
          <div className="space-y-3">
            {recommendation.map((item) => (
              <div key={item.rank} className="rounded-lg border border-indigo-200 bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      {item.rank}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{item.recommendedProduct}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      적합도 {item.score}점
                    </span>
                    <span className="text-sm font-bold text-indigo-700">
                      {item.price.toLocaleString()}원
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null} */}

      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
      {/* 인적 정보 */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">인적 정보</h3>
          <div className="space-y-3">
            <InfoRow label="이름" value={customer.name} />
            <InfoRow label="성별" value={getGenderLabel(customer.gender)} />
            <InfoRow label="생년월일" value={customer.birthDate || '-'} />
            <InfoRow label="지역" value={customer.region || '-'} />
            <InfoRow
              label="상태"
              value={getStatusLabel(customer.status)}
              valueClassName={getStatusColor(customer.status)}
            />
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary-600"></span>
              <div className="flex-1">
                <span className="text-base text-gray-600">고객 분류:</span>
                <span className="ml-2">
                  {customer.customerType ? (
                    <Badge variant={customer.customerType as 'vip' | 'potential_vip' | 'normal' | 'churn_risk' | 'churned'}>
                      {CUSTOMER_TYPE_LABELS[customer.customerType as CustomerType]}
                    </Badge>
                  ) : (
                    <span className="text-base font-semibold text-gray-900">-</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 연락처 정보 + 동의 정보 */}
      <div className="space-y-4 md:space-y-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">연락처 정보</h3>
            <div className="space-y-3">
              <InfoRow label="전화번호" value={displayPhone} />
              <InfoRow label="이메일" value={displayEmail} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">동의 정보</h3>
            {customer.consent ? (
              <div className="space-y-3">
                <InfoRow
                  label="개인정보 수집"
                  value={customer.consent.personalAccepted === 'Y' ? '동의' : '미동의'}
                  valueClassName={customer.consent.personalAccepted === 'Y' ? 'text-success-600' : 'text-gray-500'}
                />
                <InfoRow
                  label="마케팅 수신"
                  value={customer.consent.marketingAccepted === 'Y' ? '동의' : '미동의'}
                  valueClassName={customer.consent.marketingAccepted === 'Y' ? 'text-success-600' : 'text-gray-500'}
                />
                <InfoRow
                  label="프로모션 동의 여부"
                  value={customer.consent.isConverted === 'Y' ? '동의' : '미동의'}
                  valueClassName={customer.consent.isConverted === 'Y' ? 'text-success-600' : 'text-gray-500'}
                />
                <InfoRow
                  label="동의 일시"
                  value={customer.consent.acceptedAt?.replace('T', ' ') || '-'}
                />
                {customer.consent.expiresAt && (
                  <InfoRow label="만료 일시" value={customer.consent.expiresAt.replace('T', ' ')} />
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">동의 정보가 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 이용중인 서비스 */}
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">이용중인 서비스</h3>
          {customer.subscriptions && customer.subscriptions.length > 0 ? (
            <div className="space-y-3">
              {customer.subscriptions.map((sub) => (
                <div
                  key={sub.subscribeId}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {sub.product.productName}
                      </span>
                      <Badge variant={getSubscriptionStatusColor(sub.status) as 'success' | 'warning' | 'error'}>
                        {getSubscriptionStatusLabel(sub.status)}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {getProductTypeLabel(sub.product.productType)} · 시작일 {sub.startedAt.split('T')[0]}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {sub.totalPrice.toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">이용중인 서비스가 없습니다.</p>
          )}
        </CardContent>
      </Card>

      {/* 관리자 메모 */}
      {memo && (
        <Card
          className="cursor-pointer lg:col-span-2 transition hover:border-indigo-200 hover:shadow-md"
          onClick={onMemoClick}
        >
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">관리자 메모</h3>
              <span className="text-xs text-gray-400">클릭하여 수정</span>
            </div>
            <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
              <p className="whitespace-pre-wrap text-sm text-gray-800">{memo.content}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
    </div>
  );
};

export default InfoTab;
