/**
 * Here are the action that are called through the app and redux
 * about the user  and their functionalities.
 * First every action performs a request and then
 * depending on the response there is an event dispatch
 */

/**
 * IMPORTS
 */

import axios from "axios";
import jwt from "jwt-decode";
import { useDispatch } from "react-redux";
import app from "../firebase/base";
import { authHeaders, headers } from "../utils/axiosHeaders";
import { current_url } from "../utils/util";
import {
  ADMIN_LOADING,
  ADMIN_LOGIN_SUCCESS,
  EMPTY_CART,
  GET_USER,
  GET_USER_ADDRESSES,
  GET_USER_ORDERS,
  GET_USER_RATINGS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
  UPDATE_USER,
  USER_LOADING,
} from "./actions";
import { returnErrors } from "./messages";
import {auth_post_request} from "./lib"

// LOGIN USER
export const login = (email, password) => (dispatch) => {
  dispatch({
    type: USER_LOADING,
  });

  // Request Body
  const data = {
    email: email,
    password: password,
  };

  axios
    .post(current_url + "user/login", data, authHeaders)
    .then((res) => {
      // Decode token
      const token = jwt(res.data.data.access_token);
      // const refreshToken = jwt(res.data.refresh_token);
      console.log(res.data);
      console.log(token);
      const data = {
        id: token.user.ID,
        user: token.user,
      };
      console.log(data);
      dispatch({
        type: LOGIN_SUCCESS,
        token: res.data.data.access_token,
        refresh_token: res.data.data.refresh_token,
        user: data.user,
      });
    })
    .then((res) => {
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Login successful",
      });
    })
    .catch((err) => {
      console.log(err);
      // dispatch(returnErrors(err, err.status));
      dispatch({
        type: LOGIN_FAIL,
        error: err.response,
      });
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Invalid credits",
      });
    });
};

export const login_async = (email, password) => async (dispatch) => {
  // const dispatch = useDispatch();

  try {
    const credentials = await app
      .auth()
      .signInWithEmailAndPassword(email, password);
      console.log(credentials)
    sessionStorage.setItem("userID", credentials.user.uid);
  } catch (error) {
    alert(error);
    dispatch({
      type: LOGIN_FAIL,
      error: error.response,
    });
    dispatch({
      type: SNACKBAR_ERROR,
      message: "Invalid credits",
    });
  }
};

export const register_async = (email, password) => async (dispatch) => {
  try {
    const credentials = await app
      .auth()
      .createUserWithEmailAndPassword(email, password);

    const data = {
      id: credentials.user.uid,
      username: "",
      email: email,
      password:password,
    }
    await auth_post_request("user/register",data,REGISTER_SUCCESS)
    // const res = await axios.post(
    //   current_url + "user/register",
    //   credentials,
    //   authHeaders
    // );
    
    dispatch({
      type: REGISTER_SUCCESS,
    });
    dispatch({
      type: SNACKBAR_SUCCESS,
      message: "User registered successfully",
    });
  } catch (error) {
    alert(error);
    dispatch({
      type: REGISTER_FAIL,
    });
    dispatch({
      type: SNACKBAR_ERROR,
      message: error.response.data.message,
    });
  }
};

export const logout_async = () => async (dispatch) => {
  try {
    const credentials = await app.auth().signOut();
    console.log(credentials);

    sessionStorage.setItem("isAuthenticated", false);
    dispatch({
      type: LOGOUT_SUCCESS,
    });
  } catch (error) {
    alert(error);
  }
};

// LOGIN ADMIN
export const admin_login = (email, password) => (dispatch) => {
  dispatch({
    type: ADMIN_LOADING,
  });
  // Request Body
  const data = {
    email: email,
    password: password,
  };

  axios
    .post(current_url + "admin/login", data, headers)
    .then((res) => {
      // console.log(data.user);
      // Decode token
      const token = jwt(res.data.access_token);
      // const refreshToken = jwt(res.data.refresh_token);
      // console.log(refreshToken);
      const data = {
        id: token.access_uuid,
        user: token.user,
      };
      console.log(token);
      dispatch({
        type: ADMIN_LOGIN_SUCCESS,
        token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        user: data.user,
      });
    })
    .then((res) => {
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Login successful",
      });
    })
    .catch((err) => {
      console.log(err);
      // dispatch(returnErrors(err, err.status));
      dispatch({
        type: LOGIN_FAIL,
        error: err.response.data.message,
      });
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Invalid credits",
      });
    });
};

