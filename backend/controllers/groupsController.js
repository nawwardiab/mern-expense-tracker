import Group from "../models/Group.js";
import Expense from "../models/Expense.js";


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
    const { name, description, members } = req.body;
    const userId = req.user.id;

    if (!name || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ message: "Group name and members are required." });
    }

    const existingGroup = await Group.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Group name already exists." });
    }

    const formattedMembers = [];

    const uniqueMemberIds = [...new Set(members.map(String))]; // remove duplicates if any

    uniqueMemberIds.forEach(memberId => {
      if (memberId === userId) {
        // If creator is in the list, make them admin
        formattedMembers.push({ userId: memberId, role: "admin" });
      } else {
        formattedMembers.push({ userId: memberId, role: "member" });
      }
    });

    // If creator is not in the members list, add them as admin
    if (!uniqueMemberIds.includes(userId)) {
      formattedMembers.push({ userId, role: "admin" });
    }

    const group = new Group({
      name,
      description,
      members: formattedMembers,
      totalAmount: 0,
      createdBy: userId,
    });

    await group.save();
    res.status(201).json({ message: "Group created successfully.", group });

  } catch (error) {
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

    const expense = await Expense.findOne({
      _id: expenseId,
      groupId,
      userId,
    });

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found or access denied." });
    }

    // Check if all payments are completed
    const hasIncompletePayments = expense.payments?.some(p => p.status !== "completed");

    if (hasIncompletePayments) {
      return res.status(400).json({
        success: false,
        message: "This expense cannot be deleted until all payments are marked as completed.",
      });
    }

    // Proceed with deletion
    await expense.deleteOne();

    // Remove from group and update total
    const group = await Group.findById(groupId);
    if (group) {
      group.expenses = group.expenses.filter(id => id.toString() !== expenseId);
      group.totalAmount -= expense.amount;
      await group.save();
    }

    res.status(200).json({ success: true, message: "Expense deleted." });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
