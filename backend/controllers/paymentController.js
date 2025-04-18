import Payment from "../models/Payment.js";
//import Group from "../models/Group.js";
import User from "../models/User.js";
import GroupBalance from "../models/GroupBalance.js";

// 📌 Create a new Payment
export const createPayment = async (req, res) => {
  try {
    console.log("Received payment data:", req.body);

    const {
      groupId,
      payer,
      payee,
      amount,
      paymentMethod,
      expenseId,
      transactionId,
      currency,
      notes,
    } = req.body;

    // Validate required fields
    if (!groupId || !payer || !payee || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    /* Check if group exists
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }*/

    // Check if payer & payee exist
    const payerUser = await User.findById(payer);
    const payeeUser = await User.findById(payee);
    if (!payerUser || !payeeUser) {
      return res.status(404).json({ message: "Payer or Payee not found" });
    }

    // Create new payment
    const newPayment = new Payment({
      groupId,
      payer,
      payee,
      amount,
      // Include expenseId only if it's provided
      ...(expenseId && { expenseId }),
      paymentMethod,
      transactionId: transactionId || "",
      currency: currency || "EUR",
      notes,
      status: "completed", // Auto-complete the payment
    });

    await newPayment.save();

    // Get current balance records or create them if they don't exist
    let payerBalance = await GroupBalance.findOne({ groupId, userId: payer });
    let payeeBalance = await GroupBalance.findOne({ groupId, userId: payee });

    if (!payerBalance) {
      payerBalance = new GroupBalance({
        groupId,
        userId: payer,
        totalContributed: 0,
        totalOwed: 0,
        netBalance: 0,
      });
    }

    if (!payeeBalance) {
      payeeBalance = new GroupBalance({
        groupId,
        userId: payee,
        totalContributed: 0,
        totalOwed: 0,
        netBalance: 0,
      });
    }

    // Update the payer's balance (increase their contribution and net balance)
    payerBalance.totalContributed += amount;
    payerBalance.netBalance += amount;
    await payerBalance.save();

    // Update the payee's balance (only decrease their net balance)
    // This avoids double-counting when calculating contributions
    payeeBalance.netBalance -= amount;
    await payeeBalance.save();

    console.log("Updated balances:", {
      payer: payerBalance,
      payee: payeeBalance,
    });

    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

// 📌 Get All Payments (Optional: Filter by group/user)
export const getAllPayments = async (req, res) => {
  try {
    const { groupId, userId } = req.query;
    let filter = {};

    //if (groupId) filter.groupId = groupId;
    if (userId) filter.payer = userId; // Get payments made by a specific user
    if (groupId) filter.groupId = groupId;

    const payments = await Payment.find(filter).populate("payer payee groupId");
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📌 Get Payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId).populate(
      "payer payee groupId"
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📌 Update Payment Status (e.g., "pending" → "completed")
export const updatePaymentStatus = async (req, res) => {
  try {
    const { status, transactionId } = req.body;
    const { paymentId } = req.params;

    // Validate status
    if (!["pending", "completed", "failed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find and update payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Store the old status for comparison
    const oldStatus = payment.status;
    payment.status = status;
    if (transactionId) payment.transactionId = transactionId; // Optional update

    await payment.save();

    // If the payment just got completed, update the balances
    if (status === "completed" && oldStatus !== "completed") {
      // Get current balance records or create them if they don't exist
      let payerBalance = await GroupBalance.findOne({
        groupId: payment.groupId,
        userId: payment.payer,
      });

      let payeeBalance = await GroupBalance.findOne({
        groupId: payment.groupId,
        userId: payment.payee,
      });

      if (!payerBalance) {
        payerBalance = new GroupBalance({
          groupId: payment.groupId,
          userId: payment.payer,
          totalContributed: 0,
          totalOwed: 0,
          netBalance: 0,
        });
      }

      if (!payeeBalance) {
        payeeBalance = new GroupBalance({
          groupId: payment.groupId,
          userId: payment.payee,
          totalContributed: 0,
          totalOwed: 0,
          netBalance: 0,
        });
      }

      // Update the payer's balance (increase their contribution and net balance)
      payerBalance.totalContributed += payment.amount;
      payerBalance.netBalance += payment.amount;
      await payerBalance.save();

      // Update the payee's balance (only decrease their net balance)
      // This avoids double-counting when calculating contributions
      payeeBalance.netBalance -= payment.amount;
      await payeeBalance.save();

      console.log("Updated balances after payment status change:", {
        payment: payment._id,
        payer: payerBalance,
        payee: payeeBalance,
      });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
