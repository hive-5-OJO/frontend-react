interface Props {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const CustomerSearch = ({ searchTerm, onSearchChange }: Props) => {
  return (
    <div className="relative">
      <svg
        className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="고객 이름 검색"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 shadow-sm transition placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CustomerSearch;
