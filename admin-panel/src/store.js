import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/index";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

const CreateStore = () => {
  const initialState = {};

  const middleware = [thunk];

  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)),
    +window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  // Persist on hot reaload
  // if (module.hot) {
  //   module.hot.accept("./reducers/index", () => {
  //     const nextReducer = require("./reducers/index").default;

  //     store.replaceReducer(nextReducer);
  //   });
  // }

  return store;
};

export default CreateStore();
