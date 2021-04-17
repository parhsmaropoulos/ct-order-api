import axios from "axios";
import { headers } from "../utils/axiosHeaders";
import {
  ADD_ITEM,
  REGISTER_FAIL,
  SEND_ORDER,
  SNACKBAR_ERROR,
  SNACKBAR_INFO,
  SNACKBAR_SUCCESS,
  UPDATE_CART,
  UPDATE_ORDER,
} from "./actions";
import { returnErrors } from "./messages";

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
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Order send!",
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

export const update_order = (data) => (dispatch) => {
  const body = data;
  axios
    .put("http://localhost:8080/orders/update_order", body, headers)
    .then((res) => {
      // console.log(res);
      dispatch({
        type: UPDATE_ORDER,
        payload: res.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Order updated!",
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: REGISTER_FAIL,
      });
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

export const add_item = (item) => (dispatch) => {
  dispatch({
    type: ADD_ITEM,
    product: item,
  });
  dispatch({
    type: SNACKBAR_INFO,
    message: "Item added to cart!",
  });
};

export const update_cart = (order, total_price) => (dispatch) => {
  dispatch({
    type: UPDATE_CART,
    new_order: order,
    total_price: total_price,
  });
};
