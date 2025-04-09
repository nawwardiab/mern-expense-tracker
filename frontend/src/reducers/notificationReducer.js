// Initial state for notifications
export const initialNotificationState = {
  notificationSettings: {
    expenseAlerts: false,
    communityUpdates: false,
    paymentReminders: false,
    featureAnnouncements: false,
  },
  notificationCount: 0,
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_NOTIFICATIONS":
      const settings = action.payload || initialNotificationState.notificationSettings;
      const count = countActiveNotifications(settings);

      return {
        ...state,
        notificationSettings: settings,
        notificationCount: count,
      };

    case "UPDATE_NOTIFICATIONS_SUCCESS":
      const updatedSettings = action.payload;
      const updatedCount = countActiveNotifications(updatedSettings);

      console.log("Updated notification settings from backend:", updatedSettings); 

      return {
        ...state,
        notificationSettings: updatedSettings,
        notificationCount: updatedCount,
      };

    case "TOGGLE_NOTIFICATION":
      const toggledSettings = {
        ...state.notificationSettings,
        [action.payload]: !state.notificationSettings[action.payload],
      };
      const toggledCount = countActiveNotifications(toggledSettings);

      return {
        ...state,
        notificationSettings: toggledSettings,
        notificationCount: toggledCount,
      };

    case "RESET_NOTIFICATIONS":
      return initialNotificationState;

    default:
      return state;
  }
};

// Helper function to count active notifications
const countActiveNotifications = (notificationSettings = {}) => {
  return Object.values(notificationSettings).filter(Boolean).length;
};

export default notificationReducer;
