import React, { useEffect, useState } from "react";
import axios from "axios";

const GroupList = ({ selectedGroup, setSelectedGroup, onGroupAdded, currentUser }) => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/groups", { withCredentials: true });
            setGroups(data);
        } catch (error) {
            console.error("Error fetching groups:", error);
        }
    };

    // Update the group list when a new group is added
    const handleGroupAdded = (newGroup) => {
        setGroups((prevGroups) => [...prevGroups, newGroup]);
    };

    return (
        <div className="w-full bg-gray-100 p-6 h-screen">
            <ul className="space-y-2">
                {groups.map((group) => {

                    const isCreator = currentUser?._id && group.creator === currentUser._id;

                    return (
                        <li
                            key={group._id}
                            className={`p-4 rounded-lg cursor-pointer text-lg text-center 
                ${selectedGroup?._id === group._id ? "bg-gray-300 font-bold" : "hover:bg-gray-200"}`}
                            onClick={() => {
                                if (!currentUser?._id) return;
                                const isCreator = group.creator === currentUser._id;
                                setSelectedGroup({ ...group, isCreator });
                            }}
                        >
                            {group.name}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default GroupList;
