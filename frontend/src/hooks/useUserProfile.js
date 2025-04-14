// src/hooks/useUserProfile.js
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { getMyData } from "../api/authApi";
import { AuthContext } from "../contexts/AuthContext";

function useUserProfile() {
  const { userDispatch, userState } = useContext(AuthContext);
  const { user } = userState;

  const [loading, setLoading] = useState(true); // For a loading indicator
  const [error, setError] = useState(null); // For any fetch errors

  useEffect(() => {
    async function fetchData() {
      try {
        getMyData(userDispatch);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { profile: user, loading, error };
}

export default useUserProfile;
