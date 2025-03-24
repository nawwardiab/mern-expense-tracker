export const initialUserState = {
  user: null,
  isUserLoggedin: false,
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

    default:
      return state;
  }
};
export default userReducer;
