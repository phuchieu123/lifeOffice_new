/*
 *
 * AddCarFeePage actions
 *
 */

import * as constants from './constants';

export function createCarFee(data) {
  return {
    type: constants.CREATE_CARFEE,
    data,
  };
}

export function createCarFeeSuccess(data) {
  return {
    type: constants.CREATE_CARFEE_SUCCESS,
    data,
  };
}

export function createCarFeeFailure() {
  return {
    type: constants.CREATE_CARFEE_FAILURE,
  };
}

export function clean() {
  return {
    type: constants.CLEAN,
  };
}
