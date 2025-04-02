// components/TransactionList.jsx
const TransactionList = () => {
    const mockTransactions = [
      {
        section: "Pending Transactions",
        items: [
          {
            title: "Food Expenses",
            description: "Dining Out",
            amount: "-$189.36",
            icon: "🍽️",
          },
        ],
      },
      {
        section: "Today's Transactions",
        items: [
          {
            title: "Coffee Expenses",
            description: "Retail Expenses",
            amount: "-$189.36",
            icon: "☕",
          },
          {
            title: "Shopping Expenses",
            description: "Retail Purchases",
            amount: "$350.00",
            icon: "🛍️",
            highlight: true,
          },
          {
            title: "Tech Expenses",
            description: "Gadgets and Electronics",
            amount: "-$189.36",
            icon: "💻",
          },
        ],
      },
      {
        section: "21 January 2022",
        items: [
          {
            title: "Restaurant Expenses",
            description: "Eating Out",
            amount: "-$189.36",
            icon: "🍔",
          },
          {
            title: "Personal Care",
            description: "Beauty and Hygiene",
            amount: "$350.00",
            icon: "🧴",
          },
        ],
      },
    ];
  
    return (
      <aside className="w-full md:max-w-sm p-4">
        <h2 className="text-xl font-bold mb-4">Transaction Summary</h2>
        {mockTransactions.map((section, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-semibold text-gray-600 text-sm mb-2">{section.section}</h3>
            <div className="space-y-2">
              {section.items.map((item, j) => (
                <div
                  key={j}
                  className={`flex justify-between items-center p-4 rounded-lg ${
                    item.highlight ? "bg-gray-300" : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <div className="font-semibold">{item.amount}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <p className="text-sm text-gray-500 mt-2 cursor-pointer hover:underline">See more...</p>
      </aside>
    );
  };
  
  export default TransactionList;
  