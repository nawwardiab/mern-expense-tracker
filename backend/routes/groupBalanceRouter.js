import express from "express";
import {
  getUserGroupBalance,
  getGroupBalances,
} from "../controllers/groupBalanceController.js";
import checkToken from "../middleware/checkToken.js";

const router = express.Router();
router.use(checkToken);

router.get("/:groupId", getGroupBalances);
router.get("/:groupId/:userId", getUserGroupBalance);

export default router;
