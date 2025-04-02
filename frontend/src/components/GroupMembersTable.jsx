import React, { useContext } from "react";
import { GroupContext } from "../contexts/GroupContext";

const GroupMembersTable = () => {
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { selectedGroup } = groupState;

  const amountPerMember =
    selectedGroup.totalAmount && selectedGroup.members.length
      ? (selectedGroup.totalAmount / selectedGroup.members.length).toFixed(2)
      : 0;

  return (
    <div className="mt-6 bg-gray-200 p-4 rounded-lg">
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-black font-semibold">
            <th className="p-2">Members</th>
            <th className="p-2">Expense Contribution</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {selectedGroup.members.map((member, index) => {
            const name =
              typeof member.userId === "object"
                ? member.userId.fullName
                : "Member";
            return (
              <tr key={index} className="border-t border-gray-300">
                <td className="p-2 font-medium">{name}</td>
                <td className="p-2">{amountPerMember} €</td>
                <td className="p-2 text-green-600">Pending</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default GroupMembersTable;
