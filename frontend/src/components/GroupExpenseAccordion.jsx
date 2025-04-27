import React, { useState, useContext, useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { GroupContext } from "../contexts/GroupContext";
import { AuthContext } from "../contexts/AuthContext";
import { formatAmount } from "../utils/format";
import { Link, useNavigate } from "react-router-dom";

const GroupExpenseAccordion = () => {
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { userState } = useContext(AuthContext);
  const { groups } = groupState;
  const { user } = userState;
  const navigate = useNavigate();

  // State to track which accordion items are expanded
  const [expandedGroups, setExpandedGroups] = useState({});

  // Toggle accordion expansion
  const toggleExpand = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Handle view all expenses - navigate to group expenses page and select the group
  const handleViewAllExpenses = (group, e) => {
    e.preventDefault(); // Prevent default link behavior

    // Set the selected group in context
    groupDispatch({
      type: "SET_SELECTED_GROUP",
      payload: group,
    });

    // Navigate to the group expenses page
    navigate("/expenses/group");
  };

  // Calculate user's contribution and balance in each group
  const groupData = useMemo(() => {
    if (!groups || !user) return [];

    return groups.map((group) => {
      // Get expenses from this group
      const expenses = group.expenses || [];

      // Calculate total group amount
      const totalGroupAmount = group.totalAmount || 0;

      // Count members
      const memberCount = group.members?.length || 1;

      // User's expected contribution (equal split)
      const expectedContribution = totalGroupAmount / memberCount;

      // User's actual contribution (sum of expenses created by user)
      const actualContribution = expenses.reduce((sum, expense) => {
        const expenseUserId =
          typeof expense.userId === "object"
            ? expense.userId?._id
            : expense.userId;

        return expenseUserId === user._id
          ? sum + Number(expense.amount || 0)
          : sum;
      }, 0);

      // User's balance in this group
      const balance = actualContribution - expectedContribution;

      // Get recent expenses (last 3)
      const recentExpenses = [...expenses]
        .sort(
          (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
        )
        .slice(0, 3);

      return {
        ...group,
        totalGroupAmount,
        expectedContribution,
        actualContribution,
        balance,
        recentExpenses,
      };
    });
  }, [groups, user]);

  // If no groups, show a message
  if (!groupData || groupData.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <p className="text-gray-500 text-center">No group expenses found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Group Expenses</h3>

      {groupData.map((group) => (
        <div
          key={group._id}
          className="bg-white rounded-lg shadow-sm overflow-hidden"
        >
          {/* Group Header */}
          <div
            className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleExpand(group._id)}
          >
            <div>
              <h4 className="font-medium">{group.name}</h4>
              <p className="text-sm text-gray-600">
                {group.members?.length || 0} members
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm">Your Balance</p>
                <p
                  className={`font-medium ${group.balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                  {group.balance >= 0 ? "+ " : "- "}€
                  {formatAmount(Math.abs(group.balance))}
                </p>
              </div>

              {expandedGroups[group._id] ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>

          {/* Expanded Content */}
          {expandedGroups[group._id] && (
            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between mb-3 text-sm">
                <div>
                  <p className="text-gray-600">Total Group Expenses</p>
                  <p className="font-medium">
                    €{formatAmount(group.totalGroupAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Your Contribution</p>
                  <p className="font-medium">
                    €{formatAmount(group.actualContribution)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Expected Share</p>
                  <p className="font-medium">
                    €{formatAmount(group.expectedContribution)}
                  </p>
                </div>
              </div>

              {/* Recent Expenses */}
              {group.recentExpenses.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Recent Expenses</p>
                  <div className="space-y-2">
                    {group.recentExpenses.map((expense) => (
                      <div
                        key={expense._id}
                        className="flex justify-between items-center bg-white p-2 rounded text-sm"
                      >
                        <div>
                          <p className="font-medium">{expense.title}</p>
                          <p className="text-xs text-gray-600">
                            {new Date(
                              expense.transactionDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="font-medium">
                          €{formatAmount(expense.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="text-right mt-2">
                    <a

                      ///onClick={(e) => handleViewAllExpenses(group, e)}
                      //className="text-blue-600 text-sm"

                      href={`/groups/${group._id}`}
                      className="text-indigo-600 text-sm"

                    >
                      View all expenses →
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupExpenseAccordion;
