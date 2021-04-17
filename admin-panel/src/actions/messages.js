import { uniqueId } from "lodash";
import {
  ADD_ALERT,
  CREATE_MESSAGE,
  GET_ERRORS,
  GET_MESSAGE,
  REMOVE_ALERT,
} from "./actions";

// CREATE MESSAGE
export const createMessage = (msg) => {
  return {
    type: CREATE_MESSAGE,
    payload: msg,
  };
};

// RETURN ERRORS
export const returnErrors = (msg, status) => {
  return {
    type: GET_ERRORS,
    payload: { msg, status },
    status: msg.response.status,
    statusText: msg.response.statusText,
    message: msg.response.data.message,
  };
};

export const getMessage = (msg) => {
  return {
    type: GET_MESSAGE,
    message: msg,
  };
};

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uniqueId();
  dispatch({
    type: ADD_ALERT,
    payload: { msg, alertType, id },
  });

  setTimeout(
    () =>
      dispatch({
        type: REMOVE_ALERT,
        payload: id,
      }),
    timeout
  );
};
