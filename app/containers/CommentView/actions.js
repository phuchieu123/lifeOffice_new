/*
 *
 * CommentView actions
 *
 */

import * as constants from './constants';

export function getComments(data) {
  return {
    type: constants.GET_COMMENTS,
    data,
  };
}

export function getCommentsSuccess(data) {
  return {
    type: constants.GET_COMMENTS_SUCCESS,
    data,
  };
}

export function getCommentsFailure(error) {
  return {
    type: constants.GET_COMMENTS_FAILURE,
    error,
  };
}

export function sendComment(data) {
  return {
    type: constants.SEND_COMMENT,
    data,
  };
}

export function sendCommentSuccess(data) {
  return {
    type: constants.SEND_COMMENT_SUCCESS,
    data,
  };
}

export function sendCommentFailure(error) {
  return {
    type: constants.SEND_COMMENT_FAILURE,
    error,
  };
}

export function deleteComment(data) {
  console.log("DATA", data);

  return {
    type: constants.DELETE_COMMENT,
    data,
  
  }
}

export function deleteCommentSuccess(data) {
  return {
    type: constants.DELETE_COMMENT_SUCCESS,
    data,
  };
}

export function deleteCommentFailure(error) {
  return {
    type: constants.DELETE_COMMENT_FAILURE,
    error,
  };
}

export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}
