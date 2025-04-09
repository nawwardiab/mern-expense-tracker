export const initialGroupState = {
  groups: [],
  selectedGroup: null,
  error: null,
};

export default function groupReducer(state, action) {
  switch (action.type) {
    // Fetch user groups

    case "FETCH_GROUPS":
      // Sort by createdAt descending
      const sortedGroups = action.payload
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return { ...state, groups: sortedGroups };
    case "FETCH_GROUPS_ERROR":
      return { ...state, error: action.payload };

    // Set selected group
    case "SET_SELECTED_GROUP":
      return { ...state, selectedGroup: action.payload };

    // Create a new group
    case "ADD_GROUP":
      return { ...state, groups: [action.payload, ...state.groups] };

    // Update group details
    case "UPDATE_GROUP":
      return {
        ...state,
        groups: state.groups.map((group) =>
          group._id === action.payload._id ? action.payload : group
        ),
        selectedGroup:
          state.selectedGroup && state.selectedGroup._id === action.payload._id
            ? action.payload
            : state.selectedGroup,
      };

    // Delete a group
    case "DELETE_GROUP":
      return {
        ...state,
        groups: state.groups.filter((group) => group._id !== action.payload),
        selectedGroup:
          state.selectedGroup && state.selectedGroup._id === action.payload
            ? null
            : state.selectedGroup,
      };

    // Add or remove a member (assumes payload has updated members array)
    case "ADD_MEMBER":
    case "REMOVE_MEMBER":
      return {
        ...state,
        groups: state.groups.map((group) =>
          group._id === action.payload.groupId
            ? { ...group, members: action.payload.members }
            : group
        ),
        selectedGroup:
          state.selectedGroup &&
          state.selectedGroup._id === action.payload.groupId
            ? { ...state.selectedGroup, members: action.payload.members }
            : state.selectedGroup,
      };

    // Set group expenses (for a selected group)
    case "GET_GROUP_EXPENSES":
      return {
        ...state,
        selectedGroup: state.selectedGroup
          ? {
              ...state.selectedGroup,
              expenses: action.payload,
            }
          : state.selectedGroup,
      };

    // Add expense to the expense state(for Dashboard rendering)
    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };

    // Add a group expense
    case "ADD_GROUP_EXPENSE":
      return {
        ...state,
        selectedGroup: state.selectedGroup
          ? {
              ...state.selectedGroup,
              expenses: [
                ...(state.selectedGroup.expenses || []),
                action.payload,
              ],
              totalAmount:
                state.selectedGroup.totalAmount + action.payload.amount,
            }
          : state.selectedGroup,
      };

    // Edit a group expense; payload includes updated expense and original amount
    case "EDIT_GROUP_EXPENSE":
      return {
        ...state,
        selectedGroup: state.selectedGroup
          ? {
              ...state.selectedGroup,
              expenses: state.selectedGroup.expenses.map((expense) =>
                expense._id === action.payload.updatedExpense._id
                  ? action.payload.updatedExpense
                  : expense
              ),
              totalAmount:
                state.selectedGroup.totalAmount -
                action.payload.originalAmount +
                action.payload.updatedExpense.amount,
            }
          : state.selectedGroup,
      };

    // Delete a group expense; payload includes expenseId and amount
    case "DELETE_GROUP_EXPENSE":
      return {
        ...state,
        selectedGroup: state.selectedGroup
          ? {
              ...state.selectedGroup,
              expenses: state.selectedGroup.expenses.filter(
                (expense) => expense._id !== action.payload.expenseId
              ),
              totalAmount:
                state.selectedGroup.totalAmount - action.payload.amount,
            }
          : state.selectedGroup,
      };

    default:
      return state;
  }
}
