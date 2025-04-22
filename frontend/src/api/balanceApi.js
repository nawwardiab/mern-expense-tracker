import axios from "axios";

// Fetch all balances for a group
export async function fetchGroupBalances(groupId, dispatch) {
  try {
    if (dispatch) dispatch({ type: "BALANCE_REQUEST" });

    const response = await axios.get(`/balances/${groupId}`);

    if (dispatch) {
      dispatch({
        type: "BALANCE_SUCCESS",
        payload: response.data.data,
      });
    }

    return response.data.data;
  } catch (error) {
    if (dispatch) {
      dispatch({
        type: "BALANCE_FAILURE",
        payload: error.message || "Failed to fetch balances",
      });
    }
    console.error("Error fetching group balances:", error);
    throw error;
  }
}

// Fetch balance for a specific user in a group
export async function fetchUserGroupBalance(groupId, userId, dispatch) {
  try {
    if (dispatch) dispatch({ type: "BALANCE_REQUEST" });

    const response = await axios.get(`/balances/${groupId}/${userId}`);

    if (dispatch) {
      dispatch({
        type: "USER_BALANCE_SUCCESS",
        payload: response.data.data,
      });
    }

    return response.data.data;
  } catch (error) {
    if (dispatch) {
      dispatch({
        type: "BALANCE_FAILURE",
        payload: error.message || "Failed to fetch user balance",
      });
    }
    console.error("Error fetching user balance:", error);
    throw error;
  }
}

// Update local balance state after a payment is made
export function updateBalanceAfterPayment(
  dispatch,
  { payerId, payeeId, amount }
) {
  if (dispatch) {
    dispatch({
      type: "UPDATE_BALANCE_AFTER_PAYMENT",
      payload: { payerId, payeeId, amount },
    });
  }
}
