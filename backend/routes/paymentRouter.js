import express from "express";
import {
  createPayment,
  getAllPayments,
  updatePaymentStatus,
  getPaymentById,
  getAllReceivedPayments,
} from "../controllers/paymentController.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.use(checkToken);

// Create Payment
router
  // Get All Payments (with optional filters)
  .get("/", getAllPayments)
  .post("/create", createPayment)
  // Get payments received by a user
  .get("/received", getAllReceivedPayments)
  // Get a Specific Payment by ID
  .get("/:paymentId", getPaymentById)
  // Update Payment Status
  .patch("/:paymentId", updatePaymentStatus);

export default router;
