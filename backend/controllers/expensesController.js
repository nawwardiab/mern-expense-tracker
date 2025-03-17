import Expense from "../models/Expense.js";

// GET /expenses - Get all expenses for the logged-in user
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    res.status(200).json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /expenses/add - Add a new expense
export const addNewExpense = async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// PATCH /expenses/:expenseId - Edit an existing expense
export const editExistingExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.expenseId, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense not found" });
    }

    res.status(200).json({ success: true, data: updatedExpense });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE /expenses/:expenseId - Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.expenseId,
      userId: req.user.id,
    });

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense not found" });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /expenses/summary - Get expense summary/statistics
export const getExpenseSummary = async (req, res) => {
  try {
    const totalExpenses = await Expense.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({ success: true, data: totalExpenses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /expenses/recurring - Get all recurring expenses
export const getAllRecurringExpenses = async (req, res) => {
  try {
    const recurringExpenses = await Expense.find({
      userId: req.user.id,
      isRecurring: true,
    });

    res.status(200).json({ success: true, data: recurringExpenses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET /expenses/:expenseId - Get a specific expense by ID
export const getSpecificExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.expenseId,
      userId: req.user.id,
    });

    if (!expense) {
      return res
        .status(404)
        .json({ success: false, error: "Expense not found" });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
