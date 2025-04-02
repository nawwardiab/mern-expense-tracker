// components/SummaryCards.jsx
const SummaryCards = () => {
    return (
      <section className="grid gap-4 mb-6">
        {/* Balance Card */}
        <div className="bg-gray-300 rounded-xl p-6">
          <p className="text-lg font-semibold mb-1">Current Balance</p>
          <h2 className="text-4xl font-bold">$9,876.33</h2>
        </div>
  
        {/* Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
            <p className="text-sm font-medium">All Transactions</p>
            <p className="text-lg font-semibold">$25,920</p>
          </div>
          <div className="bg-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
            <p className="text-sm font-medium">Total Income</p>
            <p className="text-lg font-semibold">$20,850</p>
          </div>
          <div className="bg-gray-200 rounded-xl p-4 flex flex-col items-center justify-center">
            <p className="text-sm font-medium">Total Expenses</p>
            <p className="text-lg font-semibold">$10,100</p>
          </div>
        </div>
      </section>
    );
  };
  
  export default SummaryCards;
  