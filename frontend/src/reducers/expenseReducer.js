export const initialExpenseState = {
  expenses: [], // Master list fetched from the server
  selectedExpense: null, // If you want a global “currently selected expense”
  totalFilteredExpenses: 0,
  isModalOpen: false,
};

export default function expenseReducer(state, action) {
  switch (action.type) {
    case "GET_EXPENSES":
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
        isModalOpen: true, 
      };
    case "SET_TOTAL_FILTERED_EXPENSES":
      return {
        ...state,
        totalFilteredExpenses: action.payload,
      };
      case "OPEN_MODAL":
        return { ...state, isModalOpen: true };
      case "CLOSE_MODAL":
        return {
          ...state,
          isModalOpen: false,
          selectedExpense: null,
        };
  
    default:
      return state;
  }
}
