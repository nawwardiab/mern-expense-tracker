export const initialUserState = {
  user: null,
  isUserLoggedin: false,
  error: null,
  loading: false,  // ✅ New loading state
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
    case "UPDATE_PROFILE_REQUEST":
    case "UPDATE_PASSWORD_REQUEST":
      return {
        ...state,
        loading: true,   // ✅ Start loading
        error: null,     // Clear any previous errors
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isUserLoggedin: true,
        loading: false,  // ✅ Stop loading
      };

    case "UPDATE_PROFILE_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,  // ✅ Stop loading
      };

    case "UPDATE_PASSWORD_SUCCESS":
      return {
        ...state,
        message: action.payload,
        loading: false,  // ✅ Stop loading
      };
      
    case "UPDATE_NOTIFICATIONS_SUCCESS":
      return {
        ...state,
        user: { ...state.user, notificationSettings: action.payload },
        loading: false,  // ✅ Stop loading
      };

    case "ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,  // ✅ Stop loading
      };

    case "LOGOUT":
      return initialUserState;

    default:
      return state;
  }
};

export default userReducer;
