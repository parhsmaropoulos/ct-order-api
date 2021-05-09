import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={store.persistor}> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </PersistGate> */}
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
