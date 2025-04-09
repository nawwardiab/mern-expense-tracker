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
    <div>
      {loading && <p>Accepting invite...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {
        acceptResult && (
          <p>{acceptResult.message}</p>
        ) /* e.g. "Joined successfully" */
      }

      <button
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-all"
        onClick={handleAccept}
        disabled={loading}
      >
        Accept Invitation
      </button>
    </div>
  );
}

export default AcceptInviteButton;
