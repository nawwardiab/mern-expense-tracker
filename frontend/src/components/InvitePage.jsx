import React, { useContext, useEffect } from "react";
import { InviteContext } from "../contexts/InviteContext";
import { validateInvite } from "../api/inviteApi";
import { useParams } from "react-router-dom"; // if using React Router
import AcceptInviteButton from "./AcceptInviteButton";

function ValidateInvitePage() {
  const { token } = useParams();
  const { inviteState, inviteDispatch } = useContext(InviteContext);

  useEffect(() => {
    // Validate the invite token as soon as we load
    validateInvite(token, inviteDispatch);
  }, [token, inviteDispatch]);

  if (inviteState.loading) return <p>Validating...</p>;
  if (inviteState.error) return <p>Error: {inviteState.error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {inviteState.validatedGroup ? (
        <div>
          <h1>Invite is valid for group: {inviteState.validatedGroup.name}</h1>
          <p>{inviteState.validatedGroup.description}</p>
          {/* Accept Invite Button */}
          <AcceptInviteButton token={token} />
        </div>
      ) : (
        <p>Invalid or expired invite link.</p>
      )}
    </div>
  );
}

export default ValidateInvitePage;
