import AppRouter from "./routes/AppRouter";
import { setAxiosDefaults } from "./utils/axiosConfig";

const App = () => {
  setAxiosDefaults();
  return <AppRouter />;
};

export default App;
