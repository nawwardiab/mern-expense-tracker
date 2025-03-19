import { LuPartyPopper } from "react-icons/lu";
import { TiGroupOutline } from "react-icons/ti";
import { MdRestaurant } from "react-icons/md";
import { TbContract, TbDeviceUnknownFilled } from "react-icons/tb";
import { GiTiedScroll } from "react-icons/gi";

const ExpenseItem = ({ expense, currencySymbol, onClick }) => {
  // Define the icons for each category
  const categoryIcons = {
    Fixed: <GiTiedScroll />,
    "Group Expenses": <TiGroupOutline size={24} />,
    "Food&Drinks": <MdRestaurant size={24} />,
    Entertainment: <LuPartyPopper size={24} />,
    Subscriptions: <TbContract size={24} />,
    Others: <TbDeviceUnknownFilled size={24} />,
  };

  // Set the icon based on the expense category
  const categoryIcon = categoryIcons[expense.category] || "🔍"; // Default to 🔍 if the category is not recognized

  // Function to map currency codes to symbols
  const getCurrencySymbol = (currencyCode) => {
    const symbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[currencyCode] || currencyCode; // Default: show currency code if not found
  };

  return (
    <div
      className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
      onClick={() => {
        console.log("ExpenseItem clicked:", expense); // ✅ Debugging log
        if (onClick) onClick(); // ✅ Ensure onClick is called
      }}
    >
      <div className="flex items-center gap-4">
        <div className="bg-black text-white p-3 rounded-full">
          {categoryIcon}
        </div>
        <div>
          <h3 className="font-bold text-lg">{expense.title}</h3>
          <p className="text-gray-500">{expense.category}</p>
        </div>
      </div>

      <span
        className={`text-lg font-bold ${
          expense.amount < 0 ? "text-red-500" : "text-green-500"
        }`}
      >
        {expense.amount < 0
          ? `-${currencySymbol}${Math.abs(expense.amount)}`
          : `${currencySymbol}${expense.amount}`}
      </span>
    </div>
  );
};

export default ExpenseItem;
