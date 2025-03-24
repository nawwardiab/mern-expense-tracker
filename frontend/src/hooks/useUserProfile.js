// src/hooks/useUserProfile.js
import { useState, useEffect } from "react";
import axios from "axios";

function useUserProfile() {
  const [profile, setProfile] = useState(null); // Will hold the user's data
  const [loading, setLoading] = useState(true); // For a loading indicator
  const [error, setError] = useState(null); // For any fetch errors

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:8000/users/profile",
          {
            withCredentials: true,
          }
        );
        // Depending on your server’s response shape:
        // e.g. { success: true, user: {...} } or { success: true, data: {...} }
        const userData = response.data.user || response.data.data || {};
        setProfile(userData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { profile, loading, error };
}

export default useUserProfile;
