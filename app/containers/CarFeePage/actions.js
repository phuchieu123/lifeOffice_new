/*
 *
 * CarFeePage actions
 *
 */

import * as constants from './constants';

export function getCarFees(query, isLoadMore) {
  return {
    type: constants.GET_CARFEES,
    query,
    isLoadMore,
  };
}

export function getCarFeesSuccess(data) {
  return {
    type: constants.GET_CARFEES_SUCCESS,
    data,
  };
}

export function getCarFeesFailure(error) {
  return {
    type: constants.GET_CARFEES_FAILURE,
    error,
  };
}

export function getCarFee(data) {
  return {
    type: constants.GET_CARFEE,
    data,
  };
}

export function getCarFeeSuccess(data) {
  return {
    type: constants.GET_CARFEE_SUCCESS,
    data,
  };
}

export function getCarFeeFailure(error) {
  return {
    type: constants.GET_CARFEE_FAILURE,
    error,
  };
}

export function cleanup(error) {
  return {
    type: constants.CLEANUP,
    error,
  };
}
