import React, { useState } from "react";
// Possibly import PaymentContext if you're creating multiple payments
// or an "ExpenseContext" if you have that.

const SplitExpenseModal = ({ expense, groupMembers, onClose }) => {
  const [splitDetails, setSplitDetails] = useState([]);

  // Example: auto-calculate each share if you want even splits
  // or let the user input each share.

  const handleSplitChange = (userId, amount) => {
    setSplitDetails((prev) =>
      prev.map((d) => (d.userId === userId ? { ...d, amount } : d))
    );
  };

  const handleConfirmSplit = () => {
    // For each user who owes, call createPayment with:
    // { groupId: expense.groupId, payer, payee, amount, expenseId: expense._id }
    // Or do them all in one POST if your backend allows.
  };

  return (
    <div className="modal">
      <h2>Split Expense: {expense.title}</h2>
      {groupMembers.map((member) => (
        <div key={member.userId}>
          <span>{member.name}</span>
          <input
            type="number"
            min="0"
            value={
              splitDetails.find((d) => d.userId === member.userId)?.amount || 0
            }
            onChange={(e) =>
              handleSplitChange(member.userId, Number(e.target.value))
            }
          />
        </div>
      ))}
      <button onClick={handleConfirmSplit}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default SplitExpenseModal;
