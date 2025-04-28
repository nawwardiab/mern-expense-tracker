import Invite from "../models/Invite.js";
import Group from "../models/Group.js";

import { generateInviteToken } from "../utils/generateInviteToken.js";
import { sendInvitationEmail } from "../middleware/sendInvitationEmail.js";

//! Create Invitation link
//! POST /invites/:groupId/create
export const createInviteLink = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only group creator can generate links
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to generate invitation link" });
    }

    const token = generateInviteToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week

    const inviteDoc = new Invite({
      token,
      group: group._id,
      createdBy: req.user._id,
      expiresAt,
    });

    await inviteDoc.save();

    const inviteURL = `http://localhost:5173/invite/${token}`;

    res.status(201).json({
      inviteURL,
      expiresAt,
      message: "Invite link created successfully",
    });
  } catch (error) {
    console.error("Error creating the Invitation Link", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

//! Send Email Invitation
//! POST /invites/:groupId/email
export const inviteByEmail = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;

    // ! 1) Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // ! 2) Check that only the group creator can send invites
    if (group.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only group creator can invite by email" });
    }

    // ! 3) Generate a unique token for this invite
    const token = generateInviteToken();

    // ! 4) Create an Invite record (like your existing logic)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
    const inviteDoc = new Invite({
      token,
      group: groupId,
      createdBy: req.user._id,
      expiresAt,
    });
    await inviteDoc.save();

    // ! 5) Construct the invite link
    const inviteLink = `http://localhost:5173/invite/${token}`;

    // ! 6) Send an email with the link
    await sendInvitationEmail(email, group.name, inviteLink);

    res.status(200).json({
      message: `Invite sent to ${email}`,
      inviteURL: inviteLink,
    });
  } catch (error) {
    console.error("Error inviting by email:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//! Validating the Invitation
//! GET /invite/:token/validate
export const validateInviteToken = async (req, res) => {
  try {
    const { token } = req.params;
    const invite = await Invite.findOne({ token }).populate("group");
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    //! Check expiration
    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite link has expired" });
    }

    res.status(200).json({
      message: "Invite is valid",
      group: {
        _id: invite.group._id,
        name: invite.group.name,
        description: invite.group.description,
      },
    });
  } catch (error) {
    console.error("Error Validating the Invitation", error.message);
    res.status(500).json({ message: error.message });
  }
};

//! Accepting the Invitation
//! PATCH /invite/:token/accept
export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.params;

    //! Must be logged in to accept
    if (!req.user) {
      return res.status(401).json({ message: "Please log in" });
    }

    const invite = await Invite.findOne({ token }).populate("group");

    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite link has expired" });
    }

    //! Check if user is already a member
    const isAlreadyMember = invite.group.members.some(
      (member) => member.groupMember.toString() === req.user._id.toString()
    );

    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of this group" });
    }

    //! Add user to group
    invite.group.members.push({ groupMember: req.user._id });
    await invite.group.save();

    res.status(200).json({
      message: "You have joined the group successfully",
      groupId: invite.group._id,
    });
  } catch (error) {
    console.error("Error accepting invitation", error.message);
    res.status(500).json({ message: error.message });
  }
};
