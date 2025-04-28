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

  useEffect(() => {
    validateInvite(token, inviteDispatch);
  }, [token, inviteDispatch]);

  if (inviteState.loading)
    return (
      <div className="min-h-[40vh] flex flex-col justify-center items-center">
        <span className="inline-block h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg text-gray-600">Validating your invite...</p>
      </div>
    );

  if (inviteState.error)
    return (
      <div className="min-h-[40vh] flex flex-col justify-center items-center">
        <span className="inline-block h-8 w-8 border-4 border-red-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-lg text-red-500">Error: {inviteState.error}</p>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gradient-to-br from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 pt-10 px-4">
      <div className="w-full max-w-2xl rounded-2xl shadow-xl bg-white/90 dark:bg-gray-900/90 p-8">
        {inviteState.validatedGroup ? (
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-block bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 rounded-full shadow-lg mb-4">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                Group Invite Valid!
              </h1>
              <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{inviteState.validatedGroup.name}</p>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {inviteState.validatedGroup.description}
              </p>
            </div>
            <AcceptInviteButton token={token} />
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block bg-gradient-to-r from-red-500 to-red-600 p-4 rounded-full shadow-lg mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg text-red-600 font-medium">Invalid or expired invite link.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ValidateInvitePage;
