import axios from "axios";

//! Login function
export const login = async (email, password, dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/users/login",
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    console.log("🚀 ~ login ~ response:", response);

    const user = response.data.data;

    dispatch({ type: "LOGIN_SUCCESS", payload: user });
    return user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

//! Signup function
export const signup = async (fullName, email, password) => {
  try {
    await axios.post("http://localhost:8000/users/register", {
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
    await axios.get("http://localhost:8000/users/logout", {
      withCredentials: true,
    });
    dispatch({ type: "LOGOUT" });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const getMyData = async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:8000/users/me", {
      withCredentials: true,
    });

    if (response.data && response.data.isAuthenticated) {
      dispatch({ type: "LOGIN_SUCCESS", payload: response.data });
    }
  } catch (error) {
    console.log(error);
  }
};
