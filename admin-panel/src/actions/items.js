import axios from "axios";
import { headers } from "../utils/axiosHeaders";
import {
  CHANGE_AVAILABILITY,
  CREATE_CATEGORY,
  CREATE_INGREDIENT,
  CREATE_ITEM,
  DELETE_CATEGORY,
  DELETE_INGREDIENT,
  DELETE_PRODUCT,
  GET_CATEGORIES,
  GET_INGREDIENTS,
  GET_ITEMS,
} from "./actions";
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

// GET INGREDIENTS
export const get_ingredients = () => (dispatch) => {
  axios
    .get("http://localhost:8080/products/ingredients")
    .then((res) => {
      dispatch({
        type: GET_INGREDIENTS,
        ingredients: res.data.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
    });
};

// CREATE CATEGOY
export const create_category = (data) => (dispatch) => {
  const body = data;
  axios
    .post(
      "http://localhost:8080/product_category/create_product_category",
      body,
      headers
    )
    .then((res) => {
      dispatch({
        type: CREATE_CATEGORY,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
    });
};

// CREATE PRODUCT
export const create_product = (data, image) => (dispatch) => {
  // const body = data;
  let body = new FormData();
  body.append("file", image);
  body.append("data", JSON.stringify(data));
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  axios
    .post("http://localhost:8080/products/create_product", body, headers)
    .then((res) => {
      dispatch({
        type: CREATE_ITEM,
        new_product: res.data.data,
        new_category: res.data.new_cat,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
    });
};

// CREATE INGREDIENT
export const create_ingredient = (data) => (dispatch) => {
  const body = data;
  axios
    .post(
      "http://localhost:8080/products/create_product_ingredient",
      body,
      headers
    )
    .then((res) => {
      dispatch({
        type: CREATE_INGREDIENT,
        new_ingredient: res.data.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
    });
};

export const update_item = (id, product, reason) => (dispatch) => {
  const body = {
    id: id,
    product: product,
    reason: reason,
  };
  axios
    .put(`http://localhost:8080/products/update`, body, headers)
    .then((res) => {
      dispatch({
        type: CHANGE_AVAILABILITY,
        new_item: res.data.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch(returnErrors(err, err.status));
    });
};

export const delete_item = (id, type) => (dispatch) => {
  const body = {
    id: id,
    type: type,
  };
  switch (body.type) {
    case "product":
      console.log("here");
      axios
        .delete(`http://localhost:8080/products/product/${id}`, headers)
        .then((res) => {
          dispatch({
            type: DELETE_PRODUCT,
            deleted_product: res.data.data,
          });
        })
        .catch((err) => {
          console.log(err);
          dispatch(returnErrors(err, err.status));
        });
      return;
    case "category":
      console.log("here");
      axios
        .delete(`http://localhost:8080/product_category/delete/${id}`, headers)
        .then((res) => {
          dispatch({
            type: DELETE_CATEGORY,
            deleted_category: res.data.data,
          });
        })
        .catch((err) => {
          console.log(err);
          dispatch(returnErrors(err, err.status));
        });
      return;
    case "ingredient":
      console.log("here");
      axios
        .delete(`http://localhost:8080/products/ingredient/${id}`, headers)
        .then((res) => {
          dispatch({
            type: DELETE_INGREDIENT,
            delete_ingredient: res.data.data,
          });
        })
        .catch((err) => {
          console.log(err);
          dispatch(returnErrors(err, err.status));
        });
      return;
    default:
      return;
  }
};
