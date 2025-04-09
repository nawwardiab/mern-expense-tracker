export const initialUserState = {
  user: null,
  isUserLoggedin: false,
  error: null,
  loading: false,
  message: null,
  messageType: null,
  isOnboarded: false, // ✅ New: Tracks if the user has completed onboarding
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
    case "UPDATE_PROFILE_REQUEST":
    case "UPDATE_PASSWORD_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
        messageType: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isUserLoggedin: true,
        isOnboarded: action.payload.isOnboarded || false, 
        loading: false,
        message: "Login successful!",
        messageType: "success",
      };

    case "UPDATE_PROFILE_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isOnboarded: action.payload.isOnboarded || false, 
        loading: false,
        message: "Profile updated successfully!",
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

    case "ONBOARDING_COMPLETE": 
      return {
        ...state,
        isOnboarded: true,
        user: { ...state.user, isOnboarded: true },
        message: "Onboarding completed successfully!",
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
