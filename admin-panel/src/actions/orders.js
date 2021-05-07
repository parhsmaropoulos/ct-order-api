/**
 * Here are the action that are called through the app and redux
 * about orders and their functionalities.
 * First every action performs a request and then
 * depending on the response there is an event dispatch
 */

/**
 * IMPORTS
 */

import axios from "axios";
import { headers } from "../utils/axiosHeaders";
import {
  ADD_ITEM,
  EMPTY_CART,
  ORDER_ACCEPTED,
  REGISTER_FAIL,
  SEND_ORDER,
  SNACKBAR_ERROR,
  SNACKBAR_INFO,
  SNACKBAR_SUCCESS,
  UPDATE_CART,
  UPDATE_ORDER,
} from "./actions";
import { returnErrors } from "./messages";

// Send an order
export const send_order = (data) => (dispatch, getState) => {
  const body = data;
  let SSEdata = { id: null, order: null, from: null, user_details: null };
  axios
    .post("http://localhost:8080/orders/send_order", body, headers)
    .then((res) => {
      SSEdata.id = res.data.order.id;
      SSEdata.order = res.data.order;
      SSEdata.from = res.data.order.user_id;
      SSEdata.user_details = res.data.user_details;
      // axios
      //   .post(`http://localhost:8080/sse/sendorder/${SSEdata.from}`, SSEdata)
      //   .then((res) => {
      //     // console.log(res);
      //   });
      dispatch({
        type: SEND_ORDER,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Order send!",
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

// Update an order status
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

// Add an item to current cart
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

// Update current cart state
export const update_cart = (order, total_price) => (dispatch) => {
  dispatch({
    type: UPDATE_CART,
    new_order: order,
    total_price: total_price,
  });
};

// Empty the cart state
export const empty_cart = () => (dispatch) => {
  dispatch({
    type: EMPTY_CART,
  });
};

// Empty the order accepted
export const order_accepted = () => (dispatch) => {
  console.log("here");
  dispatch({
    type: ORDER_ACCEPTED,
  });
};
