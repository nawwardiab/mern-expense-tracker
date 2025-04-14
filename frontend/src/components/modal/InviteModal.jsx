import React, { useContext, useState } from "react";
import { InviteContext } from "../../contexts/InviteContext.jsx";
import { createInvite, createInviteByEmail } from "../../api/inviteApi.js";
import { FaTimes } from "react-icons/fa";

const InviteModal = ({ group, onClose }) => {
  const { inviteState, inviteDispatch } = useContext(InviteContext);
  const { inviteURL, loading, error, emailInviteSuccess } = inviteState;

  const [email, setEmail] = useState("");

  // Generate link
  const handleGenerateInvite = async () => {
    await createInvite(group._id, inviteDispatch);
  };

  // Copy link
  const handleCopyLink = () => {
    if (inviteURL) {
      navigator.clipboard.writeText(inviteURL);
      alert("Link copied to clipboard!");
    }
  };

  // Invite by email
  const handleInviteByEmail = async () => {
    if (!email) return;
    await createInviteByEmail(group._id, email, inviteDispatch);
    setEmail("");
  };

  const handleCloseModal = () => {
    inviteDispatch({ type: "CLEAR_INVITE_LINK" });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-xl"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Invite Friends to {group?.name}
        </h2>
        <p className="text-gray-700 mb-4">{group?.description}</p>

        {/* Invite by Email */}
        <div className="my-4 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Invite by Email</h3>
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded flex-grow"
            />
            <button
              onClick={handleInviteByEmail}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer transition-all"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </div>
          {/* Show success message if email invite was successful */}
          {emailInviteSuccess && (
            <p className="text-green-600 mt-2">{emailInviteSuccess}</p>
          )}
        </div>

        {/* Generate Link Button */}
        <div className="mb-4">
          <button
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-600 cursor-pointer transition-all"
            onClick={handleGenerateInvite}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Invite Link"}
          </button>
        </div>

        {/* Global Error Message */}
        {error && <p className="text-red-600 mb-2">Error: {error}</p>}

        {/* Show the Link if generated */}
        {inviteURL && !loading && !error && (
          <div className="mb-4">
            <label className="block font-semibold mb-1">Share this link:</label>
            <div className="flex items-center">
              <input
                type="text"
                readOnly
                className="border border-gray-300 px-2 py-1 flex-grow"
                value={inviteURL}
              />
              <button
                className="bg-gray-200 ml-2 px-3 py-1 rounded-lg hover:bg-gray-300"
                onClick={handleCopyLink}
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          className="w-full bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300 mt-2"
          onClick={handleCloseModal}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default InviteModal;
