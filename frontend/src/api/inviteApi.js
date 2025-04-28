import axios from "axios";

// 1) CREATE INVITE
export async function createInvite(groupId, inviteDispatch) {
  try {
    inviteDispatch({ type: "CREATE_LINK_REQUEST" });

    // POST request to the backend endpoint
    const response = await axios.post(`/invites/${groupId}/create`);

    inviteDispatch({ type: "CREATE_LINK_SUCCESS", payload: response.data });
  } catch (error) {
    inviteDispatch({
      type: "CREATE_LINK_ERROR",
      payload: error.response?.data?.message || error.message,
    });
  }
}

export async function createInviteByEmail(groupId, email, inviteDispatch) {
  try {
    inviteDispatch({ type: "CREATE_EMAIL_INVITE_REQUEST" });
    // or define a new action type specifically for email invites

    const response = await axios.post(`/invites/${groupId}/email`, { email });

    inviteDispatch({
      type: "CREATE_EMAIL_INVITE_SUCCESS",
      payload: response.data,
    });
  } catch (error) {
    inviteDispatch({
      type: "CREATE_EMAIL_INVITE_ERROR",
      payload: error.response?.data?.message || error.message,
    });
  }
}

// 2) VALIDATE INVITE (GET /invite/:token/validate)
export async function validateInvite(token, inviteDispatch) {
  try {
    inviteDispatch({ type: "VALIDATE_INVITE_REQUEST" });

    // GET request to validate the token
    const response = await axios.get(`/invites/${token}/validate`);

    // Response might look like: { message, group: { _id, name, description } }
    inviteDispatch({ type: "VALIDATE_INVITE_SUCCESS", payload: response.data });
  } catch (error) {
    inviteDispatch({
      type: "VALIDATE_INVITE_ERROR",
      payload: error.response?.data?.message || error.message,
    });
  }
}

// 3) ACCEPT INVITE (PATCH /invite/:token/accept)
export async function acceptInvite(token, inviteDispatch) {
  try {
    inviteDispatch({ type: "ACCEPT_INVITE_REQUEST" });

    // PATCH request to accept the invite
    const response = await axios.patch(`/invites/${token}/accept`);

    // Response might look like: { message, groupId }
    inviteDispatch({ type: "ACCEPT_INVITE_SUCCESS", payload: response.data });
  } catch (error) {
    inviteDispatch({
      type: "ACCEPT_INVITE_ERROR",
      payload: error.response?.data?.message || error.message,
    });
  }
}
