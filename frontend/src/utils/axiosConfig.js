import axios from "axios";

export const setAxiosDefaults = () => {
  axios.defaults.baseURL = "http://localhost:8000";
  axios.defaults.withCredentials = true;
};
