import { createContext, useReducer, useContext } from "react";
import userReducer, { initialUserState } from "../reducers/userReducer";


const GlobalContext = createContext();

const initialState = {
  userState: initialUserState,
  expenses: [],
  filters: {},
};

export const GlobalProvider = ({ children }) => {
  const [userState, userDispatch] = useReducer(userReducer, initialState.userState);
 

  return (
    <GlobalContext.Provider value={{ userState, userDispatch}}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
