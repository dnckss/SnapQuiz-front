import React from 'react';

type TabProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const Tab: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex mb-6">
      <div className="relative">
        <button
          className={`pb-2 px-4 ${
            activeTab === 'import'
              ? 'text-[#4A6FFF] font-medium'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('import')}
        >
          Import PDF
          {activeTab === 'import' && (
            <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#4369e0]" />
          )}
        </button>
      </div>
      
      <div className="relative">
        <button
          className={`pb-2 px-4 ${
            activeTab === 'text'
              ? 'text-[#4A6FFF] font-medium'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('text')}
        >
          Enter Text
          {activeTab === 'text' && (
            <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#4369e0]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Tab;