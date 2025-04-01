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

export const getMyData = async (dispatch) => {
  try {
    const response = await axios.get("/users/me");

    if (response.data && response.data.isAuthenticated) {
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data.user });
    }
  } catch (error) {
    console.error("Error logging in: ", error.message);
  }
};

//! Reset Password
export const resetPassword = async (formData, dispatch) => {
  try {
    const response = await axios.patch("/users/profile", formData);

    dispatch({ type: "RESET_PASSWORD", payload: response.data.data });
  } catch (error) {
    // dispatch({
    //   type: "ERROR",
    //   payload: {
    //     error,
    //     customMessage: "Something went wrong. Please try again.",
    //   },
    // });

    console.error("Error changeing Password: ", error.message);
  }
};
