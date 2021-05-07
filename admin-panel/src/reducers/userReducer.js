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
} from "../actions/actions";

const defaultState = {
  token: sessionStorage.getItem("token"),
  isAuthenticated: false,
  isLoading: false,
  hasLoaded: false,
  user: null,
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
        user: action.payload.user,
        hasLoaded: true,
        error: "",
      };
    case USER_LOADED:
      sessionStorage.setItem("isAuthenticated", true);
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.user,
      };
    case LOGIN_SUCCESS:
      sessionStorage.setItem("isAuthenticated", true);
      sessionStorage.setItem("token", action.token);
      sessionStorage.setItem("refreshToken", action.refresh_token);
      sessionStorage.setItem("userID", action.user.id);
      // sessionStorage.setItem("isAuthenticated", true);
      // console.log(action);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        user: action.user,
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
      sessionStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        user: action.user,
      };
    case LOGOUT_SUCCESS:
      sessionStorage.removeItem("token");
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
      sessionStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        error: "",
        hasLoaded: false,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default userReducer;
