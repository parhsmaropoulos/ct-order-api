import {
  GET_CATEGORIES,
  GET_ITEMS,
  GET_INGREDIENTS,
  CREATE_CATEGORY,
  CREATE_ITEM,
  CREATE_INGREDIENT,
  CHANGE_AVAILABILITY,
  DELETE_PRODUCT,
  DELETE_CATEGORY,
  DELETE_INGREDIENT,
} from "../actions/actions";

const defaultState = {
  products: [],
  product: {},
  categories: [],
  ingredients: [],
};

const productReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        products: action.products,
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
      };
    case GET_INGREDIENTS:
      return {
        ...state,
        ingredients: action.ingredients,
      };
    case CREATE_ITEM:
      return {
        ...state,
        products: [...state.products, action.new_product],
      };
    case CREATE_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.category],
      };
    case CREATE_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.ingredients],
      };
    case CHANGE_AVAILABILITY:
      return {
        ...state,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: [
          ...state.products.filter((prod) => prod !== action.delete_product),
        ],
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        categories: [
          ...state.categories.filter(
            (categ) => categ !== action.delete_category
          ),
        ],
      };
    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients.filter(
            (ingred) => ingred !== action.delete_ingredient
          ),
        ],
      };
    default:
      return state;
  }
};

export default productReducer;
