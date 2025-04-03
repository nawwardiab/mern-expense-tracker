export const initialUserState = {
  user: null,
  isUserLoggedin: false,
  error: null,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isUserLoggedin: true,
      };

    case "LOGOUT":
      return initialUserState;

    case "UPDATE_PROFILE_SUCCESS":
      return {
        ...state,
        user: action.payload,
      };

    case "UPDATE_PASSWORD_SUCCESS":
      return {
        ...state,
        message: action.payload,
      };
    case "UPDATE_NOTIFICATIONS_SUCCESS":
      return {
        ...state,
        user: { ...state.user, notificationSettings: action.payload },
      };
    case "ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default userReducer;
