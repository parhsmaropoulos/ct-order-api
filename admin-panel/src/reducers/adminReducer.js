import {
  APPROVE_COMMENT,
  COMMENT_ANSWERED,
  GET_COMMENTS,
  REJECT_COMMENT,
} from "../actions/actions";

const defaultState = {
  comments: [],
  loaded: false,
};

const adminReducer = (state = defaultState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default adminReducer;
