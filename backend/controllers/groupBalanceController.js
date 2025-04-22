// groupBalanceController.js

import GroupBalance from "../models/GroupBalance.js";
import Group from "../models/Group.js";
import Expense from "../models/Expense.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

// Get all balances for a group
export const getGroupBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Get the group with members populated
    const group = await Group.findById(groupId).populate("members.groupMember");
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Calculate share per member (equal split)
    const memberCount = group.members.length;
    const totalGroupAmount = group.totalAmount || 0;
    const sharePerMember = totalGroupAmount / memberCount;

    // Get all expenses for this group
    const expenses = await Expense.find({ groupId }).populate("userId");

    // Get all payments for this group
    const payments = await Payment.find({
      groupId,
      status: "completed",
    }).populate("payer payee");

    // Calculate each member's balance
    const balances = [];
    const userMap = {};

    // First, create a map of all users and initialize their balances
    for (const member of group.members) {
      const userId = member.groupMember._id.toString();
      const name = member.groupMember.fullName;

      userMap[userId] = {
        userId,
        memberName: name,
        totalContributed: 0, // from expenses
        paymentsMade: 0, // money they've paid to others
        paymentsReceived: 0, // money they've received from others
        totalOwed: sharePerMember, // their equal share
        // netBalance will be calculated after all transactions
      };
    }

    // Calculate expense contributions
    for (const expense of expenses) {
      if (expense.userId && expense.userId._id) {
        const userId = expense.userId._id.toString();
        if (userMap[userId]) {
          userMap[userId].totalContributed += expense.amount;
        }
      }
    }

    // Calculate payment effects
    for (const payment of payments) {
      const payerId = payment.payer._id.toString();
      const payeeId = payment.payee._id.toString();

      // When a member pays, it counts as a contribution to the group
      if (userMap[payerId]) {
        userMap[payerId].paymentsMade += payment.amount;
      }

      // When a member receives money, it reduces what others owe them
      if (userMap[payeeId]) {
        userMap[payeeId].paymentsReceived += payment.amount;
      }
    }

    // Calculate final net balances
    for (const userId in userMap) {
      const user = userMap[userId];

      // Total effective contribution = expenses paid + payments made
      const totalEffectiveContribution =
        user.totalContributed + user.paymentsMade;

      // Net balance = total effective contribution - equal share
      // Positive means they're owed money, negative means they owe money
      user.netBalance = totalEffectiveContribution - user.totalOwed;

      // Adjust for payments received
      // If they've received payments, that reduces what they're owed
      user.netBalance -= user.paymentsReceived;

      // Update or create the balance record in the database
      await GroupBalance.findOneAndUpdate(
        { groupId, userId },
        {
          totalContributed: totalEffectiveContribution,
          totalOwed: user.totalOwed,
          netBalance: user.netBalance,
        },
        { upsert: true, new: true }
      );

      // Add to the response array
      balances.push({
        userId,
        memberName: user.memberName,
        totalContributed: totalEffectiveContribution,
        totalOwed: user.totalOwed,
        netBalance: user.netBalance,
        paymentsMade: user.paymentsMade,
        paymentsReceived: user.paymentsReceived,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        balances,
        equalShare: sharePerMember,
        totalAmount: totalGroupAmount,
      },
    });
  } catch (error) {
    console.error("Error calculating group balances:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get balance for a specific user in a group
export const getUserGroupBalance = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    // Get the group to calculate each person's share
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Calculate the equal share per member
    const memberCount = group.members.length;
    const sharePerMember = group.totalAmount / memberCount;

    // Get the user's expenses in this group
    const expenses = await Expense.find({
      groupId,
      userId,
    });

    // Get all payments made by this user in this group
    const paymentsMade = await Payment.find({
      groupId,
      payer: userId,
      status: "completed",
    });

    // Get all payments received by this user in this group
    const paymentsReceived = await Payment.find({
      groupId,
      payee: userId,
      status: "completed",
    });

    // Calculate expense contributions
    const expenseContributions = expenses.reduce(
      (sum, exp) => sum + exp.amount,
      0
    );

    // Calculate payments made to others
    const paymentContributions = paymentsMade.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    // Calculate payments received from others
    const paymentsReceivedTotal = paymentsReceived.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    // Total effective contribution = expenses paid + payments made
    const totalEffectiveContribution =
      expenseContributions + paymentContributions;

    // Net balance calculation
    // Start with contribution minus share
    let netBalance = totalEffectiveContribution - sharePerMember;

    // Adjust for payments received
    netBalance -= paymentsReceivedTotal;

    // Update or create the balance record
    const balance = await GroupBalance.findOneAndUpdate(
      { groupId, userId },
      {
        totalContributed: totalEffectiveContribution,
        totalOwed: sharePerMember,
        netBalance,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      data: {
        balance,
        equalShare: sharePerMember,
        paymentsMade,
        paymentsReceived,
        expenseTotal: expenseContributions,
      },
    });
  } catch (error) {
    console.error("Error fetching user balance:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
