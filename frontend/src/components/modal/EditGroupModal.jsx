import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

import { GroupContext } from "../../contexts/GroupContext";
import {
  fetchUserGroups,
  deleteGroup,
  updateGroupInformation,
} from "../../api/groupApi";

const EditGroupModal = ({ onClose }) => {
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { selectedGroup } = groupState;

  // const [name, setName] = useState(selectedGroup.name);
  // const [totalAmount, setTotalAmount] = useState(group.totalAmount || 0);
  // const [members, setMembers] = useState(group.members || []);
  // const [allUsers, setAllUsers] = useState([]);
  // const [isEditing, setIsEditing] = useState({});

  const formData = {
    name: selectedGroup.name,
    description: selectedGroup.description,
    members: selectedGroup.members,
  };

  const [updatedGroup, setUpdatedGroup] = useState(formData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserGroups(groupDispatch);
  }, []);

  // const handleMemberToggle = (userId) => {
  //   const isMember = members.some((m) => {
  //     const id = typeof m.groupMember === "object" ? m.groupMember._id : m.groupMember;
  //     return id === userId;
  //   });

  //   if (isMember) {
  //     setMembers((prev) =>
  //       prev.filter((m) => {
  //         const id = typeof m.groupMember === "object" ? m.groupMember._id : m.groupMember;
  //         return id !== userId;
  //       })
  //     );
  //   } else {
  //     setMembers((prev) => [...prev, { groupMember: userId, role: "member" }]);
  //   }
  // };

  // const toggleEdit = (field) => {
  //   setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateGroupInformation(
        selectedGroup._id,
        updatedGroup,
        groupDispatch
      );

      setTimeout(() => {
        onClose(); // gives time for parent to catch the update
      }, 100);

      await fetchUserGroups(groupDispatch);
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
      await deleteGroup(selectedGroup._id, groupDispatch);

      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error("Delete group failed:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 z-50">
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
              value={updatedGroup.name}
              onChange={(e) =>
                setUpdatedGroup({ ...updatedGroup, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Description</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={updatedGroup.description}
              onChange={(e) =>
                setUpdatedGroup({
                  ...updatedGroup,
                  description: e.target.value,
                })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Members</label>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {updatedGroup.members.map((user) => {
                return (
                  <div
                    key={user.groupMember._id}
                    className="flex justify-between items-center p-1"
                  >
                    <span>{user.groupMember.fullName}</span>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded-lg text-white ${
                        user ? "bg-red-600" : "bg-green-600"
                      }`}
                      // onClick={() => handleMemberToggle(user._id)}
                    >
                      {user ? "Remove" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 mt-2 cursor-pointer transition-all duration-300"
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
