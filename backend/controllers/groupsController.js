import Group from "../models/Group.js";



//Get all groups for a user
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await Group.find({ "members.userId": userId });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


//Create a new group
export const createGroup = async (req, res) => {
  try {
    // Added members = [], totalAmount = 0
    const { name, description, members = [], totalAmount = 0 } = req.body;
    console.log("🟢 Received Payload:", req.body);
    const userId = req.user.id;

    if (!name || members.length === 0) {
      return res.status(400).json({ message: "Group name and members are required." });
    }

    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Group name already exists." });
    }

    // Formatted Members
    const formattedMembers = members.map(member => ({
      userId: member.userId || member,
      role: member.role || "member",
    }));
    console.log("🟢 Formatted Members:", formattedMembers);

    // Ensure creator is admin
    formattedMembers.push({ userId: req.user.id, role: "admin" });

    // Create the group
    const group = new Group({
      name,
      description,
      members: formattedMembers,
      totalAmount,
      createdBy: req.user.id,
    });

    await group.save();
    res.status(201).json({ message: "Group created successfully.", group });

  } catch (error) {
    console.error("❌ Error creating group:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


//Edit group name or description (can be done also by a member)
export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    const isAdmin = group.members.some(member => member.userId.toString() === userId && member.role === "admin");
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can edit group details." });
    }

    if (name) group.name = name;
    if (description) group.description = description;

    await group.save();
    res.json({ message: "Group updated successfully.", group });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


//Delete a group (only by Creator/Admin)
export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    if (group.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only the group creator can delete this group." });
    }

    await Group.findByIdAndDelete(groupId);
    res.json({ message: "Group deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


//Add a member to a group (only by Admin)
export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    const isAdmin = group.members.some(member => member.userId.toString() === userId && member.role === "admin");
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can add members." });
    }

    if (group.members.some(member => member.userId.toString() === memberId)) {
      return res.status(400).json({ message: "User is already a member." });
    }

    group.members.push({ userId: memberId, role: "member" });
    await group.save();

    res.json({ message: "Member added successfully.", group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


//Remove a member from a group (only by Admin)
export const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    const isAdmin = group.members.some(member => member.userId.toString() === userId && member.role === "admin");
    if (!isAdmin) {
      return res.status(403).json({ message: "Only admins can remove members." });
    }

    if (!group.members.some(member => member.userId.toString() === memberId)) {
      return res.status(404).json({ message: "Member not found in group." });
    }

    group.members = group.members.filter(member => member.userId.toString() !== memberId);
    await group.save();

    res.json({ message: "Member removed successfully.", group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


//Get all expenses for a group
export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("expenses");
    if (!group) {
      return res.status(404).json({ message: "Group not found." });
    }

    res.json(group.expenses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
