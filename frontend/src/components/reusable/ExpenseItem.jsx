import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExpenseContext } from "../../contexts/ExpenseContext";
import { GroupContext } from "../../contexts/GroupContext";
import { LuPartyPopper } from "react-icons/lu";
import { TiGroupOutline } from "react-icons/ti";
import { MdRestaurant } from "react-icons/md";
import { TbContract, TbDeviceUnknownFilled } from "react-icons/tb";
import { GiTiedScroll } from "react-icons/gi";
import { formatDate } from "../../utils/date";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const ExpenseItem = ({
  expense,
  transactionState,
  isGroupExpense,
  onClick,
  inExpenseManager = false, // New prop to determine if it's in expense manager
}) => {
  const { expenseDispatch } = useContext(ExpenseContext);
  const { groupState } = useContext(GroupContext);
  const [groupName, setGroupName] = useState("");
  const navigate = useNavigate();

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

  // Check if this item is a payment transaction or income
  const isPayment = expense.isPayment || false;
  const isIncome = expense.isIncome || false; // Only true if explicitly tagged as income
  const isIncoming = expense.amount > 0 && isPayment;

  // Get appropriate icon and styling
  let itemIcon;
  let colorClass;

  if (isIncome) {
    itemIcon = <FaArrowDown size={24} />; // Incoming money icon
    colorClass = "bg-green-600"; // Green for incoming
  } else if (isPayment) {
    itemIcon = isIncoming ? (
      <FaArrowDown size={24} /> // Incoming payment
    ) : (
      <FaArrowUp size={24} />
    ); // Outgoing payment

    colorClass = isIncoming
      ? "bg-green-600" // Green for incoming
      : "bg-red-600"; // Red for outgoing
  } else {
    // Regular expense logic
    itemIcon = isGroupExpense ? <TiGroupOutline size={24} /> : categoryIcon;

    colorClass = isGroupExpense ? "bg-blue-600" : "bg-black";
  }

  // Determine text color for amount display
  const amountTextColor = isIncome
    ? "text-green-500"
    : isIncoming
    ? "text-green-500"
    : "text-red-500";

  // Handle clicks differently based on location
  const handleItemClick = () => {
    if (inExpenseManager && onClick) {
      // If in expense manager and has onClick handler, use it
      onClick(expense);
    } else if (!inExpenseManager && !isPayment) {
      // If not in expense manager and not a payment, navigate to expense manager
      navigate("/expense-manager");
    } else if (isPayment && onClick) {
      // If payment and has onClick, handle payment clicks
      onClick(expense);
    }
  };

  // Determine cursor style based on clickability
  const cursorStyle =
    inExpenseManager || isPayment
      ? "cursor-pointer hover:bg-gray-100"
      : "cursor-default";

  return (
    <div
      onClick={handleItemClick}
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 bg-white rounded-lg shadow-md transition ${cursorStyle} ${borderStyle}`}
    >
      <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
        <div
          className={`${colorClass} text-white p-1 rounded-full text-xs sm:text-sm`}
        >
          {itemIcon}
        </div>

        <div>
          <h3 className="font-semibold text-base sm:text-lg">
            {expense.title}
          </h3>

          <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
            {(isGroupExpense || isPayment) && groupName && (
              <span
                className={`${
                  isGroupExpense ? "text-indigo-600" : "text-blue-600"
                } font-medium`}
              >
                {groupName}
              </span>
            )}
            <p className="text-gray-500">
              {isPayment ? "Group Payment" : expense.category}
            </p>
            <p className="text-gray-400">{displayDate}</p>
          </div>
        </div>
      </div>

      <span
        className={`mt-2 sm:mt-0 text-base sm:text-lg font-bold ${amountTextColor}`}
      >
        {expense.amount < 0 ? `-€${formattedAmount}` : `€${formattedAmount}`}
      </span>
    </div>
  );
};

export default ExpenseItem;
