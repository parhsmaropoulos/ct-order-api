import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers/index";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
// import { persistStore, persistReducer } from "redux-persist";
// import storage from "redux-persist/lib/storage";
// import storageSession from "redux-persist/lib/storage/session";

const CreateStore = () => {
  const initialState = {};

  const middleware = [thunk];

  // const persistConfig = {
  //   key: "root",
  //   storage,
  //   whiteList: ["orderReducer"],
  //   blackList: ["userReducer"],
  // };

  // const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)),
    +window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  // let persistor = persistStore(store);
  // Persist on hot reaload
  // if (module.hot) {
  //   module.hot.accept("./reducers/index", () => {
  //     const nextReducer = require("./reducers/index").default;

  //     store.replaceReducer(nextReducer);
  //   });
  // }

  // return { store, persistor };
  return store;
};

export default CreateStore();
