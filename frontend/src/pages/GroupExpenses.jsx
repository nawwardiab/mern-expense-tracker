import React, { useState, useEffect } from "react";
import axios from "axios";
import { useContext } from "react";

import GroupList from "../components/GroupList";
import GroupDetail from "../components/GroupDetail";
import ExpenseTable from "../components/ExpenseTable";
import AddGroupExpense from "../components/modal/AddGroupExpense";
import { AuthContext } from "../contexts/AuthContext";


const GroupExpenses = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user: currentUser } = useContext(AuthContext);

  //if (loading) {
  //  return <div className="text-center p-6">Loading...</div>;
  //}

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const { data } = await axios.get("/groups", { withCredentials: true });
      setGroups(data);
      if (data.length > 0) setSelectedGroup(data[0]); // Auto-select first group
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleGroupAdded = (newGroup) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]); // Update Group List
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Page Title and Button - Full Width */}
      <div className="bg-white shadow-md p-6 flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold text-gray-900">Group Expense Management</h1>

        {/* Open Modal Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all"
        >
          New Group Expense
        </button>
      </div>

      {/* Content Section - Sidebar & Main Content */}
      <div className="flex flex-1">
        {/* Sidebar - Group List */}
        <aside className="w-1/4 bg-white border-r shadow-md p-4 overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Groups</h2>
          <GroupList
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            currentUser={currentUser}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Group Details & Expense Table */}
            {selectedGroup ? (
              <>
                <GroupDetail group={selectedGroup} />
                <ExpenseTable groupId={selectedGroup._id} />
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
          onGroupAdded={handleGroupAdded}
        />
      )}
    </div>
  );
};

export default GroupExpenses;
