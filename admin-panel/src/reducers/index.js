import productReducer from "./productReducer";
import userReducer from "./userReducer";
import orderReducer from "./orderReducer";
import errorReducer from "./errors";
import uiReducer from "./uiReducer";
import webSocketReducer from "./webSocketReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  productReducer,
  userReducer,
  orderReducer,
  errorReducer,
  uiReducer,
  webSocketReducer,
});

export default rootReducer;
