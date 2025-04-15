import React, { useContext } from "react";
import { ExpenseContext } from "../../contexts/ExpenseContext";
import { LuPartyPopper } from "react-icons/lu";
import { TiGroupOutline } from "react-icons/ti";
import { MdRestaurant } from "react-icons/md";
import { TbContract, TbDeviceUnknownFilled } from "react-icons/tb";
import { GiTiedScroll } from "react-icons/gi";
import { formatDate } from "../../utils/date";

const ExpenseItem = ({ expense, transactionState }) => {
  const { expenseDispatch } = useContext(ExpenseContext);

  const categoryIcons = {
    Fixed: <GiTiedScroll />,
    "Group Expenses": <TiGroupOutline size={24} />,
    "Food&Drinks": <MdRestaurant size={24} />,
    Entertainment: <LuPartyPopper size={24} />,
    Subscriptions: <TbContract size={24} />,
    Others: <TbDeviceUnknownFilled size={24} />,
  };

  const categoryIcon = categoryIcons[expense.category] || "🔍";
  const displayDate = formatDate(
    expense.transactionDate,
    expense.isRecurring,
    expense.recurringFrequency
  );

  const borderStyle =
    transactionState === "Pending Transactions"
      ? "border-dashed border-l-4 border-gray-500"
      : transactionState === "Today's Transactions"
      ? "border-solid border-l-4 border-gray-500"
      : "border-dotted border-l-4 border-gray-500";

  const openModal = () => {
    expenseDispatch({ type: "SET_SELECTED_EXPENSE", payload: expense });
  };
  const formattedAmount = Math.abs(expense.amount).toFixed(2);

  return (
    <div
      onClick={openModal}
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 transition ${borderStyle}`}
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <div className="bg-black text-white p-1 rounded-full text-xs sm:text-sm">
          {categoryIcon}
        </div>

        <div>
          <h3 className="font-semibold text-base sm:text-lg">
            {expense.title}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            <p className="text-gray-500">{expense.category}</p>
            <p className="text-gray-400">{displayDate}</p>
          </div>
        </div>
      </div>

      <span
        className={`mt-2 sm:mt-0 text-base sm:text-lg font-bold
       text-red-500`}
      >
        {expense.amount < 0 ? `-€${formattedAmount}` : `€${formattedAmount}`}
      </span>
    </div>
  );
};
export default ExpenseItem;
