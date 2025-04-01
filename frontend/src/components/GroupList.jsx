// GroupList should fetch and show all groups from the backend, and when a new group is added, show it at the top — without duplicating or managing groups manually inside GroupList.
import React, { useContext, useEffect } from "react";
import axios from "axios";

import { GroupContext } from "../contexts/GroupContext";
import { AuthContext } from "../contexts/AuthContext";
import { fetchUserGroups } from "../api/groupApi";

const GroupList = () => {
  const { userState } = useContext(AuthContext);
  const { user } = userState;

  const { groupState, groupDispatch } = useContext(GroupContext);
  const { groups, selectedGroup } = groupState;

  useEffect(() => {
    fetchUserGroups(groupDispatch);
  }, []);

  const handleSelectGroup = (group) => {
    groupDispatch({
      type: "SET_SELECTED_GROUP",
      payload: group,
    });
  };

  return (
    <div className="w-full bg-gray-100 p-6 h-screen">
      <ul className="space-y-2">
        {groups.map((group) => {
          return (
            <li
              key={group._id}
              className={`p-4 rounded-lg cursor-pointer text-lg text-center 
                ${
                  selectedGroup?._id === group._id
                    ? "bg-gray-300 font-bold"
                    : "hover:bg-gray-200"
                }`}
              onClick={() => handleSelectGroup(group)}
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
