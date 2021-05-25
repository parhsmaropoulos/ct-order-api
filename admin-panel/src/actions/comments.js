import axios from "axios";
import { headers } from "../utils/axiosHeaders";
import { current_url } from "../utils/util";
import {
  APPROVE_COMMENT,
  GET_COMMENTS,
  REJECT_COMMENT,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS,
  COMMENT_ANSWERED,
} from "./actions";

// GET ALL COMMENTS
export const get_comments = () => (dispatch) => {
  axios
    .get(current_url + "comments/all")
    .then((res) => {
      // console.log(res);
      dispatch({
        type: GET_COMMENTS,
        comments: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Comments fetched successfully!",
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Approve Comment
export const approve_comment = (id) => (dispatch) => {
  axios
    .post(`${current_url}comments/approve/${id}`, null, headers)
    .then((res) => {
      console.log(res);
      dispatch({
        type: APPROVE_COMMENT,
        comment: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Comment approved!",
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Reject Comment
export const reject_comment = (id) => (dispatch) => {
  axios
    .post(`${current_url}admin/reject/${id}`, null, headers)
    .then((res) => {
      console.log(res);
      dispatch({
        type: REJECT_COMMENT,
        comment: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Comment rejected!",
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};

// Answer Comment
export const answer_comment = (id, data) => (dispatch) => {
  axios
    .post(`${current_url}comments/answer/${id}`, data, headers)
    .then((res) => {
      console.log(res);
      dispatch({
        type: COMMENT_ANSWERED,
        comment: res.data.data,
      });
      dispatch({
        type: SNACKBAR_SUCCESS,
        message: "Comment answered!",
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: SNACKBAR_ERROR,
        message: err.response.data.message,
      });
    });
};
