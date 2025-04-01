// src/api/groupApi.js
import axios from "axios";

// 1) Get all user groups
export async function fetchUserGroups(dispatch) {
  const response = await axios.get("/groups", { withCredentials: true });
  dispatch({ type: "FETCH_GROUPS", payload: response.data });
}

// Create a new group only
export async function createGroup(groupData, dispatch) {
  try {
    const response = await axios.post("/groups/create", groupData);

    dispatch({ type: "ADD_GROUP", payload: response.data.group });
  } catch (error) {
    console.error("Error Creating a Group", error.message);
  }
}

// Add a new expense to a group

export async function addGroupExpense(groupId, expenseData, dispatch) {
  const response = await axios.patch(
    `/groups/${groupId}/add-expense`,
    expenseData,
    {
      withCredentials: true,
    }
  );
  dispatch({ type: "UPDATE_GROUP", payload: response.data });
}

// 4) Delete a group
export async function deleteGroup(groupId, dispatch) {
  try {
    await axios.delete(`/groups/${groupId}`, {
      withCredentials: true,
    });

    dispatch({ type: "DELETE_GROUP" });
  } catch (error) {
    console.error("Error deleting a group", error.message);
  }
}

// 5) Add a member
export async function addMember(groupId, memberId) {
  const response = await axios.post(
    `/groups/${groupId}/add`,
    { memberId },
    {
      withCredentials: true,
    }
  );
}

// 6) Remove a member
export async function removeMember(groupId, memberId) {
  const response = await axios.delete(`/groups/${groupId}/remove`, {
    data: { memberId },
    withCredentials: true,
  });
}

// 7) Get group expenses
export async function fetchGroupExpenses(groupId, dispatch) {
  const response = await axios.get(`/groups/${groupId}/expenses`, {
    withCredentials: true,
  });
  dispatch({ type: "GET_GROUP_EXPENSES", payload: response.data });
}

// 9) Edit a group expense
export async function editGroupExpense(groupId, expenseId, payload) {
  const response = await axios.patch(
    `/groups/${groupId}/edit-expense/${expenseId}`,
    payload,
    {
      withCredentials: true,
    }
  );
}

// 10) Delete a group expense
export async function deleteGroupExpense(groupId, expenseId) {
  await axios.delete(`/groups/${groupId}/delete-expense/${expenseId}`, {
    withCredentials: true,
  });
}

export async function updateGroupInformation(groupId, newGroupData, dispatch) {
  try {
    const response = await axios.patch(`/groups/${groupId}`, newGroupData);
    dispatch({ type: "UPDATE_GROUP", payload: response.data });
  } catch (error) {
    console.error("Error updating the group", error.message);
  }
}
