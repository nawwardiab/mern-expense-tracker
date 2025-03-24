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

**Expenses Reducers**

```js
export const initialExpenseState = {
  expenses: [], // Master list fetched from the server
  selectedExpense: null, // If you want a global “currently selected expense”
};

export default function expenseReducer(state, action) {
  switch (action.type) {
    case "SET_EXPENSES":
      // Replace the entire expenses array
      return {
        ...state,
        expenses: action.payload,
      };

    case "ADD_EXPENSE":
      // Insert a single new expense
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };

    case "UPDATE_EXPENSE":
      // Example structure: action.payload = { _id, ...updatedFields }
      return {
        ...state,
        expenses: state.expenses.map((exp) =>
          exp._id === action.payload._id ? action.payload : exp
        ),
      };

    case "DELETE_EXPENSE":
      // action.payload = ID of the expense to remove
      return {
        ...state,
        expenses: state.expenses.filter((exp) => exp._id !== action.payload),
      };

    case "SET_SELECTED_EXPENSE":
      return {
        ...state,
        selectedExpense: action.payload,
      };

    default:
      return state;
  }
}
```
