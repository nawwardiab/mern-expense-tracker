import React, { useContext, useEffect, useState } from "react";
import { ExpenseContext } from "../../contexts/ExpenseContext";
import { GroupContext } from "../../contexts/GroupContext";
import { LuPartyPopper } from "react-icons/lu";
import { TiGroupOutline } from "react-icons/ti";
import { MdRestaurant } from "react-icons/md";
import { TbContract, TbDeviceUnknownFilled } from "react-icons/tb";
import { GiTiedScroll } from "react-icons/gi";
import { formatDate } from "../../utils/date";

const ExpenseItem = ({ expense, transactionState, isGroupExpense, onClick }) => {
  const { groupState } = useContext(GroupContext);
  const [groupName, setGroupName] = useState("");

  // Find group name if it's a group expense
  useEffect(() => {
    if (expense.groupId && groupState.groups) {
      const group = groupState.groups.find(
        (g) =>
          g._id === expense.groupId ||
          (typeof expense.groupId === "object" && g._id === expense.groupId._id)
      );
      setGroupName(group ? group.name : "Group Expense");
    }
  }, [expense, groupState.groups]);

  // Category icons mapping
  const categoryIcons = {
    Fixed: <GiTiedScroll />,
    "Group Expenses": <TiGroupOutline size={24} />,
    "Food&Drinks": <MdRestaurant size={24} />,
    Entertainment: <LuPartyPopper size={24} />,
    Subscriptions: <TbContract size={24} />,
    Others: <TbDeviceUnknownFilled size={24} />,
  };

  const categoryIcon = categoryIcons[expense.category] || (
    <TbDeviceUnknownFilled size={24} />
  );

  // Format date and amount
  const displayDate = formatDate(
    expense.transactionDate,
    expense.isRecurring,
    expense.recurringFrequency
  );
  const formattedAmount = Math.abs(expense.amount).toFixed(2);

  // Border styles depending on transaction state
  const borderStyle =
    transactionState === "Pending Transactions"
      ? "border-dashed border-l-4 border-gray-500"
      : transactionState === "Today's Transactions"
        ? "border-solid border-l-4 border-gray-500"
        : "border-dotted border-l-4 border-gray-500";

  return (
    <div
      onClick={onClick ? () => onClick(expense) : undefined}
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 bg-white rounded-lg shadow-md
        ${onClick ? "cursor-pointer hover:bg-gray-100 transition" : ""}
        ${borderStyle}`}
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <div
          className={`${isGroupExpense ? "bg-indigo-600" : "bg-black"
            } text-white p-1 rounded-full text-xs sm:text-sm`}
        >
          {isGroupExpense ? <TiGroupOutline size={24} /> : categoryIcon}
        </div>

        <div>
          <h3 className="font-semibold text-base sm:text-lg">
            {expense.title}
          </h3>
          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            {isGroupExpense && (
              <span className="text-indigo-600 font-medium">{groupName}</span>
            )}
            <p className="text-gray-500">{expense.category}</p>
            <p className="text-gray-400">{displayDate}</p>
          </div>
        </div>
      </div>

      <span
        className={`mt-2 sm:mt-0 text-base sm:text-lg font-bold
        ${expense.amount < 0 ? "text-red-500" : "text-green-500"}`}
      >
        {expense.amount < 0 ? `-€${formattedAmount}` : `€${formattedAmount}`}
      </span>
    </div>
  );
};

export default ExpenseItem;

