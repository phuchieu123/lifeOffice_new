/*
 *
 * CommentView reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  comments: [],
  newComment: {},
};

/* eslint-disable default-case, no-param-reassign */
const commentViewReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.GET_COMMENTS:
        draft.isLoading = true;
        break;
      case constants.GET_COMMENTS_SUCCESS:
        draft.comments = action.data;
        draft.isLoading = false;
        break;
      case constants.GET_COMMENTS_FAILURE:
        draft.isLoading = false;
        break;

      case constants.SEND_COMMENT:
        draft.isLoading = true;
        break;
      case constants.SEND_COMMENT_SUCCESS:
        draft.newComment = action.data;
        draft.isLoading = false;
        break;
      case constants.SEND_COMMENT_SUCCESS:
        draft.isLoading = false;
        break;

      case constants.DELETE_COMMENT:
        draft.isLoading = true;
        break;
      case constants.DELETE_COMMENT_SUCCESS:
        draft.newComment = action.data;
        draft.isLoading = false;
        break;
      case constants.DELETE_COMMENT_SUCCESS:
        draft.isLoading = false;
        break;

      case constants.CLEANUP:
        draft.comments = [];
        draft.newComment = {};
        draft.isLoading = false;
        break;
    }
  });

export default commentViewReducer;
