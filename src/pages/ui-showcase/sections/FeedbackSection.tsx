import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/alert';
import { Toast } from '@/shared/ui/toast';
import { useToast } from '@/shared/hooks';
import { Button } from '@/shared/ui/button';
import ShowcaseBlock from './ShowcaseBlock';

const SuccessIcon = () => (
  <svg className="h-5 w-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="h-5 w-5 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="h-5 w-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const InfoIcon = () => (
  <svg className="h-5 w-5 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FeedbackSection = () => {
  const { toast } = useToast();

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-gray-900">Alert & Toast</h2>

      <ShowcaseBlock
        title="Alert Variants"
        description="default / success / warning / error / info"
        code={`<Alert variant="success">\n  <AlertTitle>성공</AlertTitle>\n  <AlertDescription>저장되었습니다.</AlertDescription>\n</Alert>`}
        vertical
      >
        <div className="w-full space-y-3">
          <Alert variant="default">
            <AlertTitle>기본 알림</AlertTitle>
            <AlertDescription>일반적인 안내 메시지입니다.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>저장 완료</AlertTitle>
            <AlertDescription>고객 정보가 성공적으로 저장되었습니다.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>주의 필요</AlertTitle>
            <AlertDescription>이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?</AlertDescription>
          </Alert>
          <Alert variant="error">
            <AlertTitle>오류 발생</AlertTitle>
            <AlertDescription>서버와의 연결이 끊어졌습니다. 잠시 후 다시 시도해주세요.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <AlertTitle>안내</AlertTitle>
            <AlertDescription>새로운 업데이트가 있습니다. 페이지를 새로고침해주세요.</AlertDescription>
          </Alert>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Alert — 아이콘 포함"
        description="SVG 아이콘을 Alert 내부에 직접 배치"
        code={`<Alert variant="success">\n  <SuccessIcon />\n  <div>\n    <AlertTitle>성공</AlertTitle>\n    <AlertDescription>완료되었습니다.</AlertDescription>\n  </div>\n</Alert>`}
        vertical
      >
        <div className="w-full space-y-3">
          <Alert variant="success">
            <SuccessIcon />
            <div>
              <AlertTitle>저장 완료</AlertTitle>
              <AlertDescription>변경사항이 저장되었습니다.</AlertDescription>
            </div>
          </Alert>
          <Alert variant="error">
            <ErrorIcon />
            <div>
              <AlertTitle>로그인 실패</AlertTitle>
              <AlertDescription>이메일 또는 비밀번호가 올바르지 않습니다.</AlertDescription>
            </div>
          </Alert>
          <Alert variant="warning">
            <WarningIcon />
            <div>
              <AlertTitle>세션 만료 예정</AlertTitle>
              <AlertDescription>5분 후 자동 로그아웃됩니다.</AlertDescription>
            </div>
          </Alert>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Toast 컴포넌트 (정적)"
        description="Toast UI 컴포넌트 직접 렌더링"
        code={`<Toast variant="success" title="저장 완료" description="데이터가 저장되었습니다." icon={<SuccessIcon />} />`}
        vertical
      >
        <div className="w-full space-y-3">
          <Toast variant="success" title="저장 완료" description="고객 정보가 저장되었습니다." icon={<SuccessIcon />} onClose={() => {}} />
          <Toast variant="error" title="오류 발생" description="요청을 처리할 수 없습니다." icon={<ErrorIcon />} onClose={() => {}} />
          <Toast variant="warning" title="주의" description="입력값을 확인해주세요." icon={<WarningIcon />} onClose={() => {}} />
          <Toast variant="info" title="안내" description="새 메시지가 도착했습니다." icon={<InfoIcon />} onClose={() => {}} />
          <Toast variant="default" title="알림" description="작업이 완료되었습니다." onClose={() => {}} />
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Toast 시스템 (실제 동작)"
        description="버튼 클릭 시 화면 우측 하단에 실제 토스트 표시 (3초 후 자동 사라짐)"
        code={`const { toast } = useToast();\ntoast.success('저장 완료', '데이터가 저장되었습니다.');`}
      >
        <Button variant="primary" size="sm" onClick={() => toast.success('저장 완료', '고객 정보가 저장되었습니다.')}>
          Success Toast
        </Button>
        <Button variant="danger" size="sm" onClick={() => toast.error('오류 발생', '서버 연결에 실패했습니다.')}>
          Error Toast
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.warning('주의', '이 작업은 되돌릴 수 없습니다.')}>
          Warning Toast
        </Button>
        <Button variant="secondary" size="sm" onClick={() => toast.info('안내', '새로운 업데이트가 있습니다.')}>
          Info Toast
        </Button>
        <Button variant="ghost" size="sm" onClick={() => toast.default('알림', '작업이 완료되었습니다.')}>
          Default Toast
        </Button>
      </ShowcaseBlock>
    </div>
  );
};

export default FeedbackSection;
