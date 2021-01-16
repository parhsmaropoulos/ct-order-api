import productReducer from "./productReducer";
import userReducer from "./userReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  productReducer,
  userReducer,
});

export default rootReducer;
