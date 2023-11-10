/*
 *
 * AddElectricIndicatorPage actions
 *
 */

import * as constants from './constants';

export function createElectricIndicator(data) {
  return {
    type: constants.CREATE_ELECTRICINDICATOR,
    data,
  };
}

export function createElectricIndicatorSuccess(data) {
  return {
    type: constants.CREATE_ELECTRICINDICATOR_SUCCESS,
    data,
  };
}

export function createElectricIndicatorFailure() {
  return {
    type: constants.CREATE_ELECTRICINDICATOR_FAILURE,
  };
}

export function clean() {
  return {
    type: constants.CLEAN,
  };
}
