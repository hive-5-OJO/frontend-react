import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  Label,
  Badge,
} from '@/shared/ui';
import { customerApi } from '@/entities/customer/api/customerApi';
import { queryKeys } from '@/shared/constants';
import type { Customer } from '@/entities/customer/model/types';

interface BulkEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
}

export const BulkEmailModal = ({ isOpen, onClose, customers = [] }: BulkEmailModalProps) => {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  // 고객이 없으면 빈 배열 사용
  const safeCustomers = customers || [];

  // useQueries로 여러 고객의 상세 정보를 한 번에 조회
  const customerQueries = useQueries({
    queries: safeCustomers.map((customer) => ({
      queryKey: queryKeys.customer.detail(customer.id),
      queryFn: () => customerApi.getById(customer.id),
      enabled: isOpen && safeCustomers.length > 0,
    })),
  });

  // 모든 쿼리가 로딩 중인지 확인
  const isLoading = customerQueries.some((query) => query.isLoading);

  // 상세 정보가 로드된 고객들
  const detailedCustomers = customerQueries
    .map((query) => query.data)
    .filter((data): data is Customer => data !== undefined);

  // 동의 여부 확인 (개인정보, 마케팅 모두 Y인 고객만)
  const eligibleCustomers = detailedCustomers.filter((customer) => {
    const consent = customer.consent;
    if (!consent) return false;
    
    return (
      consent.personalAccepted === 'Y' &&
      consent.marketingAccepted === 'Y' &&
      consent.isConverted === 'Y'
    );
  });

  const ineligibleCount = safeCustomers.length - eligibleCustomers.length;
  const eligibleEmails = eligibleCustomers.map((c) => c.email).filter(Boolean);

  const handleSend = () => {
    // TODO: 실제 메일 전송 API 호출
    // console.log('Sending email to:', eligibleEmails);
    // console.log('Subject:', subject);
    // console.log('Content:', content);
    
    alert(`${eligibleEmails.length}명에게 메일을 전송합니다.`);
    handleClose();
  };

  const handleClose = () => {
    setSubject('');
    setContent('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>단체 메일 작성</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600"></div>
              <p className="text-gray-600">고객 정보를 확인하는 중...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6">
          {/* 수신자 정보 */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">수신자 정보</h3>
              <div className="flex items-center gap-2">
                <Badge variant="default">{eligibleEmails.length.toLocaleString()}명 발송 가능</Badge>
                {ineligibleCount > 0 && (
                  <Badge variant="destructive">{ineligibleCount.toLocaleString()}명 제외</Badge>
                )}
              </div>
            </div>

            {ineligibleCount > 0 && (
              <div className="mb-3 rounded-md bg-yellow-50 border border-yellow-200 p-3">
                <div className="flex items-start gap-2">
                  <svg className="h-5 w-5 flex-shrink-0 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800">
                      {ineligibleCount.toLocaleString()}명의 고객이 제외되었습니다
                    </p>
                    <p className="mt-1 text-xs text-yellow-700">
                      개인정보 수집, 마케팅 수신, 프로모션 동의가 모두 필요합니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs text-gray-600">수신 이메일 ({eligibleEmails.length.toLocaleString()}개)</Label>
              <div className="max-h-32 overflow-y-auto rounded-md border border-gray-200 bg-white p-3">
                {eligibleEmails.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {eligibleEmails.map((email, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs text-primary-700"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-gray-500">발송 가능한 이메일이 없습니다</p>
                )}
              </div>
            </div>
          </div>

          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="subject">제목</Label>
            <Input
              id="subject"
              placeholder="메일 제목을 입력하세요"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <textarea
              id="content"
              className="min-h-[200px] w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="메일 내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleSend}
            disabled={eligibleEmails.length === 0 || !subject || !content}
          >
            {eligibleEmails.length.toLocaleString()}명에게 전송
          </Button>
        </DialogFooter>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
};
