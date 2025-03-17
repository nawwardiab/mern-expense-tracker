import express from "express";
import {
  getAllExpenses,
  addNewExpense,
  editExistingExpense,
  deleteExpense,
  getExpenseSummary,
  getAllRecurringExpenses,
  getSpecificExpenseById,
} from "../controllers/expensesController.js";

import checkToken from "../middleware/checkToken.js";

const router = express.Router();

router.use(checkToken); // ✅ Applies authentication middleware to all routes below

router
  .get("/", getAllExpenses)
  .post("/add", addNewExpense)
  .patch("/:expenseId", editExistingExpense)
  .delete("/:expenseId", deleteExpense)
  .get("/summary", getExpenseSummary)
  .get("/recurring", getAllRecurringExpenses)
  .get("/:expenseId", getSpecificExpenseById);

export default router;
