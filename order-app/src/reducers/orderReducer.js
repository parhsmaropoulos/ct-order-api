import {
  SEND_ORDER,
  ORDER_DECLINED,
  ORDER_ACCEPTED,
  ADD_ITEM,
  UPDATE_ORDER,
  UPDATE_CART,
  CLEAR_REDUCER,
  EMPTY_CART,
} from "../actions/actions";

const defaultState = {
  order: {},
  sent: false,
  pending: false,
  accepted: false,
  recieved: false,
  timeToDelivery: 0,
  products: [],
  totalPrice: 0,
};

const orderReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SEND_ORDER:
      return {
        ...state,
        sent: true,
        pending: true,
        accepted: false,
      };
    case ORDER_ACCEPTED:
      return {
        ...state,
        sent: true,
        accepted: true,
        recieved: true,
        timeToDelivery: action.time,
        pending: false,
      };
    case CLEAR_REDUCER:
      return {
        order: {},
        sent: false,
        pending: false,
        accepted: false,
        recieved: false,
        products: [],
        totalPrice: 0,
      };
    case ORDER_DECLINED:
      return {
        ...state,
        sent: true,
        accepted: false,
        recieved: true,
        pending: false,
      };
    case ADD_ITEM:
      console.log(action);
      let newProducts = [...state.products, action.product];
      let newPrice = state.totalPrice + action.totalPrice;
      return {
        ...state,
        products: newProducts,
        totalPrice: newPrice,
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
