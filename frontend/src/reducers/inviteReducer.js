export const initialInviteState = {
  loading: false,
  error: null,
  inviteURL: null,
  validatedGroup: null,
  acceptResult: null,
  emailSuccessMessage: "",
};

function inviteReducer(state, action) {
  switch (action.type) {
    // CREATE
    case "CREATE_LINK_REQUEST":
      return { ...state, loading: true, error: null, inviteURL: null };
    case "CREATE_LINK_SUCCESS":
      return {
        ...state,
        loading: false,
        inviteURL: action.payload.inviteURL || null, // or however your API responds
      };
    case "CREATE_LINK_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_EMAIL_INVITE_REQUEST":
      return { ...state, loading: true, error: null, emailInviteSuccess: null };

    case "CREATE_EMAIL_INVITE_SUCCESS":
      return {
        ...state,
        loading: false,
        error: null,
        emailSuccessMessage: action.payload.message || "Email invite sent!",
      };
    case "CREATE_EMAIL_INVITE_ERROR":
      return { ...state, loading: false, error: action.payload };

    // VALIDATE
    case "VALIDATE_INVITE_REQUEST":
      return { ...state, loading: true, error: null, validatedGroup: null };
    case "VALIDATE_INVITE_SUCCESS":
      return {
        ...state,
        loading: false,
        validatedGroup: action.payload.group, // { _id, name, description }
      };
    case "VALIDATE_INVITE_ERROR":
      return { ...state, loading: false, error: action.payload };

    // ACCEPT
    case "ACCEPT_INVITE_REQUEST":
      return { ...state, loading: true, error: null, acceptResult: null };
    case "ACCEPT_INVITE_SUCCESS":
      return {
        ...state,
        loading: false,
        acceptResult: action.payload,
      };
    case "ACCEPT_INVITE_ERROR":
      return { ...state, loading: false, error: action.payload };

    // CLEAR INVITE
    case "CLEAR_INVITE_LINK":
      return {
        ...state,
        inviteURL: null,
        validatedGroup: null,
        acceptResult: null,
        error: null,
      };

    default:
      return state;
  }
}

export default inviteReducer;
