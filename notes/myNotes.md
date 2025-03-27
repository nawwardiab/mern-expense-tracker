- refactor Axios usage
- add Get Me endpoint

<!-- ! 24.03.2025 -->

**Done**

- when I clear cookies manualy, the login doesn't create a new token (the cookies in Application is empty)
- refactored onBoarding
- loggin out is not clearing the cookies (logout button has no eventListener. It's just redirecting)

**To Do**

_LandingPage_

Discuss this:

- remove Navbar and add a scroll to top button.
- add a down-arrow to indicate the page has more.

_Add Expense_

- recurring expense

_Expenses Feature_

- we need Expense Context
- add useEffect with dependency to expense state, to render updated data without refreshing the page
- Expense tracker (it's showing undefined near the number)
- add currency enums in Backend

**expense States**

_from ExpenseManager.jsx:_

- expenses
- filteredExpenses
- totalFilteredExpenses
- search
- category
- occurence
- dateFrom
- dateTo

_from ExpenseList.jsx:_

- selectedExpense

_from ExpenseItem.jsx:_

- no state

_from modal ExpenseDetail.jsx:_

- editedExpense
- isEditing
- notificationsEnabled
- loading
- message

---

**25.03.2025**

_1. Refactoring:_

**high priority**

_Pages:_

- Onboarding: move api calls to userApi.js
- HomePage: move api calls to expenseApi calls, integrate ExpenseContext and expenseReducer.js (where needed)
- GroupExpenses: move api calls to groupApi.js, implement and integrate GroupContext
- ForgotPassword: move api calls to userApi.js

_Contexts:_

- PaymentContext: take actions out of the context for a clean context component
- Create GroupContext.

_Components:_

- PaymentList & PaymentForm: refactor and beware of the actions after taking them out of the context
- GroupList: refactor after creating GroupContext, move api calls to groupApi.js
- GroupDetail: refactor after creating GroupContext, move api calls to groupApi.js
- ExpenseTable(in the`GroupExpenses`): refactor and integrate needed Contexts (`ExpenseContext, PaymentContext, GroupContext`), move api calls to groupApi.js, compare integrated table with the ExpenseTable component.

_Modals:_

- AddExpense & ExpenseDetail: are still very big components. analyze refactoring possibilities
- AddGroupExpense & EditGroupModal: refactor after creating the Context, move api calls to groupApi.js, analyze refactoring possibility
- SplitExpenseModal: check necessity.

**medium & low priority**

- Forms
- rendered elements
