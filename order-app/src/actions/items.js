/**
 * Here are the action that are called through the app and redux
 * about items and their functionalities.
 * First every action performs a request and then
 * depending on the response there is an event dispatch
 */

/**
 * IMPORTS
 */

import axios from "axios";
import { authHeaders, headers } from "../utils/axiosHeaders";
import { current_url } from "../utils/util";
import {
  CREATE_CATEGORY,
  CREATE_CHOICE,
  CREATE_INGREDIENT,
  CREATE_ITEM,
  DELETE_CATEGORY,
  DELETE_CHOICE,
  DELETE_INGREDIENT,
  DELETE_PRODUCT,
  GET_CATEGORIES,
  GET_CHOICES,
  GET_INGREDIENTS,
  GET_ITEMS,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS,
  UPDATE_INGREDIENT,
  UPDATE_ITEM,
  UPDATE_CHOICE,
} from "./actions";
import { returnErrors } from "./messages";

/**
 * ITEM ACTIONS
 */

// GET ALL ITEMS
export const get_items = () => (dispatch) => {
  app
    .auth()
    .currentUser.getIdToken(/* forceRefresh */ true)
    .then(function (idToken) {
      // Send token to your backend via HTTPS
      // ...
      let headers = authHeaders;
      headers.Authorization = `Beare ${idToken}`;
      console.log(idToken);
      axios
        .get(current_url + "products/all", headers)
        .then((res) => {
          console.log(res);
          dispatch({
            type: GET_ITEMS,
            products: res.data.data,
          });
          dispatch({
            type: SNACKBAR_SUCCESS,
            message: "Products fetched successfully!",
          });
        })
        .catch((err) => {
          console.log(err.response);
          dispatch({
            type: SNACKBAR_ERROR,
            message: err.response.data.message,
          });
          dispatch(returnErrors(err, err.status));
        });
    })
    .catch(function (error) {
      // Handle error
    });
};

