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

    case "RESET_PASSWORD":
      return {
        ...state,
        user: action.payload,
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
