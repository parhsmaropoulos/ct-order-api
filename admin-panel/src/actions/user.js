import axios from "axios";
import jwt from "jwt-decode";
import {
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
} from "./actions";
import { returnErrors } from "./messages";

// LOGIN USER
export const login = (email, password) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request Body
  const body = JSON.stringify({ email, password });

  axios
    .post("http://localhost:8080/user/login", body, config)
    .then((res) => {
      // Decode token
      const token = jwt(res.data.access_token);
      const refreshToken = jwt(res.data.refresh_token);
      const data = {
        id: token.user_id,
        user: token.user,
      };
      // console.log(refreshToken);
      dispatch({
        type: LOGIN_SUCCESS,
        token: res.data.access_token,
        refresh_token: refreshToken,
        user: data.user,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: LOGIN_FAIL,
      });
    });
};

// REGISTER USER
export const register = (data) => (dispatch) => {
  // Headers
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Request Body
  // const body = JSON.stringify({ username, email, password1, password2 });
  const body = data;
  axios
    .post("http://localhost:8080/user/register", body, config)
    .then((res) => {
      console.log(res);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: REGISTER_FAIL,
      });
    });
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
  axios
    .post("http://localhost:8080/user/logout", null, tokenConfig(getState))
    .then((res) => {
      console.log(res);
      dispatch({
        type: LOGOUT_SUCCESS,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
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
