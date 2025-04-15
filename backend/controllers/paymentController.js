import Payment from "../models/Payment.js";
//import Group from "../models/Group.js";
import User from "../models/User.js";

// 📌 Create a new Payment
export const createPayment = async (req, res) => {
  try {
    const {
      groupId,
      payer,
      payee,
      amount,
      paymentMethod,
      transactionId,
      currency,
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
      paymentMethod,
      transactionId: transactionId || "",
      currency: currency || "EUR",
    });

    await newPayment.save();
    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

    payment.status = status;
    if (transactionId) payment.transactionId = transactionId; // Optional update

    await payment.save();
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
