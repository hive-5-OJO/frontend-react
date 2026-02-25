import type { TabType } from './types';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const CustomerDetailTabs = ({ activeTab, onTabChange }: Props) => {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'info', label: '기본 정보' },
    { id: 'rfm', label: 'RFM 분석' },
    { id: 'ltv', label: 'LTV 분석' },
  ];

  return (
    <div className="border-b border-gray-200 bg-white px-8">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative pb-3 pt-2 text-sm font-semibold transition ${
              activeTab === tab.id
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomerDetailTabs;
