/*
 *
 * ApprovePage actions
 *
 */

import {
  UPDATE_APPROVE,
  UPDATE_APPROVE_FAIL,
  UPDATE_APPROVE_SUCCESS,
  // ADD_APPROVE,
  // ADD_APPROVE_FAIL,
  // ADD_APPROVE_SUCCESS,
  GET_APPROVE,
  GET_APPROVE_FAILURE,
  GET_APPROVE_SUCCESS,
  OPEN_TEMPLATE,
  UPDATE_COUNT,
  CLEANUP,
} from './constants';

export function updateCount(approveType, count) {
  return {
    type: UPDATE_COUNT,
    approveType,
    count,
  };
}

export function updateApprove(approve, data) {
  return {
    type: UPDATE_APPROVE,
    approve,
    data,
  };
}
export function updateApproveSuccess(data) {
  return {
    type: UPDATE_APPROVE_SUCCESS,
    data,
  };
}
export function updateApproveFailure(err, message) {
  return {
    type: UPDATE_APPROVE_FAIL,
    err,
    message,
  };
}
export function getApprove() {
  return {
    type: GET_APPROVE,
  };
}
export function getApproveSuccess(data, currentUser) {
  return {
    type: GET_APPROVE_SUCCESS,
    data,
  };
}
export function getApproveFailure(err, message) {
  return {
    type: GET_APPROVE_FAILURE,
    err,
    message,
  };
}

export function cleanup(err, message) {
  return {
    type: CLEANUP,
    err,
    message,
  };
}
