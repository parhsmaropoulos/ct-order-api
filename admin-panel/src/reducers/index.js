import productReducer from "./productReducer";
import userReducer from "./userReducer";
import orderReducer from "./orderReducer";
import errorReducer from "./errors";
import uiReducer from "./uiReducer";
import webSocketReducer from "./webSocketReducer";
import adminReducer from "./adminReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  productReducer,
  userReducer,
  orderReducer,
  errorReducer,
  uiReducer,
  webSocketReducer,
  adminReducer,
});

export default rootReducer;
