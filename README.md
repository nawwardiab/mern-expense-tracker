# Fullstack MERN Expense Tracker

A comprehensive expense management application built with the MERN stack (MongoDB, Express, React, Node.js).

---

## 1. Getting Started

### Prerequisites

- Node.js and npm
- MongoDB

### Installation

1. **Clone the repository**
2. **Create a `.env` file** at the project root based on `.env.example` and fill in your environment variables.
3. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the backend server:**

   ```bash
   cd ../backend
   npm start
   ```

6. **Start the frontend development server:**

   ```bash
   cd ../frontend
   npm run dev
   ```

---

## 2. Project Features

- **User Authentication (Register / Login / Logout)**
- **User Profile Management with Profile Picture Upload**
- **Customizable User Notifications**
- **Onboarding Experience for New Users**
- **Personal Expense Management**

  - Add, Edit, Delete Expenses
  - Filter Expenses by Date, Category, or Search Term
  - Recurring Expense Support
  - Expense Attachments

- **Group Expense Management**

  - Create and Manage Groups
  - Add Members to Groups via Invite System
  - Add Group Expenses with Automatic Split
  - Track Settlement Status

- **Financial Overview**

  - Visual Expense Breakdown (Charts)
  - Expense Summary and Statistics
  - Monthly Reports

---

## 3. Core Features & User Stories

- As a guest user, I want to create an account to track my expenses.
- As a user, I want to log in and out securely.
- As a user, I want to be able to set up my account with an onboarding process.
- As a user, I want to add expenses with a category and amount.
- As a user, I want to manage recurring expenses.
- As a user, I want to add an expense with the possibility to split it with group members.
- As a user, I want to edit or delete an existing expense.
- As a user, I want to filter expenses by category, occurrence, and search terms.
- As a user, I want to see a visual breakdown of my expenses.
- As a user, I want to create and manage expense groups with my friends.
- As a user, I want to manage settlements within my expense groups.

---

## 4. Database Schemas

### User Schema

```js
{
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: { type: Date, default: "" },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  location: { type: String, default: "" },
  currency: { type: String, default: 0 },
  income: { type: Number, default: "" },
  paymentMethod: { type: String, default: "" },
  username: { type: String, sparse: true },
  isOnboarded: { type: Boolean, default: false },
  notificationSettings: {
    expenseAlerts: { type: Boolean, default: false },
    communityUpdates: { type: Boolean, default: false },
    paymentReminders: { type: Boolean, default: false },
    featureAnnouncements: { type: Boolean, default: false },
  },
}
```

### Expense Schema

```js
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", default: null },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  amount: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "Fixed",
      "Group Expenses",
      "Food&Drinks",
      "Entertainment",
      "Subscriptions",
      "Others",
    ],
  },
  transactionDate: { type: Date, required: function () { return !this.isRecurring; } },
  startDate: { type: Date, required: function () { return this.isRecurring; } },
  endDate: { type: Date, required: function () { return this.isRecurring; } },
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: {
    type: String,
    enum: ["weekly", "monthly", "yearly", "one-time"],
    required: function () { return this.isRecurring; },
  },
  notes: { type: String, default: "" },
  attachments: [
    {
      fileName: { type: String },
      url: { type: String },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
}
```

### Group Schema

```js
{
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  members: [
    {
      groupMember: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  ],
  totalAmount: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Expense" }],
  isDeleted: { type: Boolean, default: false },
}
```

### Payment Schema

```js
{
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true, min: 0.01 },
  expenseId: { type: mongoose.Schema.Types.ObjectId, ref: "Expense", required: false },
  paymentMethod: {
    type: String,
    enum: ["cash", "bank_transfer", "stripe", "paypal"],
    default: "cash",
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  notes: { type: String, default: "" },
}
```

### Invite Schema

```js
{
  email: { type: String, required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}
```

### **Group Balance Schema**

```js
{
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  totalContributed: { type: Number, default: 0 },
  totalOwed: { type: Number, default: 0 },
  netBalance: { type: Number, default: 0 }, // totalContributed - totalOwed
}
```

_Compound index:_ `{ groupId: 1, userId: 1 }` (unique) for fast look‑ups.

---

## 5. Backend API Structure

### User Routes (`/users`)

| Method | Endpoint                | Description                    | Auth Required? |
| ------ | ----------------------- | ------------------------------ | -------------- |
| GET    | `/`                     | Get all users                  | No             |
| POST   | `/register`             | Create a new user              | No             |
| POST   | `/login`                | Authenticate user & return JWT | No             |
| GET    | `/logout`               | Log out user                   | No             |
| GET    | `/me`                   | Get current user profile       | Yes            |
| PATCH  | `/profile`              | Update user profile            | Yes            |
| PATCH  | `/onboarding`           | Complete onboarding            | Yes            |
| PATCH  | `/update-profile`       | Update profile with picture    | Yes            |
| PATCH  | `/update-password`      | Change password                | Yes            |
| PATCH  | `/update-notifications` | Update notification settings   | Yes            |

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

