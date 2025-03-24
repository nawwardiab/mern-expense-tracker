import Group from "../models/Group.js";
import Expense from "../models/Expense.js";
import Payment from "../models/Payment.js";



//Get all groups for a user
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await Group.find({ "members.userId": userId })
    .populate({
      path: "members.userId",
      select: "fullName"
    })
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


//Create a new group
export const createGroup = async (req, res) => {
  try {
<<<<<<< HEAD
    // Added members = [], totalAmount = 0
    const { name, description, members = [], totalAmount = 0 } = req.body;
    console.log("🟢 Received Payload:", req.body);
=======
    const { name, description, members } = req.body;
>>>>>>> main
    const userId = req.user.id;

    if (!name || !Array.isArray(members)) {
      return res.status(400).json({ message: "Group name and members are required." });
    }

    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Group name already exists." });
    }

<<<<<<< HEAD
    // Formatted Members
    const formattedMembers = members.map(member => ({
      userId: member.userId || member,
      role: member.role || "member",
=======
    const uniqueMemberIds = [...new Set(members.map(String))];

    // Filter out the creator (admin) from members list
    const filteredMemberIds = uniqueMemberIds.filter(memberId => memberId !== userId);

    const formattedMembers = filteredMemberIds.map(memberId => ({
      userId: memberId,
      role: "member"
>>>>>>> main
    }));
    console.log("🟢 Formatted Members:", formattedMembers);

<<<<<<< HEAD
    // Ensure creator is admin
    formattedMembers.push({ userId: req.user.id, role: "admin" });
=======
    // Add the creator as admin
    formattedMembers.push({ userId, role: "admin" });
>>>>>>> main

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
    // Added totalAmount, members to be able to edit it
    const { name, description, totalAmount, members } = req.body;
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
    // Added totalAmount and members
    if (totalAmount !== undefined) group.totalAmount = totalAmount;
    if (Array.isArray(members)) group.members = members;

    await group.save();
    res.json({ message: "Group updated successfully.", group });

  } catch (error) {
    console.error("Failed to update group:", err);
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

    const expenseExists = await Expense.exists({ group: groupId });
    if (expenseExists) {
     return res.status(400).json({ message: "Group cannot be deleted because it has expenses." });
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

    const owesExpenses = await Expense.exists({ group: groupId, "owedBy.userId": memberId });
    if (owesExpenses) {
    return res.status(400).json({ message: "Member cannot be removed because they still owe expenses." });
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


// Add an expense to a group
export const addGroupExpense = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { title, description, amount, category, transactionDate } = req.body;

    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    // Check if the user is part of the group
    const isMember = group.members.some(member => member.userId.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ success: false, message: "You're not a member of this group" });
    }

    // Create the expense
    const newExpense = new Expense({
      userId, // Who paid
      groupId,
      title,
      description,
      amount,
      category,
      transactionDate,
    });

    await newExpense.save();

    // Update group's expense list and totalAmount
    group.expenses.push(newExpense._id);
    group.totalAmount += amount;
    await group.save();

    res.status(201).json({ success: true, data: newExpense });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



/// delete an expense from a group only if the payments are completed
export const deleteGroupExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;
    const userId = req.user.id;

    // Fetch the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found." });
    }

    // Check if user is an admin
    const isAdmin = group.members.some(
      member => member.userId.toString() === userId && member.role === "admin"
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete group expenses.",
      });
    }

    // Find the expense
    const expense = await Expense.findOne({ _id: expenseId, groupId });
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found." });
    }

    // Check if all related payments are completed
    const relatedPayments = await Payment.find({ groupId, expenseId });
    const hasIncomplete = relatedPayments.some(p => p.status !== "completed");

    if (hasIncomplete) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete this expense. Some payments are still pending.",
      });
    }

    // Delete the expense
    await expense.deleteOne();

    // Update the group (remove expense ref & update total)
    group.expenses = group.expenses.filter(id => id.toString() !== expenseId);
    group.totalAmount -= expense.amount;
    await group.save();

    res.status(200).json({ success: true, message: "Expense deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


// Edit an expense in a group

export const editGroupExpense = async (req, res) => {
  try {
    const { groupId, expenseId } = req.params;
    const userId = req.user.id;

    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found." });
    }

    // Check if the user is an admin
    const isAdmin = group.members.some(
      member => member.userId.toString() === userId && member.role === "admin"
    );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only admins can edit group expenses.",
      });
    }

    // Find the expense
    const expense = await Expense.findOne({ _id: expenseId, groupId });
    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found." });
    }

    const originalAmount = expense.amount;

    // Update the expense
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      req.body,
      { new: true, runValidators: true }
    );

    // Update group's totalAmount if amount changed
    if (req.body.amount !== undefined && req.body.amount !== originalAmount) {
      const diff = req.body.amount - originalAmount;
      group.totalAmount += diff;
      await group.save();
    }

    res.status(200).json({ success: true, data: updatedExpense });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
