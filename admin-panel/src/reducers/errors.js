import {
  ADD_ALERT,
  GET_ERRORS,
  GET_MESSAGE,
  REMOVE_ALERT,
} from "../actions/actions";

const initialState = {
  statusText: "",
  status: null,
  message: "",
  alerts: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        status: action.status,
        statusText: action.statusText,
        message: action.message,
      };
    case GET_MESSAGE:
      return {
        message: action.message,
      };
    case ADD_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload],
      };
    case REMOVE_ALERT:
      return state.alerts.filter((alert) => alert.id !== action.payload);
    default:
      return state;
  }
}
