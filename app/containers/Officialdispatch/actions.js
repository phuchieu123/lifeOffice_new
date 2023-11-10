/*
 *
 * ProjectDetailPage actions
 *
 */

import * as constants from './constants';



export function updateOfficialdispatch(data) {
  return {
    type: constants.UPDATE_OFFICIALDISPATCH,
    data,
  };
}

export function updateOfficialdispatchSuccess(data) {

  return {
    type: constants.UPDATE_OFFICIALDISPATCH_SUCCESS,
    data,
  };
}

export function updateOfficialdispatchFailure(error) {
  return {
    type: constants.UPDATE_OFFICIALDISPATCH_FAILURE,
    error,
  };
}
export function uploadCreatDocumentary(data) {
  return {
    type: constants.UPLOAD_CREATDOCUMENTARY,
    data
  }
}
export function uploadCreatDocumentarySuccess(data) {
  return {
    type: constants.UPLOAD_CREATDOCUMENTARY_SUCCESS,
    data
  }
}
export function uploadCreatDocumentaryFailure(data) {
  return {
    type: constants.UPLOAD_CREATDOCUMENTARY_FAILURE,
    data
  }
}

export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}
