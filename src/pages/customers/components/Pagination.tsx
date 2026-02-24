interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onChange }: PaginationProps) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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

      {/* 페이지 번호 */}
      {pages.map((page) => (
        <button
          key={page}
          aria-current={currentPage === page ? 'page' : undefined}
          onClick={() => onChange(page)}
          className={`flex h-8 w-8 items-center justify-center rounded-md font-medium transition ${
            currentPage === page
              ? 'bg-main-blue text-white'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}

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
