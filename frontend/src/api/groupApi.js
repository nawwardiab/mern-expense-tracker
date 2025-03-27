// src/api/groupApi.js
import axios from "axios";

// 1) Get all user groups
export async function fetchUserGroups(dispatch) {
  const response = await axios.get("/groups", { withCredentials: true });
  dispatch({ type: "FETCH_GROUPS", payload: response.data });
}

// Create a new group only
export async function createGroup(groupData, dispatch) {
  const res = await axios.post("/groups/create", groupData, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  dispatch({ type: "ADD_GROUP", payload: res.data });
  return res.data;
}

// Add a new expense to a group
export async function addGroupExpense(
  expenseData,
  groupDispatch,
  expenseDispatch
) {
  const res = await axios.post(
    `/groups/${expenseData.groupId}/add-expense`,
    expenseData,
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );

  const createdExpense = res.data;
  groupDispatch({ type: "ADD_GROUP_EXPENSE", payload: createdExpense });
  expenseDispatch({ type: "ADD_EXPENSE", payload: createdExpense });

  return createdExpense;
}

// 3) Update a group
export async function updateGroup(groupId, expenseData, dispatch) {
  const response = await axios.patch(`/groups/${groupId}`, expenseData, {
    withCredentials: true,
  });
  console.log("🚀 ~ updateGroup ~ data:", response.data);
  dispatch({ type: "UPDATE_GROUP", payload: response.data });
}

// 4) Delete a group
export async function deleteGroup(groupId) {
  const response = await axios.delete(`/groups/${groupId}`, {
    withCredentials: true,
  });
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
  console.log("🚀 ~ fetchGroupExpenses ~ Response:", response);
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
  const response = await axios.delete(
    `/groups/${groupId}/delete-expense/${expenseId}`,
    {
      withCredentials: true,
    }
  );
}