| Method | Endpoint             | Description          | Auth Required? |
| ------ | -------------------- | -------------------- | -------------- |
| GET    | `/`                  | Get all user groups  | Yes            |
| GET    | `/:groupId`          | Get specific group   | Yes            |
| POST   | `/create`            | Create a new group   | Yes            |
| PATCH  | `/:groupId`          | Update group details | Yes            |
| DELETE | `/:groupId`          | Delete a group       | Yes            |
| GET    | `/:groupId/expenses` | Get group expenses   | Yes            |
| POST   | `/:groupId/expense`  | Add expense to group | Yes            |

### Payment Routes (`/payments`)

| Method | Endpoint          | Description           | Auth Required? |
| ------ | ----------------- | --------------------- | -------------- |
| GET    | `/`               | Get all user payments | Yes            |
| GET    | `/group/:groupId` | Get payments by group | Yes            |
| POST   | `/create`         | Create a new payment  | Yes            |
| PATCH  | `/:paymentId`     | Update payment status | Yes            |
| GET    | `/:paymentId`     | Get payment details   | Yes            |

### Invite Routes (`/invites`)

| Method | Endpoint     | Description          | Auth Required? |
| ------ | ------------ | -------------------- | -------------- |
| POST   | `/`          | Create a new invite  | Yes            |
| GET    | `/`          | Get user's invites   | Yes            |
| PATCH  | `/:inviteId` | Accept/reject invite | Yes            |

### **Group Balance Routes (`/balances`)**

| Method | Endpoint            | Description                                  | Auth Required? |
| ------ | ------------------- | -------------------------------------------- | -------------- |
| GET    | `/:groupId`         | Get balances for all members of a group      | Yes            |
| GET    | `/:groupId/:userId` | Get balance for a specific user in the group | Yes            |

---

## 6. Frontend Structure

### Pages

| Page                 | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `LandingPage.jsx`    | Welcome page with app description and auth options |
| `LoginPage.jsx`      | User login form                                    |
| `SignupPage.jsx`     | User registration form                             |
| `OnboardingPage.jsx` | Step-by-step user setup wizard                     |
| `ForgotPassword.jsx` | Password recovery flow                             |
| `HomePage.jsx`       | Main dashboard with expense overview & charts      |
| `ExpenseManager.jsx` | Detailed expense filtering and management          |
| `GroupExpenses.jsx`  | Group expense management interface                 |
| `SettingPage.jsx`    | User settings and profile management               |
| `PageNotFound.jsx`   | 404 error page                                     |

### Key Components

| Component                 | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `ExpenseList.jsx`         | Lists user expenses with filtering           |
| `ExpenseTable.jsx`        | Tabular view of expenses                     |
| `FilteredTransactionList` | Advanced filtering of transactions           |
| `GroupList.jsx`           | Lists user's groups                          |
| `GroupDetail.jsx`         | Shows details for a specific group           |
| `GroupExpenseAccordion`   | Expandable interface for group expenses      |
| `GroupMembersTable`       | Lists and manages group members              |
| `SummaryCards.jsx`        | Visual overview of expense metrics           |
| `Chart.jsx`               | Graphical representations of expense data    |
| `PaymentList.jsx`         | Lists and manages pending/completed payments |

### Modal Components

| Modal                  | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `AddExpense.jsx`       | Create or edit personal expenses                 |
| `ExpenseDetail.jsx`    | View expense details with options to edit/delete |
| `AddGroupModal.jsx`    | Create a new expense group                       |
| `EditGroupModal.jsx`   | Modify group details                             |
| `AddGroupExpenseModal` | Add expense to a group with automatic splitting  |
| `SettleUpModal.jsx`    | Create settlement payments between group members |
| `PaymentDetail.jsx`    | View payment details                             |
| `InviteModal.jsx`      | Send invites to join a group                     |

### State Management

The application uses React's Context API for state management:

| Context          | Purpose                                 |
| ---------------- | --------------------------------------- |
| `AuthContext`    | Handles user authentication and profile |
| `ExpenseContext` | Manages personal expense operations     |
| `GroupContext`   | Manages group data and operations       |
| `PaymentContext` | Tracks payments and settlements         |
| `BalanceContext` | Manages group balances                  |
| `InviteContext`  | Manages group invitations               |

---

## 7. Technologies Used

### Frontend

- React (with Context API for state management)
- React Router for navigation
- Tailwind CSS for styling
- Chart.js for data visualization

### Backend

- Node.js with Express
- MongoDB with Mongoose for data modeling
- JWT for authentication
- Multer for file uploads

---

## 8. Contributors

- [github.com/HMusenja](https://github.com/HMusenja)
- [github.com/nawwardiab](https://github.com/nawwardiab)
- [github.com/Manudd25](https://github.com/Manudd25)
- [github.com/irinaholler](https://github.com/irinaholler)
