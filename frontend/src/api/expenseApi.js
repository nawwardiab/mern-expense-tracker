import axios from "axios";

// Fetch all expenses
export async function getAllExpenses(dispatch) {
  const response = await axios.get(`/expenses`);
  // Typically returns { success: true, data: [...] }
  console.log("🚀 ~ getAllExpenses ~ response:", response);
  dispatch({ type: "GET_EXPENSES", payload: response.data.data });
}

// Create (add) a new expense
export async function createExpense(expenseData, dispatch) {
  try {
    const response = await axios.post(`/expenses/add`, expenseData);

    dispatch({ type: "ADD_EXPENSE", payload: response.data });
  } catch (error) {}
}

// Update an expense
export async function updateExpense(expenseId, updates) {
  const response = await axios.patch(`/expenses/${expenseId}`, updates, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data; // => { success, data: updated expense }
}

// Delete an expense
export async function deleteExpense(expenseId) {
  const response = await axios.delete(`/expenses/${expenseId}`, {
    withCredentials: true,
  });
  return response.data; // => { success, message }
}
