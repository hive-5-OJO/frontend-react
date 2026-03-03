import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog';
import { LoadingOverlay } from '@/shared/ui/loading-overlay';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import ShowcaseBlock from './ShowcaseBlock';

const OverlaySection = () => {
  const [modal, setModal] = useState<'sm' | 'md' | 'lg' | 'xl' | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2500);
  };

  const handleFullScreenDemo = () => {
    setLoadingFull(true);
    setTimeout(() => setLoadingFull(false), 2500);
  };

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-gray-900">Overlay & Modal</h2>

      <ShowcaseBlock
        title="Modal — 크기별"
        description="size: sm / md / lg / xl — 오버레이 클릭 또는 버튼으로 닫기"
        code={`<Dialog open={isOpen} onOpenChange={setIsOpen}>\n  <DialogContent className="sm:max-w-md">\n    <DialogHeader><DialogTitle>제목</DialogTitle></DialogHeader>\n    <div>내용</div>\n    <DialogFooter><Button onClick={() => setIsOpen(false)}>닫기</Button></DialogFooter>\n  </DialogContent>\n</Dialog>`}
      >
        {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
          <Button key={size} variant="outline" size="sm" onClick={() => setModal(size)}>
            {size.toUpperCase()} Modal
          </Button>
        ))}

        <Dialog open={modal !== null} onOpenChange={() => setModal(null)}>
          <DialogContent className={modal === 'sm' ? 'sm:max-w-sm' : modal === 'md' ? 'sm:max-w-md' : modal === 'lg' ? 'sm:max-w-lg' : 'sm:max-w-xl'}>
            <DialogHeader>
              <DialogTitle>Modal — {modal?.toUpperCase()}</DialogTitle>
            </DialogHeader>
            <div>
              <p className="text-sm text-gray-600">
                이것은 <strong>{modal}</strong> 크기의 모달입니다. 오버레이를 클릭하거나 닫기 버튼을 눌러 닫을 수 있습니다.
              </p>
              <p className="mt-3 text-sm text-gray-500">
                Dialog 컴포넌트는 open, onOpenChange, className prop을 지원합니다. ESC 키로도 닫을 수 있습니다.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModal(null)}>취소</Button>
              <Button onClick={() => setModal(null)}>확인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Modal — 확인 다이얼로그"
        description="삭제 확인 등 위험한 작업에 사용"
        code={`<Dialog open={confirmModal} onOpenChange={setConfirmModal}>\n  <DialogContent className="sm:max-w-sm">...</DialogContent>\n</Dialog>`}
      >
        <Button variant="danger" size="sm" onClick={() => setConfirmModal(true)}>
          고객 삭제
        </Button>

        <Dialog open={confirmModal} onOpenChange={setConfirmModal}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>고객 삭제</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-100">
                <svg className="h-6 w-6 text-error-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-900">김민수</strong> 고객을 삭제하시겠습니까?<br />
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmModal(false)}>취소</Button>
              <Button variant="danger" onClick={() => setConfirmModal(false)}>삭제</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="Modal — 폼 포함"
        description="입력 폼이 있는 모달"
        code={`<Dialog open={formModal} onOpenChange={setFormModal}>\n  <DialogContent className="sm:max-w-md">...</DialogContent>\n</Dialog>`}
      >
        <Button size="sm" onClick={() => setFormModal(true)}>고객 추가</Button>

        <Dialog open={formModal} onOpenChange={setFormModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>새 고객 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">이름 *</Label>
                  <Input id="name" placeholder="홍길동" />
                </div>
                <div>
                  <Label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">연락처</Label>
                  <Input id="phone" placeholder="010-0000-0000" />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">이메일 *</Label>
                <Input id="email" type="email" placeholder="example@email.com" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="vip" />
                <Label htmlFor="vip" className="text-sm font-normal cursor-pointer">VIP 고객으로 등록</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormModal(false)}>취소</Button>
              <Button onClick={() => setFormModal(false)}>추가하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="LoadingOverlay — 부분 영역"
        description="특정 영역을 덮는 로딩 오버레이 — 클릭하면 2.5초간 로딩"
        code={`<LoadingOverlay isLoading={loading} message="데이터 불러오는 중...">\n  <div>콘텐츠</div>\n</LoadingOverlay>`}
        vertical
      >
        <div className="w-full space-y-4">
          <Button variant="outline" size="sm" onClick={handleLoadingDemo}>
            로딩 시작 (2.5초)
          </Button>
          <LoadingOverlay isLoading={loading} message="데이터 불러오는 중...">
            <div className="rounded-lg border border-gray-200 p-6">
              <p className="font-semibold text-gray-900">고객 데이터 영역</p>
              <p className="mt-2 text-sm text-gray-500">이 영역이 로딩 중일 때 오버레이로 덮입니다.</p>
              <div className="mt-4 space-y-2">
                {['김민수', '이하늘', '박서준'].map((name) => (
                  <div key={name} className="flex items-center gap-2 rounded-md bg-gray-50 px-3 py-2 text-sm">
                    <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-600">{name[0]}</div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </LoadingOverlay>
        </div>
      </ShowcaseBlock>

      <ShowcaseBlock
        title="LoadingOverlay — 전체 화면"
        description="fullScreen prop — 화면 전체를 덮는 로딩"
        code={`<LoadingOverlay isLoading={loading} fullScreen message="처리 중..." />`}
      >
        <Button variant="primary" size="sm" onClick={handleFullScreenDemo}>
          전체화면 로딩 (2.5초)
        </Button>
        {loadingFull && (
          <LoadingOverlay isLoading={loadingFull} fullScreen message="데이터를 처리하는 중입니다..." />
        )}
      </ShowcaseBlock>
    </div>
  );
};

export default OverlaySection;
