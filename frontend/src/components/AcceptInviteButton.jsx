import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { InviteContext } from "../contexts/InviteContext";
import { acceptInvite } from "../api/inviteApi";

function AcceptInviteButton({ token }) {
  const { inviteState, inviteDispatch } = useContext(InviteContext);
  const { loading, error, acceptResult } = inviteState;
  const navigate = useNavigate();

  // Whenever acceptResult changes, if we have a groupId,
  // navigate to /groups/<groupId>

  useEffect(() => {
    if (acceptResult) navigate(`/expenses/group`);
  }, [acceptResult, navigate]);

  const handleAccept = () => {
    acceptInvite(token, inviteDispatch);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-xl p-8 border border-gray-100">
      {loading && (
        <p className="text-indigo-600 text-base font-medium animate-pulse mb-4">
          Accepting invite...
        </p>
      )}
      {error && (
        <p className="text-red-500 bg-red-100 rounded px-4 py-2 mb-4 border border-red-200">
          Error: {error}
        </p>
      )}
      {acceptResult && (
        <p className="text-green-700 bg-green-100 rounded px-4 py-2 mb-4 border border-green-200">
          {acceptResult.message}
        </p>
      )}

      <button
        className="bg-black text-white px-8 py-3 rounded-lg shadow-lg hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-semibold tracking-wide text-lg"
        onClick={handleAccept}
        disabled={loading}
      >
        Accept Invitation
      </button>
    </div>
  );
}

export default AcceptInviteButton;
