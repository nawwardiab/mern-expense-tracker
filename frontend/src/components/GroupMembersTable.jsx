import React, { useContext, useState } from "react";
import { GroupContext } from "../contexts/GroupContext";
import SettleUpModal from "./modal/SettleUpModal";

const GroupMembersTable = () => {
  const { groupState } = useContext(GroupContext);
  const { selectedGroup } = groupState;

  // Local state to open/close the settle-up modal
  const [settleUpData, setSettleUpData] = useState({
    show: false,
    amount: 0,
    payeeId: null,
  });

  if (!selectedGroup) {
    return <p>No group selected.</p>;
  }

  const expense = selectedGroup.expenses || [];

  // A map: userId -> totalPaidSoFar
  const contributions = {};
  expense.forEach((exp) => {
    const uid = exp.userId?._id || exp.userId;
    contributions[uid] = (contributions[uid] || 0) + exp.amount;
  });

  // Each member's share
  const numMembers = selectedGroup.members?.length || 1;
  const shareEach = selectedGroup.totalAmount / numMembers;

  // Handler for "Pay Now
  const handlePayNow = (userIdOwed, netBalance) => {
    // netBalance is the positive number that the user is Owed
    // The *current user* is the one who owes? Or are we showing each row's perspective?
    // pass netBalance as the amount to pay
    setSettleUpData({
      show: true,
      amount: Math.abs(netBalance),
      payeeId: userIdOwed,
    });
  };

  // const amountPerMember =
  //   selectedGroup.totalAmount && selectedGroup.members.length
  //     ? (selectedGroup.totalAmount / selectedGroup.members.length).toFixed(2)
  //     : 0;

  return (
    <div className="mt-6 bg-gray-200 p-4 rounded-lg">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-black font-semibold">
            <th className="p-2">Members</th>
            <th className="p-2">Paid So Far (€)</th>
            <th className="p-2">Balance</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedGroup.members.map((member) => {
            const userObj = member.userId;
            const memberId = userObj?._id || userObj;
            const name = userObj?.fullName || "Member";

            // Calculate how much this user paid
            const paidSoFar = contributions[memberId] || 0;
            // Net balance = paidSoFar - shareEach
            const netBalance = paidSoFar - shareEach;

            let balanceText = "Settled";
            if (netBalance > 0) {
              balanceText = `Owed ${netBalance.toFixed(2)}`;
            } else if (netBalance < 0) {
              balanceText = `Owes ${Math.abs(netBalance).toFixed(2)}`;
            }

            return (
              <tr key={memberId} className="border-t border-gray-300">
                <td className="p-2 font-medium">{name}</td>
                <td className="p-2">{paidSoFar.toFixed(2)}</td>
                <td className="p-2">{balanceText}</td>
                <td className="p-2">
                  {netBalance < 0 && (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => handlePayNow(memberId, netBalance)}
                    >
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {settleUpData.show && (
        <SettleUpModal
          data={settleUpData}
          onClose={() =>
            setSettleUpData({ show: false, amount: 0, payeeId: null })
          }
        />
      )}
    </div>
  );
};

export default GroupMembersTable;
