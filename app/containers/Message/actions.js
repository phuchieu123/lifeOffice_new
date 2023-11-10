import constants, { CLEAN, CREATE_CONVERSATION, MERGE_DATA } from './constants';

export function getConversation(query) {
  return {
    type: constants.GET_CONVERSATION,
    query,
  };
}

export function getConversationSuccess(data) {
  return {
    type: constants.GET_CONVERSATION_SUCCESS,
    data,
  };
}

export function getConversationFailure(data) {
  return {
    type: constants.GET_CONVERSATION_FAILURE,
    data,
  };
}

export function postConversation(query) {
  return {
    type: constants.POST_CONVERSATION,
    query,
  };
}

export function postConversationSuccess(data) {
  return {
    type: constants.POST_CONVERSATION_SUCCESS,
    data,
  };
}

export function postConversationFailure(data) {
  return {
    type: constants.POST_CONVERSATION_FAILURE,
    data,
  };
}

export function createConversation(data) {
  return {
    type: CREATE_CONVERSATION,
    data,
  };
}

export function mergeData(data) {
  return {
    type: MERGE_DATA,
    data,
  };
}

export function clean() {
  return {
    type: CLEAN,
  };
}