/**
 * Here are the action that are called through the app and redux
 * about error logging and their functionalities.
 * First every action performs a request and then
 * depending on the response there is an event dispatch
 */

/**
 * IMPORTS
 */

import {
  SNACKBAR_CLEAR,
  SNACKBAR_ERROR,
  SNACKBAR_INFO,
  SNACKBAR_SUCCESS,
} from "./actions";

// Success log
export const showSuccessSnackbar = (message) => {
  return (dispatch) => {
    dispatch({ type: SNACKBAR_SUCCESS, message });
  };
};

// Error log
export const showErrorSnackbar = (message) => {
  return (dispatch) => {
    dispatch({ type: SNACKBAR_ERROR, message });
  };
};

// Info log
export const showInfoSnackbar = (message) => {
  return (dispatch) => {
    dispatch({ type: SNACKBAR_INFO, message });
  };
};

// Clear all
export const clearSnackbar = () => {
  return (dispatch) => {
    dispatch({ type: SNACKBAR_CLEAR });
  };
};
