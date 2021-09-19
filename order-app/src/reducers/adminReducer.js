import {
  APPROVE_COMMENT,
  COMMENT_ANSWERED,
  GET_COMMENTS,
  REJECT_COMMENT,
  GET_ORDER,
  ACCEPT_ORDER,
  TODAY_ORDERS,
  COMPLETE_ORDER,
  ADMIN_LOGIN_SUCCESS,
  ADMIN_LOGOUT,
  ADMIN_LOADING,
} from "../actions/actions";

const defaultState = {
  comments: [],
  loaded: false,
  isAuthenticated: false,
  isLoading: false,
  orders_loaded_today: false,
  orders: {
    pending_orders: [],
    accepted_orders: [],
    finished_orders: [],
  },
};

const adminReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADMIN_LOADING: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case ADMIN_LOGIN_SUCCESS:
      sessionStorage.setItem("adminAuthenticated", true);
      sessionStorage.setItem("token", action.token);
      sessionStorage.setItem("refreshToken", action.refresh_token);
      sessionStorage.setItem("userID", action.user.id);
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
      };
    case ADMIN_LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
      };
    case GET_COMMENTS:
      return {
        ...state,
        comments: action.comments,
        loaded: true,
      };
    case APPROVE_COMMENT:
      let newComments = [...state.comments];
      for (var i in newComments) {
        if (newComments[i].id === action.comment.id) {
          newComments[i] = action.comment;
        }
      }
      return {
        ...state,
        comments: newComments,
      };
    case REJECT_COMMENT:
      let newComments_r = [...state.comments];
      for (i in newComments_r) {
        if (newComments_r[i].id === action.comment.id) {
          newComments_r[i] = action.comment;
        }
      }
      return {
        ...state,
        comments: newComments_r,
      };
    case COMMENT_ANSWERED:
      let newAnswerComments = [...state.comments];
      for (i in newAnswerComments) {
        if (newAnswerComments[i].id === action.comment.id) {
          newAnswerComments[i] = action.comment;
        }
      }
      return {
        ...state,
        comments: newAnswerComments,
      };
    case GET_ORDER:
      // Append the new order
      // to the pending orders
      let newPendingOrders = state.orders;
      newPendingOrders.pending_orders.push(action.new_order);
      return {
        ...state,
        orders: newPendingOrders,
      };
    case ACCEPT_ORDER:
      // Remove order from pending
      // append it to accepted
      // console.log(action);
      // console.log(action.accepted_id);
      let newAcceptedOrders = state.orders;
      for (i in newAcceptedOrders.pending_orders) {
        if (newAcceptedOrders.pending_orders[i].id === action.accepted_id) {
          newAcceptedOrders.pending_orders[i].delivery_time = action.time;
          newAcceptedOrders.accepted_orders.push(
            newAcceptedOrders.pending_orders[i]
          );
        }
      }
      newAcceptedOrders.pending_orders =
        newAcceptedOrders.pending_orders.filter(
          (order) => order.id !== action.accepted_id
        );

      return {
        ...state,
        orders: newAcceptedOrders,
      };
    case COMPLETE_ORDER:
      // Remove order from pending
      // append it to accepted
      console.log(action.completed_id);
      let newCompletedOrders = state.orders;
      for (i in newCompletedOrders.accepted_orders) {
        if (newCompletedOrders.accepted_orders[i].id === action.completed_id) {
          newCompletedOrders.finished_orders.push(
            newCompletedOrders.accepted_orders[i]
          );
        }
      }
      newCompletedOrders.accepted_orders =
        newCompletedOrders.accepted_orders.filter(
          (order) => order.id !== action.completed_id
        );
      return {
        ...state,
        orders: newCompletedOrders,
      };
    case TODAY_ORDERS:
      let orders = action.data;
      let newTodayOrders = state.orders;
      newTodayOrders.accepted_orders = [];
      newTodayOrders.pending_orders = [];
      newTodayOrders.finished_orders = [];
      for (i in orders) {
        if (orders[i].completed) {
          newTodayOrders.finished_orders.push(orders[i]);
        } else {
          if (orders[i].accepted || orders[i].canceled) {
            newTodayOrders.accepted_orders.push(orders[i]);
          } else {
            newTodayOrders.pending_orders.push(orders[i]);
          }
        }
      }
      return {
        ...state,
        orders: newTodayOrders,
        orders_loaded_today: true,
      };
    default:
      return state;
  }
};

export default adminReducer;
