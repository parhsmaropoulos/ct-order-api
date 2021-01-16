import axios from "axios";
import jwt from "jwt-decode";
import { LOGIN_FAIL, LOGIN_SUCCESS } from "./actions";
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
