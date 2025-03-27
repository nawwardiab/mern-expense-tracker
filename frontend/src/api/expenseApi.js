import axios from "axios";

const API_BASE = "http://localhost:8000"; // or your environment variable

// Fetch all expenses
export async function getAllExpenses(dispatch) {
  const response = await axios.get(`${API_BASE}/expenses`, {
    withCredentials: true,
  });
  // Typically returns { success: true, data: [...] }
  dispatch({ type: "GET_EXPENSES", payload: response.data });
}

// Create (add) a new expense
export async function createExpense(expenseData) {
  const response = await axios.post(`${API_BASE}/expenses/add`, expenseData, {
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });
  return response.data; // => { success, data: newly created expense }
}

// Update an expense
export async function updateExpense(expenseId, updates) {
  const response = await axios.patch(
    `${API_BASE}/expenses/${expenseId}`,
    updates,
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data; // => { success, data: updated expense }
}

// Delete an expense
export async function deleteExpense(expenseId) {
  const response = await axios.delete(`${API_BASE}/expenses/${expenseId}`, {
    withCredentials: true,
  });
  return response.data; // => { success, message }
}
