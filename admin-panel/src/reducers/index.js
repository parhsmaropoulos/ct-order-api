import productReducer from "./productReducer";
import userReducer from "./userReducer";
import orderReducer from "./orderReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  productReducer,
  userReducer,
  orderReducer,
});

export default rootReducer;
