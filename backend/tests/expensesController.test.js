import { jest } from "@jest/globals";

import mongoose from "mongoose";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import express from "express";
import cookieParser from "cookie-parser";
import Expense from "../models/Expense.js";
import {
  getAllExpenses,
  addNewExpense,
  editExistingExpense,
  deleteExpense,
} from "../controllers/expensesController.js";

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use(cookieParser());

// Define the mock user globally to reuse across tests
const userId = new mongoose.Types.ObjectId();

// ✅ Mock the checkToken middleware explicitly to bypass real auth
const mockCheckToken = (req, res, next) => {
  req.user = { id: userId }; // Explicitly set a mock authenticated user
  next();
};

// Attach routes manually with mocked middleware directly in test
app.get("/expenses", mockCheckToken, getAllExpenses);
app.post("/expenses/add", mockCheckToken, addNewExpense);
app.patch("/expenses/:expenseId", mockCheckToken, editExistingExpense);
app.delete("/expenses/:expenseId", mockCheckToken, deleteExpense);

let mongoServer;

// Setup MongoDB memory server before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests
afterEach(async () => {
  await Expense.deleteMany();
});

// Begin testing
describe("Expense Controller API tests", () => {
  test("GET /expenses - should return empty array initially", async () => {
    const res = await request(app).get("/expenses");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  test("POST /expenses/add - should create new expense", async () => {
    const expenseData = {
      title: "Groceries",
      amount: 100,
      category: "Food&Drinks",
      transactionDate: "2025-03-19",
    };

    const res = await request(app).post("/expenses/add").send(expenseData);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Groceries");
    expect(res.body.data.amount).toBe(100);
  });

  test("PATCH /expenses/:expenseId - should update an expense", async () => {
    const expense = await Expense.create({
      userId,
      title: "Subscription",
      amount: 20,
      category: "Subscriptions",
      transactionDate: new Date(),
    });

    const res = await request(app)
      .patch(`/expenses/${expense._id}`)
      .send({ amount: 25 });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.amount).toBe(25);
  });

  test("DELETE /expenses/:expenseId - should delete an expense", async () => {
    const expense = await Expense.create({
      userId,
      title: "Coffee",
      amount: 5,
      category: "Food&Drinks",
      transactionDate: new Date(),
    });

    const res = await request(app).delete(`/expenses/${expense._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const deletedExpense = await Expense.findById(expense._id);
    expect(deletedExpense).toBeNull();
  });
});
