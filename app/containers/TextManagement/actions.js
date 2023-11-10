/*
 *
 * TextManagement actions
 *
 */

import * as constants from './constants';

export function getDocument(data) {
  return {
    type: constants.GET_DOCUMENT,
    data,
  };
}
export function getDocumentSuccess(data) {
  return {
    type: constants.GET_DOCUMENT_SUCCESS,
    data,
  };
}
export function getDocumentFailure(error) {
  return {
    type: constants.GET_DOCUMENT_FAILURE,
    error,
  };
}

export function updateDocument(data) {
  return {
    type: constants.UPDATE_DOCUMENT,
    data,
  };
}
export function updateDocumentSuccess(data) {
  return {
    type: constants.UPDATE_DOCUMENT_SUCCESS,
    data,
  };
}
export function updateDocumentFailure(error) {
  return {
    type: constants.UPDATE_DOCUMENT_FAILURE,
    error,
  };
}

export function uploadCreateDocument(data) {
  return {
    type: constants.UPLOAD_CREATE_DOCUMENT,
    data
  }
}
export function uploadCreateDocumentSuccess(data) {
  return {
    type: constants.UPLOAD_CREATE_DOCUMENT_SUCCESS,
    data
  }
}
export function uploadCreateDocumentFailure(data) {
  return {
    type: constants.UPLOAD_CREATE_DOCUMENT_FAILURE,
    data
  }
}
