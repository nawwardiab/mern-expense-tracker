export const initialUserState = {
    user: null,
    loading: true,
  };
  
  export const userReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN_SUCCESS":
        return { ...state, user: action.payload, loading: false };
      
      case "LOGOUT":
        return { ...state, user: null, loading: false };
  
      case "AUTH_CHECK":
        return { ...state, user: action.payload, loading: false };
  
      case "LOADING":
        return { ...state, loading: true };
  
      default:
        return state;
    }
  };
  export default userReducer;
