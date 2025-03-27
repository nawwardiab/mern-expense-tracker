import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

import { GroupContext } from "../../contexts/GroupContext";
import { fetchUserGroups, updateGroup, deleteGroup } from "../../api/groupApi";

const EditGroupModal = ({ group, onClose, onGroupUpdated }) => {
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { selectedGroup } = groupState;

  const [name, setName] = useState(group.name || "");
  const [totalAmount, setTotalAmount] = useState(group.totalAmount || 0);
  const [members, setMembers] = useState(group.members || []);
  const [allUsers, setAllUsers] = useState([]);
  const [isEditing, setIsEditing] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserGroups();
  }, []);

  const handleMemberToggle = (userId) => {
    const isMember = members.some((m) => {
      const id = typeof m.userId === "object" ? m.userId._id : m.userId;
      return id === userId;
    });

    if (isMember) {
      setMembers((prev) =>
        prev.filter((m) => {
          const id = typeof m.userId === "object" ? m.userId._id : m.userId;
          return id !== userId;
        })
      );
    } else {
      setMembers((prev) => [...prev, { userId, role: "member" }]);
    }
  };

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const editedGroup = {
      name,
      totalAmount,
      members,
    };

    try {
      await updateGroup(selectedGroup._id, groupDispatch);

      if (onGroupUpdated) onGroupUpdated();
      onClose();

      setTimeout(() => {
        onClose(); // gives time for parent to catch the update
      }, 100);
    } catch (error) {
      const msg = error.response?.data?.message;

      if (error.response?.status === 403) {
        alert(msg || "You are not authorized to edit this group.");
      } else {
        console.error("Failed to update group:", msg || error.message);
        alert("Something went wrong while updating the group.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;

    try {
      await axios.delete(`http://localhost:8000/groups/${group._id}`, {
        withCredentials: true,
      });

      if (onGroupUpdated) onGroupUpdated(); // refresh list
      onClose();

      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to delete group.";
      alert(msg); // You can replace this with a toast or custom modal if preferred
      console.error("Delete group failed:", msg);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4">Edit Group</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">Group Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Total Amount</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={totalAmount}
              onChange={(e) => setTotalAmount(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Members</label>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {allUsers.map((user) => {
                const isMember = members.some((m) => {
                  const id =
                    typeof m.userId === "object" ? m.userId._id : m.userId;
                  return id === user._id;
                });

                return (
                  <div
                    key={user._id}
                    className="flex justify-between items-center p-1"
                  >
                    <span>{user.fullName || user.email}</span>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded text-white ${
                        isMember ? "bg-red-500" : "bg-green-500"
                      }`}
                      onClick={() => handleMemberToggle(user._id)}
                    >
                      {isMember ? "Remove" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-2"
            onClick={handleDeleteGroup}
          >
            Delete Group
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditGroupModal;
