import axios from "axios";
import { headers } from "../utils/axiosHeaders";
import { ADD_ITEM, SEND_ORDER } from "./actions";
import { returnErrors } from "./messages";
import { tokenConfig } from "./user";

export const send_order = (data) => (dispatch, getState) => {
  const body = data;
  console.log(body);
  axios
    .post("http://localhost:8080/orders/send_order", body, headers)
    .then((res) => {
      console.log(res);
      dispatch({
        type: SEND_ORDER,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
    });
};

export const add_item = (item) => (dispatch) => {
  dispatch({
    type: ADD_ITEM,
    product: item,
  });
};
