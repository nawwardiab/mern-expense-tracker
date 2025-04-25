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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Page Title and Button - Full Width */}
      <div className="bg-white shadow-md p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center w-full gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0 text-center sm:text-left">
          Group Expense Management
        </h1>

        {/* Open Modal Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200 w-full sm:w-auto"
        >
          New Group
        </button>
      </div>

      {/* Content Section - Sidebar & Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto p-2 sm:p-4 bg-gray-50">
        {/* Sidebar - Group List */}
        <aside className="w-full lg:w-1/4 bg-white border-r shadow-md p-4 mb-4 lg:mb-0 rounded-lg lg:rounded-r-none">
          <h2 className="text-lg font-semibold mb-4">Groups</h2>
          <GroupList />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-0 sm:p-4 lg:p-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 h-full min-h-[360px]">
            {/* Group Details & Expense Table */}
            {selectedGroup ? (
              <>
                <GroupDetail />
                <ExpenseTable />
                <GroupMembersTable />
                <PaymentList groupId={selectedGroup?._id} />
              </>
            ) : (
              <p className="text-center text-gray-500 py-20">No group selected.</p>
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
