import React, { useState, useEffect, useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import { GroupContext } from "../../contexts/GroupContext";
import { createGroup } from "../../api/groupApi";

const AddGroupModal = ({ isOpen, onClose }) => {
  const { userState } = useContext(AuthContext);
  const { groupDispatch } = useContext(GroupContext);
  const { user } = userState;

  const [group, setGroup] = useState({ name: "", description: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setGroup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const payload = {
        name: group.name,
        description: group.description,
        createdBy: user._id,
        members: [{ userId: user._id }],
      };

      await createGroup(payload, groupDispatch);

      setMessage({ type: "success", text: "Group created!" });
      setTimeout(() => {
        onClose();
        setMessage(null);
        setGroup({ name: "", description: "" });
        setLoading(false);
      }, 1500);
    } catch (err) {
      console.error("Create group failed", err);
      setMessage({ type: "error", text: "Failed to create group." });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold mb-4">Create Group</h2>

        {message && (
          <div
            className={`mb-3 p-2 rounded text-sm ${message.type === "success"
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Group Title"
            value={group.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Group Description"
            value={group.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-600 cursor-pointer transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGroupModal;
