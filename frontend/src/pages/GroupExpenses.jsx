import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";

import GroupList from "../components/GroupList";
import GroupDetail from "../components/GroupDetail";
import ExpenseTable from "../components/ExpenseTable";
import AddGroupExpense from "../components/modal/AddGroupModal";
import GroupMembersTable from "../components/GroupMembersTable";

import { GroupContext } from "../contexts/GroupContext";
import { fetchUserGroups } from "../api/groupApi";
import PaymentList from "../components/PaymentList";

const GroupExpenses = () => {
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { selectedGroup } = groupState;

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchUserGroups(groupDispatch);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Page Title and Button - Full Width */}
      <div className="bg-white shadow-md p-6 flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold mb-8">Group Expense Management</h1>

        {/* Open Modal Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
        >
          New Group
        </button>
      </div>

      {/* Content Section - Sidebar & Main Content */}
      <div className="flex flex-1 h-full overflow-y-auto p-3 sm:p-4 bg-gray-50 scrollbar-hide">
        {/* Sidebar - Group List */}
        <aside className="w-1/4 bg-white border-r shadow-md p-4 overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Groups</h2>
          <GroupList />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Group Details & Expense Table */}
            {selectedGroup ? (
              <>
                <GroupDetail />
                <GroupMembersTable />
                <ExpenseTable />
                <PaymentList groupId={selectedGroup?._id} />
              </>
            ) : (
              <p className="text-center text-gray-500">No group selected.</p>
            )}
          </div>
        </main>
      </div>

      {/* Add Group Expense Modal */}
      {isModalOpen && (
        <AddGroupExpense
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          // onGroupAdded={handleGroupAdded}
        />
      )}
    </div>
  );
};

export default GroupExpenses;
