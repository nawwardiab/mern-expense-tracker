import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import { GroupContext } from "../../contexts/GroupContext";

const MemberSelector = ({ users, selectedMembers, onToggle }) => (
  <div className="max-h-40 overflow-y-auto border p-2 rounded">
    {users.map((u) => (
      <div
        key={u._id}
        className="flex items-center justify-between p-2 border-b"
      >
        <span>{u.fullName || u.email}</span>
        <button
          type="button"
          onClick={() => onToggle(u._id)}
          className={`px-4 py-1 rounded ${
            selectedMembers.includes(u._id) ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {selectedMembers.includes(u._id) ? "Remove" : "Add"}
        </button>
      </div>
    ))}
  </div>
);

const AddGroupModal = ({ isOpen, onClose }) => {
  const { userState } = useContext(AuthContext);
  const { groupDispatch } = useContext(GroupContext);
  const { user } = userState;

  const [group, setGroup] = useState({ name: "", description: "" });
  const [selectedMembers, setSelectedMembers] = useState([user?.user._id]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/users", { withCredentials: true });
        setUsers(res.data.filter((u) => u._id !== user._id));
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [user]);

  const handleChange = (e) => {
    setGroup((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMembers.length < 2) {
      setMessage({ type: "error", text: "At least 2 members required" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: group.name,
        description: group.description,
        createdBy: user.user._id,
        members: selectedMembers.map((id) => ({
          userId: id,
          role: id === user.user._id ? "admin" : "member",
        })),
        expenses: [],
        totalAmount: 0,
      };

      const { data } = await axios.post("/groups/create", payload, {
        withCredentials: true,
      });

      groupDispatch({ type: "ADD_GROUP", payload: data });
      setMessage({ type: "success", text: "Group created!" });
      setTimeout(() => {
        onClose();
        setMessage(null);
        setGroup({ name: "", description: "" });
        setSelectedMembers([user._id]);
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
            className={`mb-3 p-2 rounded text-sm ${
              message.type === "success"
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

          <div>
            <label className="font-semibold">Add Members</label>
            <MemberSelector
              users={users}
              selectedMembers={selectedMembers}
              onToggle={toggleMember}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
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
