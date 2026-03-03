const ConsultTimelineSection = () => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">최근 상담 이력</h3>
      <div className="space-y-3">
        <div className="flex gap-3 border-l-2 border-error-300 pl-4">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-error-100 px-2 py-0.5 text-xs font-medium text-error-700">
                긴급 문의
              </span>
              <span className="text-xs text-gray-500">2026-02-08</span>
            </div>
            <p className="text-sm text-gray-700">결제 오류 문의</p>
          </div>
        </div>
        <div className="flex gap-3 border-l-2 border-info-300 pl-4">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-info-100 px-2 py-0.5 text-xs font-medium text-info-700">
                일반 문의
              </span>
              <span className="text-xs text-gray-500">2026-02-05</span>
            </div>
            <p className="text-sm text-gray-700">요금제 변경 문의</p>
          </div>
        </div>
        <div className="flex gap-3 border-l-2 border-warning-300 pl-4">
          <div className="flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded bg-warning-100 px-2 py-0.5 text-xs font-medium text-warning-700">
                기능 문의
              </span>
              <span className="text-xs text-gray-500">2026-02-01</span>
            </div>
            <p className="text-sm text-gray-700">부가서비스 추가</p>
          </div>
        </div>
        <button className="mt-2 w-full text-center text-sm text-primary-600 hover:text-primary-700">
          전체 내역 보기 →
        </button>
      </div>
    </div>
  );
};

export default ConsultTimelineSection;
