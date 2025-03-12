# Fullstack MERN Expense Tracker

This is the final full-stack group project

## 1. Project Workflow

- **User Authentication (Register/Login/Logout)**
- **Add Expenses with Category Selection**
- **View Expense Summary and Statistics**
- **Edit/Delete Expenses**
- **Filter Expenses by Date, Category, or Amount**
- **Generate Monthly Reports**

---

## 2. Define Core Features & User Stories

- As a guest user, I want to create an account to track my expenses.
- As a user, I want to log in and out securely.
- As a user, I want to be able to set up my account with a few steps.
- As a user, I want to add an expense with a category and amount.
- As a user, I want to add an expense with the possibility to split it with my friends.
- As a user, I want to edit or delete an existing expense.
- As a user, I want to filter expenses by category and occurrence.
- As a user, I want to see a monthly report of my expenses.

---

## 3. Wireframe Planning

Before coding, we designed a wireframe to visualize the application's layout and flow.

[Wireframe](https://app.uizard.io/prototypes/8XOjoGGVb4fqwP1wRdqz)

### Main Pages and UI Elements

- Landing Page with the possibility to either sign up and login
- Home (Dashboard with expense summary and statistics)
- Sign-up page
- Login page
- Onboarding page
- User profile page
- Group Expense page
- Expense Manager page (with filters and search)
- Specific expense overview
- Add Expenses Modal
- Split Expenses Modal

---

## 4. Database Schemas

### 1. User Schema (User.js):

```js
{
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  income: { type: String, default: 0 },
  paymentMethod: { type: String, default: "" },
  // paymentMethod: { type: String, required: true } -> optional
},
  {timestamp:true}


```

### 2. Expense Collection Schema:

```js
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null }, // Optional, only if shared
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true, enum: ["Fixed", "Group Expenses", "Food&Drinks", "Enternainment", “Subscriptions”, "Others"] },
  transactionDate: { type: Date, required: true },
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: { type: String, enum: ["daily", "weekly", "monthly", "one-time"], default: null }, // If recurring
  notes: { type: String, default: "" }, //Extra optional details about the expense.
  createdAt: { type: Date, default: Date.now },
  // nextRecurringDate: { type: Date, default: null}, //Optional
  // lastRecurringDate: { type: Date, default: null}, // Optional

  notes: { type: String, default: "" },

// Optional
 /** attachments: [
    {
      fileName: { type: String },
      url: { type: String },
      uploadedAt: { type: Date, default: Date.now }
    }
  ],
};
**/
  {timestamp:true}
}


```

### 3. Group Expense (groups) Schema:

```js
{
  name: { type: String, required: true },
  members: [{ type: String, required: true }],
  description: { type: String, default: "" },
  totalAmount: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  {timestamp:true}

}
```

### 3.1 Payment Sub-Collection Schema:

```js
{
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, default: "cash" },
  //transactionId: { type: String, default: "" }, // For external payment gateways
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 5. Backend API Design

### User Routes (`/users`)

| Method | Endpoint    | Description                    | Auth Required? |
| ------ | ----------- | ------------------------------ | -------------- |
| POST   | `/register` | Create a new user              | No             |
| POST   | `/login`    | Authenticate user & return JWT | No             |
| GET    | `/logout`   | Log out user                   | Yes            |
| GET    | `/profile`  | Get user profile details       | Yes            |
| PATCH  | `/profile`  | Update user profile            | Yes            |

### Expense Routes (`/expenses`)

| Method | Endpoint      | Description                    | Auth Required? |
| ------ | ------------- | ------------------------------ | -------------- |
| GET    | `/`           | Get all expenses for user      | Yes            |
| POST   | `/add`        | Add a new expense              | Yes            |
| PATCH  | `/:expenseId` | Edit an existing expense       | Yes            |
| DELETE | `/:expenseId` | Delete an expense              | Yes            |
| GET    | `/summary`    | Get expense summary/statistics | Yes            |
| GET    | `/recurring`  | Get all recurring expenses     | Yes            |
| GET    | `/:expenseId` | Get a specific expense by ID   | Yes            |

### Group Routes (`/groups`)

| Method | Endpoint             | Description                  | Auth Required? |
| ------ | -------------------- | ---------------------------- | -------------- |
| GET    | `/`                  | Get all groups for the user  | Yes            |
| POST   | `/create`            | Create a new group           | Yes            |
| PATCH  | `/:groupId`          | Edit an existing group       | Yes            |
| DELETE | `/:groupId`          | Delete a group (by Creator)  | Yes            |
| POST   | `/:groupId/add`      | Add a member to a group      | Yes            |
| DELETE | `/:groupId/remove`   | Remove a member from a group | Yes            |
| GET    | `/:groupId/expenses` | Get all expenses in a group  | Yes            |

### Payment Routes (`/payments`)

| Method | Endpoint      | Description               | Auth Required? |
| ------ | ------------- | ------------------------- | -------------- |
| GET    | `/`           | Get all payments          | Yes            |
| POST   | `/create`     | Create a new payment      | Yes            |
| PATCH  | `/:paymentId` | Update a payment status   | Yes            |
| GET    | `/:paymentId` | Get payment details by ID | Yes            |

---

## 6. Frontend Structure (React)

### Components

| Component         | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `Navbar.jsx`      | Displays navigation links, login/logout status (Global) |
| `Footer.jsx`      | Displays footer links and info (Global)                 |
| `ExpenseCard.jsx` | Displays an individual expense                          |
| `ExpenseList.jsx` | Lists all expenses                                      |
| `Filter.jsx`      | Filters expenses by category/date/amount                |
| `Summary.jsx`     | Displays expense summary and statistics                 |

### Pages

| Page                 | Purpose                                                  |
| -------------------- | -------------------------------------------------------- |
| `LandingPage.jsx`    | Overview of the services offered                         |
| `Home.jsx`           | Displays dashboard with expense summary                  |
| `LoginPage.jsx`      | User login form                                          |
| `SignupPage.jsx`     | User registration form                                   |
| `OnboardingPage.jsx` | User quick setup                                         |
| `Settings.jsx`       | User profile                                             |
| `ExpenseManager.jsx` | Allows users to search an expense by categories and occ. |
| `GroupExpense.jsx`   | Allows users to have an overview of the group expenses   |

### Modals

| Modal                    | Purpose                                                    |
| ------------------------ | ---------------------------------------------------------- |
| `AddExpenseModal.jsx`    | Allows users to add and view expenses                      |
| `SplitExpenseModal.jsx`  | Allows users to add and split the expenses                 |
| `DetailExpenseModal.jsx` | Allows users to view, modify and delete a specific expense |

### State Management

| Context Name                       | Description                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| **Users** (`userReducer.js`)       | Manages authentication, user profile, and login/logout state.                       |
| **Expenses** (`expenseReducer.js`) | Handles expense creation, updates, deletions, and filtering.                        |
| **Filters** (`filterReducer.js`)   | Manages state for expense category and occurrence filters.                          |
| **Groups** (`groupReducer.js`)     | Manages shared expense groups, members, and split tracking.                         |
| **Payments** (`paymentReducer.js`) | Tracks pending and completed payments within expense groups.                        |
| **Global Context** (`Context.jsx`) | Provides a centralized store to manage and distribute state across the application. |

---
