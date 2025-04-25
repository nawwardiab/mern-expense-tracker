import React, { useContext, useMemo } from "react";
import { GroupContext } from "../contexts/GroupContext";
import { AuthContext } from "../contexts/AuthContext";
import { formatAmount } from "../utils/format";

const GroupSummaryCard = () => {
  const { groupState } = useContext(GroupContext);
  const { userState } = useContext(AuthContext);
  const { groups } = groupState;
  const { user } = userState;

  // Calculate group statistics
  const stats = useMemo(() => {
    if (!groups || !user)
      return { totalGroups: 0, asCreator: 0, asMember: 0, totalExpenses: 0 };

    const totalGroups = groups.length;
    const asCreator = groups.filter(
      (group) =>
        group.createdBy === user._id ||
        (group.createdBy && group.createdBy._id === user._id)
    ).length;
    const asMember = totalGroups - asCreator;

    // Calculate total expenses across all groups
    const totalExpenses = groups.reduce((sum, group) => {
      return sum + (group.totalAmount || 0);
    }, 0);

    return { totalGroups, asCreator, asMember, totalExpenses };
  }, [groups, user]);

  return (
    <div className="bg-gray-200 rounded-xl p-4">
      <p className="text-sm font-medium mb-1">Group Expenses</p>
      <p className="text-2xl font-bold text-indigo-600 mb-2">
        €{formatAmount(stats.totalExpenses)}
      </p>

      <div className="flex justify-between mt-3 text-sm">
        <div>
          <p className="text-gray-600">Total Groups</p>
          <p className="text-lg font-semibold">{stats.totalGroups}</p>
        </div>

        <div className="flex gap-4">
          <div>
            <p className="text-gray-600">As Creator</p>
            <p className="text-lg font-semibold">{stats.asCreator}</p>
          </div>

          <div>
            <p className="text-gray-600">As Member</p>
            <p className="text-lg font-semibold">{stats.asMember}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSummaryCard;
