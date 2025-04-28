import React, { useState, useEffect, useContext } from "react";
import { ExpenseContext } from "../contexts/ExpenseContext";
import { GroupContext } from "../contexts/GroupContext";
import { fetchGroupExpenses } from "../api/groupApi";

// Modals
import AddGroupExpense from "./modal/AddGroupModal";
import EditGroupModal from "./modal/EditGroupModal";
import InviteModal from "./modal/InviteModal";

const GroupDetail = () => {
  const { expenseState, expenseDispatch } = useContext(ExpenseContext);
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { selectedGroup } = groupState;
  const { expenses } = expenseState;

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  // const [loading, setLoading] = useState(true);

  console.log("groupState", groupState);

  //Only update groupInfo if the group object exists and has a valid _id
  useEffect(() => {
    if (selectedGroup?._id) {
      // setGroupInfo(selectedGroup);
      fetchGroupExpenses(selectedGroup._id, groupDispatch);
    }
  }, []);

  const uniqueMemberCount = new Set(
    selectedGroup?.members?.map((m) => m.groupMember)
  ).size;

  const handleInviteClick = () => {
    setShowInviteModal(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full">
      {/* Group Name & Edit Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {selectedGroup?.name}
          </h1>
          <p className="text-gray-600 mt-2">{selectedGroup?.description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <button
            className="bg-black text-white px-4 py-3 rounded-lg w-full sm:w-auto text-sm font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
            onClick={() => setEditModalOpen(true)}
          >
            ✏️ Edit Group
          </button>
          <button
            className="bg-black text-white px-4 py-3 rounded-lg w-full sm:w-auto text-sm font-semibold hover:bg-gray-800 transition-all duration-200"
            onClick={handleInviteClick}
          >
            Invite Friends
          </button>
        </div>
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
        />
      )}
      {/* Invite Modal (only render it if showInviteModal = true) */}
      {showInviteModal && (
        <InviteModal
          group={selectedGroup}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

export default GroupDetail;
