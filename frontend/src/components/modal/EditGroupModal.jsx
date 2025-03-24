import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";


const EditGroupModal = ({ group, onClose, onGroupUpdated }) => {
    const [name, setName] = useState(group.name || "");
    const [totalAmount, setTotalAmount] = useState(group.totalAmount || 0);
    const [members, setMembers] = useState(group.members || []);
    const [allUsers, setAllUsers] = useState([]);
    const [isEditing, setIsEditing] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/users", { withCredentials: true });
            setAllUsers(data);
        } catch (err) {
            console.error("Failed to fetch users:", err);
        }
    };

    const handleMemberToggle = (userId) => {
        const isMember = members.some((m) => m.userId === userId);
        if (isMember) {
            setMembers((prev) => prev.filter((m) => m.userId !== userId));
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
            await axios.patch(`http://localhost:8000/groups/${group._id}`, editedGroup, {
                withCredentials: true,
            });

            if (onGroupUpdated) onGroupUpdated();
            onClose();
        } catch (error) {
            console.error("Failed to update group:", error);
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
        } catch (error) {
            console.error("Failed to delete group:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
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
                            {allUsers.map((user) => (
                                <div key={user._id} className="flex justify-between items-center p-1">
                                    <span>{user.fullName || user.email}</span>
                                    <button
                                        type="button"
                                        className={`px-3 py-1 rounded text-white ${members.some((m) => m.userId === user._id)
                                            ? "bg-red-500"
                                            : "bg-green-500"
                                            }`}
                                        onClick={() => handleMemberToggle(user._id)}
                                    >
                                        {members.some((m) => m.userId === user._id) ? "Remove" : "Add"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>

                    {group.isCreator && (
                        <button
                            type="button"
                            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-2"
                            onClick={handleDeleteGroup}
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
