import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ExpenseTable from "./ExpenseTable";
import AddGroupExpense from "./modal/AddGroupModal";
import EditGroupModal from "./modal/EditGroupModal";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { GroupContext } from "../contexts/GroupContext";
import { fetchGroupExpenses, updateGroup } from "../api/groupApi";

const GroupDetail = () => {
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { selectedGroup, groups } = groupState;
  const { expenses } = expenseState;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  //Only update groupInfo if the group object exists and has a valid _id
  useEffect(() => {
    if (selectedGroup?._id) {
      // setGroupInfo(selectedGroup);
      fetchGroupExpenses(selectedGroup._id, groupDispatch);
    }
  }, []);
  console.log("Selected Group from GroupDetail", selectedGroup);
  // fetchGroupExpenses(selectedGroup._id, groupDispatch);
  // updateGroup(selectedGroup._id, groupDispatch);
  // // updateGroup(selectedGroup._id);
  // const fetchUpdatedGroup = async () => {
  //   try {
  //     const { data } = await axios.get(`/groups/${selectedGroup._id}`, {
  //       withCredentials: true,
  //     });
  //     console.log("🚀 ~ fetchUpdatedGroup ~ data:", data);
  //     setGroupInfo(data); // ✅ update UI
  //   } catch (error) {
  //     console.error("❌ Failed to fetch updated group:", error);
  //   }
  // };

  // const handleExpenseAdded = (newExpense) => {
  //   setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  // };

  const uniqueMemberCount = new Set(
    selectedGroup?.members?.map((m) => m.userId)
  ).size;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full">
      {/* Group Name & Edit Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedGroup?.name}
          </h1>
          <p className="text-gray-600 mt-2">{selectedGroup?.description}</p>
        </div>
        <div className="flex gap-3">
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            onClick={() => setEditModalOpen(true)}
          >
            ✏️ Edit Group
          </button>
        </div>
      </div>

      {/* Expenses */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Expenses</h2>
        {loading ? (
          <p className="text-center text-gray-500 py-4">Loading expenses...</p>
        ) : expenses.length > 0 ? (
          <ExpenseTable expenses={expenses} />
        ) : (
          <p className="text-gray-500 text-center py-4">
            No expenses recorded yet.
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-b pb-4 text-center">
        <div>
          <h2 className="text-sm font-semibold text-gray-600">Total Cost</h2>
          <p className="text-xl font-bold text-gray-900">
            {selectedGroup?.totalAmount || 0} €
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-600">Members</h2>
          <p className="text-xl font-bold text-gray-900">
            {uniqueMemberCount || "—"}
          </p>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <AddGroupExpense
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          groupId={selectedGroup._id}
          onExpenseAdded={handleExpenseAdded}
        />
      )}

      {/* Edit Group Modal */}
      {editModalOpen && (
        <EditGroupModal
          group={selectedGroup}
          onClose={() => setEditModalOpen(false)}
          onGroupUpdated={fetchUpdatedGroup}
        />
      )}
    </div>
  );
};

export default GroupDetail;
