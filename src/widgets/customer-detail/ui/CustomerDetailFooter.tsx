interface Props {
  onClose: () => void;
}

const CustomerDetailFooter = ({ onClose }: Props) => {
  return (
    <div className="border-t border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            메모 작성
          </button>
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default CustomerDetailFooter;
