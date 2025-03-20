import React from "react";

const GroupList = ({ groups, selectedGroup, setSelectedGroup }) => {
    return (
        <div className="w-1/4 bg-gray-100 p-4 h-screen">
            <h2 className="text-lg font-semibold mb-4">Group Expenses</h2>
            <ul>
                {groups.map((group) => (
                    <li
                        key={group._id}
                        className={`p-3 rounded-lg cursor-pointer ${selectedGroup?._id === group._id
                                ? "bg-gray-300 font-bold"
                                : "hover:bg-gray-200"
                            }`}
                        onClick={() => setSelectedGroup(group)}
                    >
                        {group.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GroupList;
