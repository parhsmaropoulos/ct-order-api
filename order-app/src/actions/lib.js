import axios from "axios";
import { config } from "../utils/axiosHeaders";
import { current_url } from "../utils/util";
import { CREATE_CATEGORY, CREATE_ITEM, SNACKBAR_ERROR } from "./actions";

export const auth_get_request = (url, dispatch_type) => async (dispatch) => {
  try {
    let auth_config = config;
    auth_config.headers.Authorization = `Bearer ${localStorage.getItem(
      "firToken"
    )}`;
    try {
      const res = await axios.get(current_url + url, auth_config);
      // console.log(res);
      dispatch({
        type: dispatch_type,
        data: res.data.data,
      });
      return res;
    } catch (e) {
      console.log(e);
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Error with get request",
      });
    }
  } catch (e) {
    //handle e
    dispatch({
      type: SNACKBAR_ERROR,
      message: "Error with token",
    });
  }
};

export const get_request = (url, dispatch_type) => async (dispatch) => {
  try {
    let auth_config = config;
    try {
      const res = await axios.get(current_url + url, auth_config);
      dispatch({
        type: dispatch_type,
        data: res.data.data,
      });
      return res;
    } catch (e) {
      console.log(e);
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Error with get request",
      });
    }
  } catch (e) {
    //handle e
    dispatch({
      type: SNACKBAR_ERROR,
      message: "Error with token",
    });
  }
};

export const auth_post_request =
  (url, data, dispatch_type) => async (dispatch) => {
    try {
      let auth_config = config;
      auth_config.headers.Authorization = `Bearer ${localStorage.getItem(
        "firToken"
      )}`;
      if (dispatch_type === CREATE_ITEM || dispatch_type === CREATE_CATEGORY) {
        auth_config.headers["Content-Type"] = "multipart/form-data";
      }

      try {
        const res = await axios.post(current_url + url, data, auth_config);
        // console.log(res);

        dispatch({
          type: dispatch_type,
          data: res.data.data,
        });
        return res;
      } catch (e) {
        console.log(e.response);
        dispatch({
          type: SNACKBAR_ERROR,
          message: "Error with post request",
        });
      }
    } catch (e) {
      //handle e
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Error with token",
      });
    }
  };

export const post_request = (url, data, dispatch_type) => async (dispatch) => {
  try {
    const res = await axios.post(current_url + url, data);
    console.log(res);
    dispatch({
      type: dispatch_type,
      data: res.data.data,
    });
    return res;
  } catch (e) {
    console.log(e);
    dispatch({
      type: SNACKBAR_ERROR,
      message: "Error with get request",
    });
  }
};

export const auth_put_request =
  (url, data, dispatch_type) => async (dispatch) => {
    try {
      let auth_config = config;
      auth_config.headers.Authorization = `Bearer ${localStorage.getItem(
        "firToken"
      )}`;
      try {
        const res = await axios.put(current_url + url, data, auth_config);
        dispatch({
          type: dispatch_type,
          data: res.data.data,
        });
        return res;
      } catch (e) {
        dispatch({
          type: SNACKBAR_ERROR,
          message: "Error with put request",
        });
      }
    } catch (e) {
      //handle e
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Error with token",
      });
    }
  };

export const auth_delete_request = (url, dispatch_type) => async (dispatch) => {
  try {
    let auth_config = config;
    auth_config.headers.Authorization = `Bearer ${localStorage.getItem(
      "firToken"
    )}`;
    try {
      const res = await axios.delete(current_url + url, auth_config);
      dispatch({
        type: dispatch_type,
        data: res.data.data,
      });
      return res;
    } catch (e) {
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Error with delete request",
      });
    }
  } catch (e) {
    //handle e
    dispatch({
      type: SNACKBAR_ERROR,
      message: "Error with token",
    });
  }
};

export const put_request = (url, data, dispatch_type) => async (dispatch) => {
  try {
    let auth_config = config;
    try {
      const res = await axios.put(current_url + url, data, auth_config);
      console.log(res);
      dispatch({
        type: dispatch_type,
        data: res.data.data,
      });
      return res;
    } catch (e) {
      console.log(e);
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Error with get request",
      });
    }
  } catch (e) {
    //handle e
    dispatch({
      type: SNACKBAR_ERROR,
      message: "Error with token",
    });
  }
};
