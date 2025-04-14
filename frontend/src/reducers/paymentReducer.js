export const initialPaymentState = {
  payments: [],
  loading: false,
  error: null,
};

export default function paymentReducer(state, action) {
  switch (action.type) {
    case "PAYMENTS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "PAYMENTS_SUCCESS":
      return {
        ...state,
        loading: false,
        payments: action.payload, // full array of payments
      };
      case "SET_PAYMENT_SUMMARY":
        return {
          ...state,
          paymentSummary: action.payload,
        };
    case "CREATE_PAYMENT_SUCCESS":
      return {
        ...state,
        loading: false,
        payments: [...state.payments, action.payload],
      };
    case "UPDATE_PAYMENT_SUCCESS": {
      const updated = action.payload;
      const updatedList = state.payments.map((p) =>
        p._id === updated._id ? updated : p
      );
      return {
        ...state,
        loading: false,
        payments: updatedList,
      };
    }
    case "PAYMENTS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
