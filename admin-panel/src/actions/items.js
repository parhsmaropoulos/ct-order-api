import axios from "axios";
import { GET_CATEGORIES, GET_ITEMS } from "./actions";
import { returnErrors } from "./messages";

// GET ITEMS
export const get_items = () => (dispatch) => {
  axios
    .get("http://localhost:8080/products/all")
    .then((res) => {
      dispatch({
        type: GET_ITEMS,
        products: res.data.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
    });
};

// GET CATEGORIES
export const get_categories = () => (dispatch) => {
  axios
    .get("http://localhost:8080/product_category/all")
    .then((res) => {
      dispatch({
        type: GET_CATEGORIES,
        categories: res.data.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
    });
};
