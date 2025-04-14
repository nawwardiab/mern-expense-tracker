import express from "express";
import { 
    createPayment, 
    getAllPayments, 
    updatePaymentStatus, 
    getPaymentById 
} from "../controllers/paymentController.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

// Create Payment
router.post("/create", checkToken, createPayment);

// Get All Payments (with optional filters)
router.get("/", checkToken, getAllPayments);

// Get a Specific Payment by ID
router.get("/:paymentId", checkToken, getPaymentById);

// Update Payment Status
router.patch("/:paymentId", checkToken, updatePaymentStatus);

export default router;
