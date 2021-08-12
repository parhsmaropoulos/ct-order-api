import axios from "axios";
import app from "../firebase/base";
import { authHeaders, config } from "../utils/axiosHeaders";
import { current_url } from "../utils/util";
import { SNACKBAR_ERROR } from "./actions";

export const auth_get_request = (url, dispatch_type) => async (dispatch) => {
  try {
    const token = await app
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true);
    let auth_config = config;
    auth_config.headers.Authorization = `Bearer ${token}`;
    console.log(token);
    console.log("here", authHeaders);
    try {
      const res = await axios.get(current_url + url, auth_config);
      dispatch({
        type: dispatch_type,
        data: res.data.data,
      });
    } catch (e) {
      console.log("1");
      console.log(e.response);
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Error with get request",
      });
    }
  } catch (e) {
    console.log("2");

    console.log(e.response.data);
    //handle e
    dispatch({
      type: SNACKBAR_ERROR,
      message: "Error with token",
    });
  }
};
