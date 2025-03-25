import React from "react";
import { LuPartyPopper } from "react-icons/lu";
import { TiGroupOutline } from "react-icons/ti";
import { MdRestaurant } from "react-icons/md";
import { TbContract, TbDeviceUnknownFilled } from "react-icons/tb";
import { GiTiedScroll } from "react-icons/gi";
import { formatDate } from "../../utils/date";

const ExpenseItem = ({ expense, onClick }) => {
  // Define icons for each category
  const categoryIcons = {
    Fixed: <GiTiedScroll />,
    "Group Expenses": <TiGroupOutline size={24} />,
    "Food&Drinks": <MdRestaurant size={24} />,
    Entertainment: <LuPartyPopper size={24} />,
    Subscriptions: <TbContract size={24} />,
    Others: <TbDeviceUnknownFilled size={24} />,
  };

  // Choose icon based on category, or fallback
  const categoryIcon = categoryIcons[expense.category] || "🔍";

  // Format the transaction date (or recurring frequency)
  const displayDate = formatDate(
    expense.transactionDate,
    expense.isRecurring,
    expense.recurringFrequency
  );

  return (
    <div
      className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition"
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Icon block */}
        <div className="bg-black text-white p-3 rounded-full">
          {categoryIcon}
        </div>

        {/* Expense title & category + date */}
        <div>
          <h3 className="font-bold text-lg">{expense.title}</h3>
          <p className="text-gray-500">{expense.category}</p>
          <p className="text-xs text-gray-400">{displayDate}</p>
        </div>
      </div>

      {/* Amount (green if positive, red if negative) */}
      <span
        className={`text-lg font-bold ${
          expense.amount < 0 ? "text-red-500" : "text-green-500"
        }`}
      >
        {expense.amount < 0
          ? `-€${Math.abs(expense.amount)}`
          : `€${expense.amount}`}
      </span>
    </div>
  );
};

export default ExpenseItem;
