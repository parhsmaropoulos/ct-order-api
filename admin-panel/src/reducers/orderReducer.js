import {
  SEND_ORDER,
  ORDER_DECLINED,
  ORDER_ACCEPTED,
  ADD_ITEM,
  UPDATE_ORDER,
  UPDATE_CART,
  EMPTY_CART,
} from "../actions/actions";

const defaultState = {
  order: {},
  sent: false,
  pending: false,
  accepted: false,
  products: [],
  totalPrice: 0,
};

const orderReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SEND_ORDER:
      return {
        ...state,
        sent: true,
        accepted: false,
      };
    case ORDER_ACCEPTED:
      return {
        ...state,
        sent: true,
        accepted: true,
      };
    case ORDER_DECLINED:
      return {
        ...state,
        sent: true,
        accepted: false,
      };
    case ADD_ITEM:
      console.log(action);
      return {
        ...state,
        products: [...state.products, action.product],
        totalPrice: state.totalPrice + action.product.price,
      };
    case UPDATE_CART:
      return {
        ...state,
        products: action.new_order,
        totalPrice: action.total_price,
      };
    case UPDATE_ORDER:
      return {
        ...state,
      };
    case EMPTY_CART:
      return {
        order: {},
        sent: false,
        pending: false,
        accepted: false,
        products: [],
        totalPrice: 0,
      };
    default:
      return state;
  }
};

export default orderReducer;
