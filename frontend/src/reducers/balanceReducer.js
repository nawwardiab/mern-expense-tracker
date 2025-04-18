export const initialBalanceState = {
  balances: [],
  userBalance: null,
  loading: false,
  error: null,
};

export default function balanceReducer(state, action) {
  switch (action.type) {
    case "BALANCE_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };

    case "BALANCE_SUCCESS":
      return {
        ...state,
        loading: false,
        balances: action.payload.balances,
        error: null,
      };

    case "USER_BALANCE_SUCCESS":
      return {
        ...state,
        loading: false,
        userBalance: action.payload.balance,
        error: null,
      };

    case "BALANCE_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "UPDATE_BALANCE_AFTER_PAYMENT":
      // This updates both the payer and payee's balance after a payment is made
      const { payerId, payeeId, amount } = action.payload;

      return {
        ...state,
        balances: state.balances.map((balance) => {
          // Update payer's balance (increase their contribution and net balance)
          if (balance.userId === payerId) {
            return {
              ...balance,
              totalContributed: balance.totalContributed + amount,
              netBalance: balance.netBalance + amount,
            };
          }
          // Update payee's balance (decrease what they're owed)
          // This doesn't affect their contribution, only their net balance
          if (balance.userId === payeeId) {
            return {
              ...balance,
              netBalance: balance.netBalance - amount,
            };
          }
          return balance;
        }),
      };

    case "CLEAR_BALANCES":
      return {
        ...state,
        balances: [],
        userBalance: null,
      };

    default:
      return state;
  }
}
