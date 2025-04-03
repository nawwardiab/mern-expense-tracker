import axios from "axios";

//! Login function
export const login = async (email, password, dispatch) => {
  try {
    const response = await axios.post("/users/login", {
      email,
      password,
    });

    const user = response.data.data;

    dispatch({ type: "LOGIN_SUCCESS", payload: user });
    return user;
  } catch (error) {
    console.error("Login error:", error);
    dispatch({ type: "ERROR", payload: error });
    throw error;
  }
};

//! Signup function
export const signup = async (fullName, email, password) => {
  try {
    await axios.post("/users/register", {
      fullName,
      email,
      password,
    });
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

//! Logout function
export const logout = async (dispatch) => {
  try {
    await axios.get("/users/logout");
    dispatch({ type: "LOGOUT" });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

// Fetch User Data (including notification settings)
export const getMyData = async (dispatch) => {
  try {
    const response = await axios.get("/users/me", { withCredentials: true });

    if (response.data && response.data.user) {
      const user = response.data.user;

      if (user.profilePicture && !user.profilePicture.startsWith("http")) {
        user.profilePicture = `${process.env.REACT_APP_BACKEND_URL}/${user.profilePicture}`;
      }

      // Dispatch user data to auth state
      dispatch({ type: "LOGIN_SUCCESS", payload: user });

      console.log("✅ User data fetched successfully:", user);

      // Return the user object for further processing
      return user;
    }
  } catch (error) {
    console.error("Error logging in: ", error.message);
    dispatch({ type: "ERROR", payload: error.message });
  }
};


//! Update Profile function
export const updateProfile = async (formData, dispatch) => {
  dispatch({ type: "UPDATE_PROFILE_REQUEST" });
  try {
    const response = await axios.patch("/users/update-profile", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Server Response: ", response.data);  // Debug log
    
    const updatedUser = response.data.user;


    dispatch({ type: "UPDATE_PROFILE_SUCCESS", payload: updatedUser });
    return updatedUser;
  } catch (error) {
    console.error("Profile update error:", error);
    dispatch({ type: "ERROR", payload: error.message });
    throw error;
  }
};

//! Update Password function
export const updatePassword = async (currentPassword, newPassword, dispatch) => {
  try {
    const response = await axios.patch(
      "/users/update-password",
      { currentPassword, newPassword },
      { withCredentials: true }
    );

    dispatch({ type: "UPDATE_PASSWORD_SUCCESS", payload: response.data.message });
    return response.data.message;
  } catch (error) {
    console.error("Password update error:", error);
    dispatch({ type: "ERROR", payload: error.message });
    throw error;
  }
};

//! Update Notification Settings function (Fixed)
export const updateNotificationSettings = async (notificationSettings, dispatch) => {
  try {
    console.log(" Attempting to save notification settings...", notificationSettings);

    const response = await axios.patch(
      "/users/update-notifications",  // Ensure your backend route matches this
      { notificationSettings },       // Directly send the settings object
      { withCredentials: true }
    );

    console.log("Server response:", response.data);

    const updatedNotifications = response.data.notificationSettings;

    dispatch({ type: "UPDATE_NOTIFICATIONS_SUCCESS", payload: updatedNotifications });
    return updatedNotifications;
  } catch (error) {
    console.error(" Error saving notification settings:", error.message);
    dispatch({ type: "ERROR", payload: error.message });
  }
};


//! Reset Password
//export const resetPassword = async (formData, dispatch) => {
  //try {
    //const response = await axios.patch("/users/profile", formData);

    //dispatch({ type: "RESET_PASSWORD", payload: response.data.data });
  //} catch (error) {
    // dispatch({
    //   type: "ERROR",
    //   payload: {
    //     error,
    //     customMessage: "Something went wrong. Please try again.",
    //   },
    // });

  //  console.error("Error changeing Password: ", error.message);
 // }
//};
