const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-center">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 ${activeTab === tab ? 'bg-teal-700 text-white' : 'bg-gray-300'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;