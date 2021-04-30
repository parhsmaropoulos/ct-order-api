import axios from "axios";
import {
  CREATE_ROOM_ERROR,
  CREATE_ROOM_REQUEST,
  CREATE_ROOM_SUCCESS,
  JOIN_ROOM_REQUEST,
  JOIN_ROOM_SUCCESS,
  JOIN_ROOM_ERROR,
  SET_USERNAME,
} from "./actions";

export function createRoomRequest() {
  return {
    type: CREATE_ROOM_REQUEST,
  };
}

export function createRoomSuccess(payload) {
  return {
    type: CREATE_ROOM_SUCCESS,
    payload,
  };
}

export function createRoomError(error) {
  return {
    type: CREATE_ROOM_ERROR,
    error,
  };
}

export function createRoom(roomName) {
  return async function (dispatch) {
    dispatch(createRoomRequest());
    try {
      const response = await axios.get(
        `http://localhost:8080/room?name=${roomName}`
      );
      dispatch(createRoomSuccess(response.data));
    } catch (error) {
      dispatch(createRoomError(error));
    }
  };
}

export function joinRoomRequest() {
  return {
    type: JOIN_ROOM_REQUEST,
  };
}

export function joinRoomSuccess(payload) {
  return {
    type: JOIN_ROOM_SUCCESS,
    payload,
  };
}

export function joinRoomError(error) {
  return {
    type: JOIN_ROOM_ERROR,
    error,
  };
}

export function joinRoom(roomId) {
  return async function (dispatch) {
    dispatch(joinRoomRequest());
    try {
      const response = await axios.get(`http://localhost:8080/room/${roomId}`);
      dispatch(joinRoomSuccess(response.data));
    } catch (error) {
      dispatch(joinRoomError(error));
    }
  };
}

export function setUsername(username) {
  return {
    type: SET_USERNAME,
    username,
  };
}
