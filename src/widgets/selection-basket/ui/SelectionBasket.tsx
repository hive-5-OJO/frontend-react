import { useState } from 'react';
import { useSelectionBasket } from '@/entities/customer/model/selectionBasketStore';
import { Button, Badge } from '@/shared/ui';
import { UsersRound } from 'lucide-react';
import { X } from 'lucide-react';

export const SelectionBasket = () => {
  const { selectedCustomers, removeCustomer, clearBasket, getCount } = useSelectionBasket();
  const [isOpen, setIsOpen] = useState(false);

  const count = getCount();

  if (count === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 바구니 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg transition hover:bg-primary-700 hover:shadow-xl"
      >
        <UsersRound />
        <Badge
          variant="destructive"
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full p-0 text-xs font-bold"
        >
          {count}
        </Badge>
      </button>

      {/* 바구니 패널 */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 rounded-lg border border-gray-200 bg-white shadow-2xl">
          {/* 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">선택 고객들</h3>
              <Badge variant="secondary">{count}명</Badge>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 transition hover:text-gray-600"
            >
              <X />
            </button>
          </div>

          {/* 고객 목록 */}
          <div className="max-h-96 overflow-y-auto">
            {selectedCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between border-b border-gray-100 p-3 transition hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-500">
                    {customer.email || customer.phone || `ID: ${customer.id}`}
                  </p>
                </div>
                <button
                  onClick={() => removeCustomer(customer.id)}
                  className="ml-2 text-gray-400 transition hover:text-error-600"
                >
                  <X />
                </button>
              </div>
            ))}
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-2 border-t border-gray-200 p-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={clearBasket}
            >
              전체 삭제
            </Button>
            <Button
              variant="default"
              size="sm"
              className="w-full"
              onClick={() => {
                // TODO: 타겟 액션 실행 모달 열기
                alert(`${count}명의 고객에게 메일을 전송합니다.`);
              }}
            >
              단체 메일 작성
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