export const refreshToken = (token) => (dispatch) => {
  const data = {
    refresh_token: token,
  };
  console.log(data);
  axios
    .post(current_url + "token/refresh", data, headers)
    .then((res) => {
      // Decode token
      const token = jwt(res.data.access_token);
      const refreshToken = jwt(res.data.refresh_token);
      console.log(refreshToken);
      const data = {
        id: token.user_id,
        user: token.user,
      };
      console.log(data.user);
      dispatch({
        type: LOGIN_SUCCESS,
        token: res.data.access_token,
        refresh_token: res.data.refresh_token,
        user: data.user,
      });
    })
    .catch((err) => {
      console.log(err.response);
      // dispatch(returnErrors(err, err.status));
      dispatch({
        type: LOGIN_FAIL,
        error: err.response.data.message,
      });
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Invalid credits",
      });
    });
};

// Update User
export const updateUser = (data) => (dispatch) => {
  // Request Body
  // const body = JSON.stringify({ username, email, password1, password2 });
  var user_id = sessionStorage.getItem("userID");

  let body = data.user;
  let url = "";
  if (data.reason === "change_password") {
    url = `user/${user_id}/update_password`;
    body = {
      password: data.password,
    };
  } else if (data.reason === "add_address") {
    url = `user/${user_id}/add_address`;

    body = data;
  } else {
    url = `user/${user_id}/update_personal_info`;
  }
  axios
    .put(current_url + url, body, authHeaders)
    .then((res) => {
      // console.log(res);
      dispatch({
        type: UPDATE_USER,
        payload: res.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "User updated successfully",
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Add user address
export const addUserAddress = (data) => (dispatch) => {
  // Request Body
  var user_id = sessionStorage.getItem("userID");

  const body = data;
  const url = `user/${user_id}/add_address`;

  axios
    .post(current_url + url, body, authHeaders)
    .then((res) => {
      // console.log(res);
      dispatch({
        type: UPDATE_USER,
        payload: res.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "User updated successfully",
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Get User by id
export const getUser = (id) => (dispatch) => {
  axios
    .get(`${current_url}user/${id}`, authHeaders)
    .then((res) => {
      // console.log(res);
      dispatch({
        type: GET_USER,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

// REGISTER USER
export const register = (data) => (dispatch) => {
  // Headers
  dispatch({
    type: USER_LOADING,
  });
  // Request Body
  // const body = JSON.stringify({ username, email, password1, password2 });
  const body = data;
  axios
    .post(current_url + "user/register", body, headers)
    .then((res) => {
      console.log(res);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: res.data.message,
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch({
        type: REGISTER_FAIL,
      });
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  const token = sessionStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  console.log(config);
  axios
    .post(current_url + "user/logout", null, config)
    .then((res) => {
      dispatch({
        type: EMPTY_CART,
      });
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// SUBSCRIBE USER
export const subscribe = (data) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request Body
  const body = data;
  axios
    .post(current_url + "subscribes/new", body, config)
    .then((res) => {
      console.log(res);
      dispatch({
        type: SUBSCRIBE_USER,
        payload: res.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Subscribed successfully!",
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// UNSUBSCRIBE USER
export const unsubscribe = (id) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios
    .put(`${current_url}subscribes/unsubscribe/${id}`, config)
    .then((res) => {
      console.log(res);
      dispatch({
        type: UNSUBSCRIBE_USER,
        payload: res.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Unsubscribed  successfully",
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// GET USERS ORDERS
export const getUserOrders = (id) => (dispatch) => {
  axios
    .get(`${current_url}user/${id}/orders`, authHeaders)
    .then((res) => {
      // console.log(res);
      dispatch({
        type: GET_USER_ORDERS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

// GET USERS ADDRESSES
export const getUserAddresses = (id) => (dispatch) => {
  axios
    .get(`${current_url}user/${id}/addresses`, authHeaders)
    .then((res) => {
      // console.log(res);
      dispatch({
        type: GET_USER_ADDRESSES,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

// GET USERS COMMENTS
export const getUserRatings = (id) => (dispatch) => {
  axios
    .get(`${current_url}user/${id}/comments`, authHeaders)
    .then((res) => {
      // console.log(res);
      dispatch({
        type: GET_USER_RATINGS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
    });
};

// Setup config with token - helper function
export const tokenConfig = (getState) => {
  // get token from localstorage
  const token = localStorage.getItem("token");
  // Get token from state
  console.log(token);
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // If token, add to headers config
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};
