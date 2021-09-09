import {
  GET_USER,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  UPDATE_USER,
  USER_LOADED,
  USER_LOADING,
  LOGIN_FAIL,
  SUBSCRIBE_USER,
  UNSUBSCRIBE_USER,
  GET_USER_ORDERS,
  GET_USER_ADDRESSES,
  ADD_ADDRESS,
  EDIT_ADDRESS,
} from "../actions/actions";

const defaultState = {
  token: sessionStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false,
  hasLoaded: false,
  user: null,
  addresses: [],
  orders: [],
  ratings: [],
  error: "",
};

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        isLoading: true,
        error: "",
      };
    case SUBSCRIBE_USER:
      return {
        ...state,
      };
    case UNSUBSCRIBE_USER:
      return {
        ...state,
      };
    case UPDATE_USER:
      return {
        ...state,
        hasLoaded: false,
        error: "",
      };
    case GET_USER:
      return {
        ...state,
        user: action.data,
        hasLoaded: true,
        error: "",
      };
    case USER_LOADED:
      sessionStorage.setItem("isAuthenticated", true);
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        hadLoaded: true,
        user: action.user,
      };
    case LOGIN_SUCCESS:
      sessionStorage.setItem("isAuthenticated", true);
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        error: "",
      };
    case LOGIN_FAIL:
      // console.log(action);
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        user: action.user,
      };
    case LOGOUT_SUCCESS:
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("userID");
      return {
        ...state,
        token: null,
        user: null,
        error: "",
        hasLoaded: false,
        isAuthenticated: false,
        isLoading: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        token: null,
        user: null,
        error: "",
        hasLoaded: false,
        isAuthenticated: false,
        isLoading: false,
      };
    case GET_USER_ORDERS:
      console.log(action);
      return {
        ...state,
        orders: action.data,
      };
    case GET_USER_ADDRESSES:
      console.log(action);
      return {
        ...state,
        addresses: action.data,
      };
    case ADD_ADDRESS:
      return {
        ...state,
        hasLoaded: false,
      };
    case EDIT_ADDRESS:
      return {
        ...state,
        hasLoaded: false,
      };
    default:
      return state;
  }
};

export default userReducer;
