/*
 *
 * AddWaterIndicatorPage actions
 *
 */

import * as constants from './constants';

export function createWaterIndicator(data) {
  return {
    type: constants.CREATE_WATERINDICATOR,
    data,
  };
}

export function createWaterIndicatorSuccess(data) {
  return {
    type: constants.CREATE_WATERINDICATOR_SUCCESS,
    data,
  };
}

export function createWaterIndicatorFailure() {
  return {
    type: constants.CREATE_WATERINDICATOR_FAILURE,
  };
}

export function clean() {
  return {
    type: constants.CLEAN,
  };
}
