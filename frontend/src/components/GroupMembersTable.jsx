import React, { useContext, useEffect, useState } from "react";
import { GroupContext } from "../contexts/GroupContext";
import SettleUpModal from "./modal/SettleUpModal";
import { AuthContext } from "../contexts/AuthContext";

const GroupMembersTable = () => {
  const { groupState } = useContext(GroupContext);
  const { selectedGroup } = groupState;
  const { userState } = useContext(AuthContext);
  const { user } = userState;
  const [settleUpData, setSettleUpData] = useState({
    show: false,
    payeeId: null,
    payeeName: "",
    amount: 0,
  });

  const [contributions, setContributions] = useState({});

  useEffect(() => {
    const newMap = {};
    (selectedGroup.expenses || []).forEach((exp) => {
      const uid = exp.userId?._id || exp.userId;
      newMap[uid] = (newMap[uid] || 0) + exp.amount;
    });
    setContributions(newMap);
  }, [selectedGroup]);

  if (!selectedGroup) {
    return <p>No group selected.</p>;
  }

  const expenses = selectedGroup.expenses || [];

  const numMembers = selectedGroup.members.length || 1;
  const shareEach = selectedGroup.totalAmount / numMembers;

  const handlePayNow = (payeeId, payeeName, netBalance) => {
    setSettleUpData({
      show: true,
      payeeId,
      payeeName,
      amount: Math.abs(netBalance),
    });
  };

  const handleConfirmPayment = ({ payeeId, payeeName, amount }) => {
    console.log(`User is paying ${amount}€ to ${payeeName} (ID: ${payeeId})`);
    const currentUserId = user._id;
    setContributions((prev) => ({
      ...prev,
      [currentUserId]: (prev[currentUserId] || 0) + amount,
    }));
    setSettleUpData({ show: false, payeeId: null, payeeName: "", amount: 0 });
  };

  return (
    <div className="mt-6 bg-gray-200 p-4 rounded-lg">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-black font-semibold">
            <th className="p-2">Member (Paid So Far)</th>
            <th className="p-2">Balance</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {selectedGroup.members.map((member) => {
            const userObj = member.userId;
            const memberId = userObj?._id || userObj;
            const name = userObj?.fullName || "Member";

            const paidSoFar = contributions[memberId] || 0;
            const netBalance = paidSoFar - shareEach;

            let balanceText = "Settled";
            if (netBalance > 0) {
              balanceText = `Owed ${netBalance.toFixed(2)}`;
            } else if (netBalance < 0) {
              balanceText = `Owes ${Math.abs(netBalance).toFixed(2)}`;
            }

            return (
              <tr key={memberId} className="border-t border-gray-300">
                <td className="p-2 font-medium">
                  {name}{" "}
                  <span className="text-sm text-gray-600">
                    ({paidSoFar.toFixed(2)} € paid)
                  </span>
                </td>
                <td className="p-2">{balanceText}</td>
                <td className="p-2">
                  {netBalance < 0 && (
                    <button
                      className=" bg-black text-white py-2 px-3 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
                      onClick={() => handlePayNow(memberId, name, netBalance)}
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
            setSettleUpData({
              show: false,
              payeeId: null,
              payeeName: "",
              amount: 0,
            })
          }
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default GroupMembersTable;
