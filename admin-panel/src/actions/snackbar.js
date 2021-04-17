import {
  SNACKBAR_CLEAR,
  SNACKBAR_ERROR,
  SNACKBAR_INFO,
  SNACKBAR_SUCCESS,
} from "./actions";

export const showSuccessSnackbar = (message) => {
  return (dispatch) => {
    dispatch({ type: SNACKBAR_SUCCESS, message });
  };
};

export const showErrorSnackbar = (message) => {
  return (dispatch) => {
    dispatch({ type: SNACKBAR_ERROR, message });
  };
};

export const showInfoSnackbar = (message) => {
  return (dispatch) => {
    dispatch({ type: SNACKBAR_INFO, message });
  };
};
export const clearSnackbar = () => {
  return (dispatch) => {
    dispatch({ type: SNACKBAR_CLEAR });
  };
};
