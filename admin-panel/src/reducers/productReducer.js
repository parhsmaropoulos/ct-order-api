import { GET_CATEGORIES, GET_ITEMS } from "../actions/actions";

const defaultState = {
  products: [],
  product: {},
  categories: [],
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
    default:
      return state;
  }
};

export default productReducer;
