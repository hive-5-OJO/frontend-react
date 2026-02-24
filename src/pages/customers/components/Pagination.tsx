interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  // 최대 6개의 페이지 번호만 표시
  const getPageNumbers = () => {
    const maxVisible = 6;
    
    if (totalPages <= maxVisible) {
      // 전체 페이지가 6개 이하면 모두 표시
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 현재 페이지를 중심으로 6개 표시
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    // 끝이 총 페이지를 넘으면 조정
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center gap-3 rounded-md bg-white p-2 text-sm">
      {/* 처음 */}
      <button
        aria-label="first"
        onClick={() => onChange(1)}
        disabled={currentPage === 1}
        className="px-2 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-40"
      >
        {'<<'}
      </button>

      {/* 이전 */}
      <button
        aria-label="prev"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-40"
      >
        {'<'}
      </button>

      {/* 첫 페이지가 보이지 않으면 ... 표시 */}
      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onChange(1)}
            className="flex h-8 w-8 items-center justify-center rounded-md font-medium text-gray-600 transition hover:bg-gray-200"
          >
            1
          </button>
          {pages[0] > 2 && (
            <span className="px-1 text-gray-400">...</span>
          )}
        </>
      )}

      {/* 페이지 번호 */}
      {pages.map((page) => (
        <button
          key={page}
          aria-current={currentPage === page ? 'page' : undefined}
          onClick={() => onChange(page)}
          className={`flex h-8 w-8 items-center justify-center rounded-md font-medium transition ${
            currentPage === page
              ? 'bg-indigo-600 text-white'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지가 보이지 않으면 ... 표시 */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="px-1 text-gray-400">...</span>
          )}
          <button
            onClick={() => onChange(totalPages)}
            className="flex h-8 w-8 items-center justify-center rounded-md font-medium text-gray-600 transition hover:bg-gray-200"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* 다음 */}
      <button
        aria-label="next"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-40"
      >
        {'>'}
      </button>

      {/* 마지막 */}
      <button
        aria-label="last"
        onClick={() => onChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-gray-500 hover:text-gray-800 disabled:opacity-40"
      >
        {'>>'}
      </button>
    </div>
  );
};

export default Pagination;
