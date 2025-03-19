import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Expense from "../models/Expense";

let mongoServer;

// Connect to MongoDB memory server before running tests

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

// Disconnect and stop the memory server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database between tests to ensure isolated test conditions
afterEach(async () => {
  await Expense.deleteMany();
});

// Begin test suite for Expense Model
describe("Expense Model Tests", () => {
  // Test Case 1: Saving valid expense
  test("Should successfully save a valid expense", async () => {
    const validExpense = new Expense({
      userId: new mongoose.Types.ObjectId(),
      title: "Gym Membership",
      amount: 50,
      category: "Subscriptions",
      transactionDate: new Date(),
      isRecurring: true,
      recurringFrequency: "monthly",
      notes: "Monthly Gym Payment",
    });

    const savedExpense = await validExpense.save();

    // Assertions to confirm fields saved correctly
    expect(savedExpense._id).toBeDefined();
    expect(savedExpense.title).toBe("Gym Membership");
    expect(savedExpense.isRecurring).toBe(true);
    expect(savedExpense.recurringFrequency).toBe("monthly");
  });

  // Test Case 2: Validation errors for missing required fields
  test("Should fail validation if required fields are missing", async () => {
    const invalidExpense = new Expense({});

    await expect(invalidExpense.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  // Test Case 3: Category enum validation
  test("Should enforce enum values for category", async () => {
    const expenseWithInvalidCategory = new Expense({
      userId: new mongoose.Types.ObjectId(),
      title: "Unknown Category",
      amount: 20,
      category: "InvalidCategory",
      transactionDate: new Date(),
    });

    await expect(expenseWithInvalidCategory.save()).rejects.toThrow(
      mongoose.Error.ValidationError
    );
  });

  // Test Case 4: Default values testing
  test("Should set default values correctly", async () => {
    const expense = new Expense({
      userId: new mongoose.Types.ObjectId(),
      title: "Coffee",
      amount: 5,
      category: "Food&Drinks",
      transactionDate: new Date(),
    });

    const savedExpense = await expense.save();

    expect(savedExpense.isRecurring).toBe(false); // default value
    expect(savedExpense.notes).toBe(""); // default notes
    expect(savedExpense.attachments.length).toBe(0); // empty array by default
  });

  // Test Case 5: Updating an existing expense
  test("Should successfully update an existing expense", async () => {
    const expense = new Expense({
      userId: new mongoose.Types.ObjectId(),
      title: "Streaming Service",
      amount: 10,
      category: "Subscriptions",
      transactionDate: new Date(),
    });

    await expense.save();

    expense.amount = 12;
    const updatedExpense = await expense.save();

    expect(updatedExpense.amount).toBe(12);
  });

  // Test Case 6: Deleting an expense
  test("Should delete an expense successfully", async () => {
    const expense = new Expense({
      userId: new mongoose.Types.ObjectId(),
      title: "Dinner",
      amount: 40,
      category: "Food&Drinks",
      transactionDate: new Date(),
    });

    await expense.save();
    await Expense.findByIdAndDelete(expense._id);

    const deletedExpense = await Expense.findById(expense._id);

    expect(deletedExpense).toBeNull();
  });
});
