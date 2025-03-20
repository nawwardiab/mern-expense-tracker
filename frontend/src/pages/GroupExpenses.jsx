import React, { useState, useEffect } from "react";
import axios from "axios";
import GroupList from "../components/GroupList";
import GroupDetail from "../components/GroupDetail";
import ExpenseTable from "../components/ExpenseTable"; // Ensure you have this component

const GroupExpenses = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Title and Button Full Width */}
      <div className="bg-white shadow-md p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Group Expense Management
        </h1>
        <button className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-900 transition-all duration-200">
          New Group Expense
        </button>
      </div>

      {/* Content Section - Split into Sidebar & Main Content */}
      <div className="flex flex-1">
        {/* Sidebar - Group List */}
        <aside className="w-1/4 bg-white border-r shadow-md p-4 overflow-auto">
          <h2 className="text-lg font-semibold mb-4">Groups</h2>
          <GroupList
            groups={groups}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Group Details */}
            {selectedGroup ? (
              <>
                <GroupDetail group={selectedGroup} />
                <ExpenseTable groupId={selectedGroup._id} /> {/* Expense Table Below Details */}
              </>
            ) : (
              <p className="text-center text-gray-500">No group selected.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GroupExpenses;
