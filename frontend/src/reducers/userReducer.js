export const initialUserState = {
  user: null,
  isUserLoggedin: false,
  error: null,
  message: null,   
  messageType: null,
  loading: false,  
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
    case "UPDATE_PROFILE_REQUEST":
    case "UPDATE_PASSWORD_REQUEST":
      return {
        ...state,
        loading: true,       // ✅ Start loading
        error: null,         // Clear previous errors
        message: null,       // Clear previous messages
        messageType: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isUserLoggedin: true,
        loading: false,      // ✅ Stop loading
        message: "Login successful!", // ✅ Success message
        messageType: "success",
      };

    case "UPDATE_PROFILE_SUCCESS":
      return {
        ...state,
        user: action.payload,
        loading: false,      // ✅ Stop loading
        message: "Profile updated successfully!", // ✅ Success message
        messageType: "success",
      };

      case "UPDATE_PASSWORD_SUCCESS":
        return {
          ...state,
          message: "Password updated successfully!",
          messageType: "success",
          loading: false,
        };
      
        case "UPDATE_NOTIFICATIONS_SUCCESS":
          return {
            ...state,
            user: { ...state.user, notificationSettings: action.payload },
            loading: false,
            message: "Notification settings updated successfully!",
            messageType: "success",
          };
    
          case "ERROR":
            return {
              ...state,
              error: action.payload,
              message: action.payload,
              messageType: "error",
              loading: false,
            };
      
          case "CLEAR_MESSAGE":
            return {
              ...state,
              message: null,
              messageType: null,
            };
      
          case "LOGOUT":
            return initialUserState;
      
          default:
            return state;
        }
      };
      
      export default userReducer;