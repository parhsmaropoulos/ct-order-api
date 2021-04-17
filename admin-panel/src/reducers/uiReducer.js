import {
  SNACKBAR_CLEAR,
  SNACKBAR_ERROR,
  SNACKBAR_INFO,
  SNACKBAR_SUCCESS,
} from "../actions/actions";

const initialState = {
  successSnackbarOpen: false,
  errorSnackbarOpen: false,
  infoSnackbarOpen: false,
  successSnackbarMessage: "",
  errorSnackbarMessage: "",
  infoSnackbarMessage: "",
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case SNACKBAR_SUCCESS:
      return {
        ...state,
        successSnackbarOpen: true,
        successSnackbarMessage: action.message,
      };
    case SNACKBAR_CLEAR:
      return {
        successSnackbarOpen: false,
        infoSnackbarOpen: false,
        errorSnackbarOpen: false,
      };
    case SNACKBAR_ERROR:
      return {
        ...state,
        errorSnackbarOpen: true,
        errorSnackbarMessage: action.message,
      };
    case SNACKBAR_INFO:
      return {
        ...state,
        infoSnackbarOpen: true,
        infoSnackbarMessage: action.message,
      };
    default:
      return state;
  }
}
