interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
  code?: string;
  vertical?: boolean; // 세로 배치 옵션
}

const ShowcaseBlock = ({ title, description, children, code, vertical = false }: Props) => (
  <div className="mb-8 rounded-xl border border-gray-200 bg-white overflow-hidden">
    <div className="border-b border-gray-100 px-6 py-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
    </div>
    <div className={vertical ? "px-6 py-5" : "flex flex-wrap items-start gap-4 px-6 py-5"}>
      {children}
    </div>
    {code && (
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
        <pre className="overflow-x-auto text-xs text-gray-600">{code}</pre>
      </div>
    )}
  </div>
);

export default ShowcaseBlock;
