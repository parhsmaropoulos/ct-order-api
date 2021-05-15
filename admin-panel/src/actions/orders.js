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
  ACCEPT_ORDER,
  ADD_ITEM,
  CLEAR_REDUCER,
  COMPLETE_ORDER,
  EMPTY_CART,
  GET_ORDER,
  ORDER_ACCEPTED,
  REGISTER_FAIL,
  REJECT_ORDER,
  SEND_ORDER,
  SNACKBAR_ERROR,
  SNACKBAR_INFO,
  SNACKBAR_SUCCESS,
  TODAY_ORDERS,
  UPDATE_CART,
  UPDATE_ORDER,
} from "./actions";
import { returnErrors } from "./messages";

// Send an order
export const send_order = (data) => (dispatch, getState) => {
  const body = data;
  let SSEdata = { id: null, order: null, from: null, user_details: null };
  const token = sessionStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  axios
    .post("http://localhost:8080/orders/send_order", body, config)
    .then((res) => {
      console.log(res);
      SSEdata.id = res.data.order.id;
      SSEdata.order = res.data.order;
      SSEdata.from = res.data.order.user_id;
      SSEdata.user_details = res.data.user_details;
      axios
        .post(`http://localhost:8080/sse/sendorder/${SSEdata.from}`, SSEdata)
        .then((res) => {
          // console.log(res);
        });
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
    .put("http://localhost:8080/admin/update_order", body, headers)
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
export const order_accepted = (time) => (dispatch) => {
  console.log("here");
  dispatch({
    type: ORDER_ACCEPTED,
    time: time,
  });
};

// Recieve an order
export const get_order = (order) => (dispatch) => {
  dispatch({
    type: GET_ORDER,
    new_order: order,
  });
};

// Get orders by date
export const get_today_orders = () => (dispatch) => {
  axios
    .get(`http://localhost:8080/admin/today`)
    .then((res) => {
      console.log(res);
      dispatch({
        type: TODAY_ORDERS,
        orders: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Today orders fetched",
      });
    })
    .catch((err) =>
      dispatch({
        type: SNACKBAR_ERROR,
        message: "Today orders fetched error" + err,
      })
    );
};

// Accept an order

export const accept_order = (order, time_input) => (dispatch) => {
  console.log(order);
  let data = {
    id: order.id,
    accepted: true,
    time: parseInt(time_input),
    from: order.user_id,
  };
  let data_2 = {
    delivery_time: parseInt(time_input),
  };
  axios
    .put(`http://localhost:8080/admin/accept/${order.id}`, data_2, headers)
    .then((res) => {
      console.log(res);
      axios.post(`http://localhost:8080/sse/acceptorder`, data).then((res) => {
        console.log(data);
        dispatch({
          type: ACCEPT_ORDER,
          accepted_id: order.id,
          time: time_input,
        });
        dispatch({
          type: SNACKBAR_SUCCESS,
          message: "Order accepted successfuly!",
        });
      });
    })
    .catch((err) => {
      console.log(err.response);
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response,
      });
    });
};

// Complete an order

export const complete_order = (id) => (dispatch) => {
  axios.put(`http://localhost:8080/admin/complete/${id}`).then((res) => {
    console.log(id);
    dispatch({
      type: COMPLETE_ORDER,
      completed_id: id,
    });
  });
};

export const reject_order = (order, time_input) => (dispatch) => {
  let data = {
    id: order.id,
    accepted: false,
    time: parseInt(time_input),
    from: order.from,
  };
  axios.post(`http://localhost:8080/sse/acceptorder`, data).then((res) => {
    console.log(res);
    dispatch({
      type: REJECT_ORDER,
      accepted_id: order.id,
    });
    axios.put(`http://localhost:8080/admin/reject/${order.id}`).then((res) => {
      console.log(res);
    });
  });
};

export const clearReducer = () => (dispatch) => {
  dispatch({
    type: CLEAR_REDUCER,
  });
};
