import {
  CREATE_ROOM_SUCCESS,
  JOIN_ROOM_SUCCESS,
  SET_USERNAME,
} from "../actions/actions";

const defaultState = {
  room: null,
  chatLog: [],
  username: null,
};

const webSocketReducer = (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_ROOM_SUCCESS:
      state.room = action.payload;
      break;

    case JOIN_ROOM_SUCCESS:
      state.room = action.payload;
      break;

    case SET_USERNAME:
      state.username = action.username;
      break;
    default:
      return state;
  }
};

export default webSocketReducer;