// CREATE PRODUCT
export const create_product = (data, image) => (dispatch) => {
  // const body = data;
  let body = new FormData();
  body.append("file", image);
  body.append("name", data.name);
  body.append("description", data.description);
  body.append("price", data.price);
  body.append("choices_id", JSON.stringify(data.choices_id));
  // body.append("choices", data.choices);
  body.append("custom", data.custom);
  body.append("category_id", data.category_id);
  body.append("ingredients_id", JSON.stringify(data.ingredients_id));
  // body.append("ingredients", data.ingredients);
  body.append("default_ingredients", JSON.stringify(data.default_ingredients));
  const headers = {
    "Content-Type": "multipart/form-data",
  };

  axios
    .post(current_url + "products/create_product", body, headers)
    .then((res) => {
      dispatch({
        type: CREATE_ITEM,
        new_product: res.data.data,
        new_category: res.data.new_cat,
      });
    })
    .then((res) => {
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "product created successfully",
      });
    })
    .catch((err) => {
      console.log(err.response);
      // dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Update an item
export const update_item = (id, product) => (dispatch) => {
  let body = new FormData();
  // TODO update image
  // body.append("file", image);
  // body.append("file", image);
  body.append("name", product.name);
  body.append("description", product.description);
  body.append("price", product.price);
  body.append("choices_id", JSON.stringify(product.choices_id));
  // body.append("choices", data.choices);
  body.append("custom", product.custom);
  body.append("category_id", product.category_id);
  body.append("ingredients_id", JSON.stringify(product.ingredients_id));
  // body.append("ingredients", data.ingredients);
  body.append(
    "default_ingredients",
    JSON.stringify(product.default_ingredients)
  );
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  axios
    .put(current_url + `products/${id}/update_values`, body, headers)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: UPDATE_ITEM,
        new_item: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "item updated successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      // dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Change availability of  an item
export const change_item_availability = (id) => (dispatch) => {
  axios
    .put(current_url + `products/${id}/change_availability`, headers)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: UPDATE_ITEM,
        new_item: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "item updated successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      // dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

/**
 * CATEGORY ACTIONS
 */

// GET ALL CATEGORIES
export const get_categories = () => (dispatch) => {
  axios
    .get(current_url + "product_category/all")
    .then((res) => {
      dispatch({
        type: GET_CATEGORIES,
        categories: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Categories fetched successfully!",
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

// CREATE A CATEGOY
export const create_category = (data, image) => (dispatch) => {
  let body = new FormData();
  body.append("file", image);
  body.append("name", data.name);
  body.append("description", data.description);
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  axios
    .post(
      current_url + "product_category/create_product_category",
      body,
      headers
    )
    .then((res) => {
      dispatch({
        type: CREATE_CATEGORY,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Category created successfully!",
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

/**
 * INGREDIENTS ACTIONS
 */

// GET ALL INGREDIENTS
export const get_ingredients = () => (dispatch) => {
  axios
    .get(current_url + "ingredients/all")
    .then((res) => {
      console.log(res);
      dispatch({
        type: GET_INGREDIENTS,
        ingredients: res.data.data.ingredients,
        categories: res.data.data.categories,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Ingredients fetched successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// CREATE INGREDIENT
export const create_ingredient = (data) => (dispatch) => {
  const body = data;
  axios
    .post(current_url + "ingredients/create_ingredient", body, headers)
    .then((res) => {
      dispatch({
        type: CREATE_INGREDIENT,
        new_ingredient: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Ingredient created successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Update an Ingredient
export const update_ingredient = (id, ingredient) => (dispatch) => {
  const body = ingredient;
  axios
    .put(current_url + `ingredients/${id}/update_values`, body, headers)
    .then((res) => {
      console.log(res);
      dispatch({
        type: UPDATE_INGREDIENT,
        new_ingredient: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Ingredient updated successfully",
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Change ingredient availability
export const change_ingredient_availability = (id) => (dispatch) => {
  axios
    .put(current_url + `ingredients/${id}/change_availability`, headers)
    .then((res) => {
      console.log(res);
      dispatch({
        type: UPDATE_INGREDIENT,
        new_ingredient: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Ingredient updated successfully",
      });
    })
    .catch((err) => {
      dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

/**
 * CHOICES ACTIONS
 */

// GET ALL CHOICES
export const get_choices = () => (dispatch) => {
  axios
    .get(current_url + "product_choices/all")
    .then((res) => {
      // console.log(res);
      dispatch({
        type: GET_CHOICES,
        choices: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Choices fetched successfully!",
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

// CREATE A CHOICE
export const create_choice = (data) => (dispatch) => {
  const body = data;
  axios
    .post(current_url + "product_choices/new_product_choice", body, headers)
    .then((res) => {
      dispatch({
        type: CREATE_CHOICE,
        choice: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Choice created successfully",
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

// Update a choice
export const update_choice = (id, choice) => (dispatch) => {
  const data = choice;
  axios
    .put(
      `${current_url}product_choices/${id}/update_product_choice`,
      data,
      headers
    )
    .then((res) => {
      dispatch({
        type: UPDATE_CHOICE,
        new_item: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Choice updated successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      // dispatch(returnErrors(err, err.status));
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Delete an item, here an item
// can be either a Product,Category,Choice,Ingredient
export const delete_item = (id, type) => (dispatch) => {
  const body = {
    id: id,
    type: type,
  };
  switch (body.type) {
    case "product":
      axios
        .delete(`${current_url}products/product/${id}`, headers)
        .then((res) => {
          dispatch({
            type: DELETE_PRODUCT,
            deleted_product: res.data.data,
          });
          dispatch({
            type: SNACKBAR_SUCCESS,
            message: "Item deleted successfully",
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
      return;
    case "category":
      axios
        .delete(`${current_url}product_category/delete/${id}`, headers)
        .then((res) => {
          dispatch({
            type: DELETE_CATEGORY,
            deleted_category: res.data.data,
          });
          dispatch({
            type: SNACKBAR_SUCCESS,
            message: "Category deleted successfully",
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
      return;
    case "ingredient":
      axios
        .delete(`${current_url}products/ingredient/${id}`, headers)
        .then((res) => {
          dispatch({
            type: DELETE_INGREDIENT,
            delete_ingredient: res.data.data,
          });
          dispatch({
            type: SNACKBAR_SUCCESS,
            message: "Ingredient deleted successfully",
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
      return;
    case "choice":
      axios
        .delete(`${current_url}products/choice/${id}`, headers)
        .then((res) => {
          dispatch({
            type: DELETE_CHOICE,
            delete_choice: res.data.data,
          });
          dispatch({
            type: SNACKBAR_SUCCESS,
            message: "Choice deleted successfully",
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
      return;
    default:
      return;
  }
};

// ################# ASYNC METHODS ##################

export const GetAsyncItems = async () => {
  try {
    const resp = await axios.get(current_url + "products/all", headers);
    return resp.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const GetAsyncCategories = async () => {
  try {
    const resp = await axios.get(current_url + "product_category/all", headers);
    return resp.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
