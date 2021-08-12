import {
  GET_CATEGORIES,
  GET_ITEMS,
  GET_INGREDIENTS,
  CREATE_CATEGORY,
  CREATE_ITEM,
  CREATE_INGREDIENT,
  DELETE_PRODUCT,
  DELETE_CATEGORY,
  DELETE_INGREDIENT,
  UPDATE_INGREDIENT,
  GET_CHOICES,
  CREATE_CHOICE,
  UPDATE_ITEM,
} from "../actions/actions";

const defaultState = {
  products: [],
  product: {},
  categories: [],
  ingredients: [],
  ingredientCategories: [],
  choices: [],
  isReady: false,
};

const productReducer = (state = defaultState, action) => {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        products: action.data,
        isReady: true,
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.data,
      };
    case GET_INGREDIENTS:
      let grouped_ingredients = [];
      let grouped;
      var _ = require("lodash");
      if (action.data.ingredients.length > 0) {
        grouped = _.groupBy(action.data.ingredients, "category");

        for (var i in grouped) {
          grouped_ingredients.push(grouped[i]);
        }
      }
      console.log(grouped_ingredients);
      return {
        ...state,
        ingredients: grouped_ingredients,
        ingredientCategories: action.data.categories,
      };
    case GET_CHOICES:
      return {
        ...state,
        choices: action.data,
      };
    case CREATE_ITEM:
      return {
        ...state,
        products: [...state.products, action.data],
        isReady: false,
      };
    case CREATE_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.data],
        isReady: false,
      };
    case CREATE_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.data],
        isReady: false,
      };
    case CREATE_CHOICE:
      return {
        ...state,
        choices: [...state.choices, action.data],
        isReady: false,
      };
    case UPDATE_ITEM:
      let newItems = [...state.products];

      var indexOfItemToUpdate = 0;
      for (i in newItems) {
        if (newItems[i].id === action.data.id) {
          indexOfItemToUpdate = i;
        }
      }
      newItems[indexOfItemToUpdate] = action.data;
      console.log(newItems);
      return {
        ...state,
        products: newItems,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: [...state.products.filter((prod) => prod !== action.data)],
        isReady: false,
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        categories: [
          ...state.categories.filter((categ) => categ !== action.data),
        ],
        isReady: false,
      };
    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients.filter((ingred) => ingred !== action.data),
        ],
        isReady: false,
      };
    case UPDATE_INGREDIENT:
      let newIngredients = [...state.ingredients];

      var indexOfIngredientToUpdate_outer = 0;
      var indexOfIngredientToUpdate_inner = 0;
      for (i in newIngredients) {
        for (var j in newIngredients[i]) {
          if (newIngredients[i][j].id === action.data.id) {
            indexOfIngredientToUpdate_outer = i;
            indexOfIngredientToUpdate_inner = j;
          }
        }
      }
      newIngredients[indexOfIngredientToUpdate_outer][
        indexOfIngredientToUpdate_inner
      ] = action.data;
      console.log(action.data);
      return {
        ...state,
        ingredients: newIngredients,
      };
    default:
      return state;
  }
};

export default productReducer;
