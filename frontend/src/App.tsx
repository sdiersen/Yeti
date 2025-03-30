import { FC } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppRoutes from "./AppRoutes";

const App: FC = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
};

export default App;
