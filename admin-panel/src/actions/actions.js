/**
 * Containts all the constant action names
 * for the reducers of the app.
 */

/**
 * User reducer constants
 */
// REGISTER
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAIL = "REGISTER_FAIL";

// LOGIN/LOGOUT
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

// USER
export const USER_LOADED = "USER_LOADED";
export const USER_LOADING = "USER_LOADING";
export const UPDATE_USER = "UPDATE_USER";
export const GET_USERS = "GET_USERS";
export const GET_USER = "GET_USER";
export const SUBSCRIBE_USER = "SUBSCRIBE_USER";
export const UNSUBSCRIBE_USER = "UNSUBSCRIBE_USER";

/**
 * Error reducer constans
 */

// ERRORS
export const GET_ERRORS = "GET_ERRORS";
export const CREATE_MESSAGE = "CREATE_MESSAGE";
export const AUTH_ERROR = "AUTH_ERROR";
export const GET_MESSAGE = "GET_MESSAGE";
export const ADD_ALERT = "ADD_ALERT";
export const REMOVE_ALERT = "REMOVE_ALERT";

// SNACKBARS
export const SNACKBAR_SUCCESS = "SNACKBAR_SUCCESS";
export const SNACKBAR_ERROR = "SNACKBAR_ERROR";
export const SNACKBAR_INFO = "SNACKBAR_INFO";
export const SNACKBAR_CLEAR = "SNACKBAR_CLEAR";

/**
 * Product reducer constans
 */

// PRODUCTS - CATEGORIES - INGREDIENTS - CHOICES
export const GET_ITEMS = "GET_ITEMS";
export const GET_CATEGORIES = "GET_CATEGORIES";
export const GET_INGREDIENTS = "GET_INGREDIENTS";
export const GET_CHOICES = "GET_CHOICES";

export const CREATE_ITEM = "CREATE_ITEM";
export const CREATE_CATEGORY = "CREATE_CATEGORY";
export const CREATE_INGREDIENT = "CREATE_INGREDIENT";
export const CREATE_CHOICE = "CREATE_CHOICES";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const DELETE_CATEGORY = "DELETE_CATEGORY";
export const DELETE_INGREDIENT = "DELETE_INGREDIENT";
export const DELETE_CHOICE = "DELETE_CHOICE";

export const CHANGE_AVAILABILITY = "CHANGE_AVAILABILITY";

export const UPDATE_INGREDIENT = "UPDATE_INGREDIENT";
export const UPDATE_ITEM = "UPDATE_ITEM";
export const UPDATE_CHOICE = "UPDATE_CHOICE";

/**
 * Order reducer constants
 */

// ORDERS
export const SEND_ORDER = "SEND_ORDER";
export const ACCEPT_ORDER = "ACCEPT_ORDER";
export const ORDER_ACCEPTED = "ORDER_ACCEPTED";
export const ORDER_DECLINED = "ORDER_DECLINED";

// CART-CURRENT ORDER
export const ADD_ITEM = "ADD_ITEM";
export const REMOVE_ITEM = "REMOVE_ITEM";
export const UPDATE_CART = "UPDATE_CART";
export const UPDATE_ORDER = "UPDATE_ORDER";
export const EMPTY_CART = "EMPTY_CART";

/**
 * Web socket reducer constants
 */

// WEB-SOCKET
export const SEND_ORDER_REQUEST = "SEND_ORDER_REQUEST";
export const UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS";

export const SEND_MESSAGE_REQUEST = "SEND_MESSAGE_REQUEST";
export const UPDATE_CHAT_LOG = "UPDATE_CHAT_LOG";

export const CREATE_ROOM_REQUEST = "CREATE_ROOM_REQUEST";
export const CREATE_ROOM_SUCCESS = "CREATE_ROOM_SUCCESS";
export const CREATE_ROOM_ERROR = "CREATE_ROOM_ERROR";

export const JOIN_ROOM_REQUEST = "JOIN_ROOM_REQUEST";
export const JOIN_ROOM_SUCCESS = "JOIN_ROOM_SUCCESS";
export const JOIN_ROOM_ERROR = "JOIN_ROOM_ERROR";

export const SET_USERNAME = "SET_USERNAME";
