import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaTimes, FaUserMinus } from "react-icons/fa";

import { GroupContext } from "../../contexts/GroupContext";
import {
  fetchUserGroups,
  deleteGroup,
  updateGroupInformation,
  removeMember,
} from "../../api/groupApi";
import { AuthContext } from "../../contexts/AuthContext";

const EditGroupModal = ({ onClose }) => {
  const { groupState, groupDispatch } = useContext(GroupContext);
  const { userState } = useContext(AuthContext);
  const { selectedGroup } = groupState;
  const { user } = userState;

  // const [name, setName] = useState(selectedGroup.name);
  // const [totalAmount, setTotalAmount] = useState(group.totalAmount || 0);
  // const [members, setMembers] = useState(group.members || []);
  // const [allUsers, setAllUsers] = useState([]);
  // const [isEditing, setIsEditing] = useState({});

  const [error, setError] = useState(null);
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

  // Debug the creator values
  console.log("Selected Group:", selectedGroup);
  console.log("Current User:", user);

  // Get creator ID regardless of whether it's an object or string
  const getID = (entity) => {
    if (!entity) return null;
    return typeof entity === "object" ? entity._id : entity;
  };

  // Check if current user is the creator
  const isCreator = user && getID(selectedGroup.createdBy) === getID(user);

  const handleRemoveMember = async (memberId) => {
    if (!isCreator) {
      setError("Only the group creator can remove members");
      return;
    }

    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      setLoading(true);
      await removeMember(selectedGroup._id, memberId);

      // Update local state
      const updatedMembers = updatedGroup.members.filter(
        (member) => member.groupMember._id !== memberId
      );

      setUpdatedGroup({
        ...updatedGroup,
        members: updatedMembers,
      });

      // Update global state
      groupDispatch({
        type: "REMOVE_MEMBER",
        payload: {
          groupId: selectedGroup._id,
          members: updatedMembers,
        },
      });

      setError(null);
    } catch (error) {
      console.error("Failed to remove member:", error);
      setError(error.response?.data?.message || "Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

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
        setError(msg || "You are not authorized to edit this group.");
      } else {
        console.error("Failed to update group:", msg || error.message);
        setError("Something went wrong while updating the group.");
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

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

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
            <label className="block text-sm font-semibold mb-2">Members</label>
            <div className="max-h-40 overflow-y-auto border rounded p-2">
              {updatedGroup.members.map((user) => {
                const memberId = getID(user.groupMember);
                return (
                  <div
                    key={memberId}
                    className="flex justify-between items-center p-1 mb-1 border-b last:border-b-0"
                  >
                    <span>{user.groupMember.fullName}</span>
                    {isCreator && (
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 p-1"
                        onClick={() => handleRemoveMember(memberId)}
                        title="Remove member"
                        disabled={loading}
                      >
                        <FaUserMinus size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {!isCreator && updatedGroup.members.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Only the group creator can remove members
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          {isCreator && (
            <button
              type="button"
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 mt-2 cursor-pointer transition-all duration-300"
              onClick={handleDeleteGroup}
              disabled={loading}
            >
              Delete Group
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditGroupModal;
