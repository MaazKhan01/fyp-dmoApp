import React from "react";
import { Provider } from "react-redux";
import { store } from "./src/redux/store/store";
import Navigation from "./src/navigations/navigation";

const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;