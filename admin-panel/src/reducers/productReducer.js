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
        products: action.products,
        isReady: true,
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
      };
    case GET_INGREDIENTS:
      let grouped_ingredients = [];
      let grouped;
      var _ = require("lodash");
      if (action.ingredients.length > 0) {
        grouped = _.groupBy(action.ingredients, "base_ingredient.category");

        for (var i in grouped) {
          grouped_ingredients.push(grouped[i]);
        }
      }
      return {
        ...state,
        ingredients: grouped_ingredients,
        ingredientCategories: action.categories,
      };
    case GET_CHOICES:
      return {
        ...state,
        choices: action.choices,
      };
    case CREATE_ITEM:
      return {
        ...state,
        products: [...state.products, action.new_product],
        isReady: false,
      };
    case CREATE_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.category],
        isReady: false,
      };
    case CREATE_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.ingredients],
        isReady: false,
      };
    case CREATE_CHOICE:
      return {
        ...state,
        choices: [...state.choices, action.choice],
        isReady: false,
      };
    case UPDATE_ITEM:
      let newItems = [...state.products];

      var indexOfItemToUpdate = 0;
      for (i in newItems) {
        if (newItems[i].id === action.new_item.id) {
          indexOfItemToUpdate = i;
        }
      }
      newItems[indexOfItemToUpdate] = action.new_item;
      console.log(newItems);
      return {
        ...state,
        products: newItems,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        products: [
          ...state.products.filter((prod) => prod !== action.delete_product),
        ],
        isReady: false,
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        categories: [
          ...state.categories.filter(
            (categ) => categ !== action.delete_category
          ),
        ],
        isReady: false,
      };
    case DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: [
          ...state.ingredients.filter(
            (ingred) => ingred !== action.delete_ingredient
          ),
        ],
        isReady: false,
      };
    case UPDATE_INGREDIENT:
      let newIngredients = [...state.ingredients];

      var indexOfIngredientToUpdate_outer = 0;
      var indexOfIngredientToUpdate_inner = 0;
      for (i in newIngredients) {
        for (var j in newIngredients[i]) {
          if (newIngredients[i][j].id === action.new_ingredient.id) {
            indexOfIngredientToUpdate_outer = i;
            indexOfIngredientToUpdate_inner = j;
          }
        }
      }
      newIngredients[indexOfIngredientToUpdate_outer][
        indexOfIngredientToUpdate_inner
      ] = action.new_ingredient;
      console.log(action.new_ingredient);
      return {
        ...state,
        ingredients: newIngredients,
      };
    default:
      return state;
  }
};

export default productReducer;
