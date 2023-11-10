/*
 *
 * WaterIndicatorListPage actions
 *
 */

import * as constants from './constants';

export function getElectricIndicator(query, isLoadMore) {
  return {
    type: constants.GET_ELECTRICINDICATOR,
    query,
    isLoadMore,
  };
}

export function getElectricIndicatorSuccess(data) {
  return {
    type: constants.GET_ELECTRICINDICATOR_SUCCESS,
    data,
  };
}

export function getElectricIndicatorFailure(error) {
  return {
    type: constants.GET_ELECTRICINDICATOR_FAILURE,
    error,
  };
}

export function getWaterIndicatorList(data) {
  return {
    type: constants.GET_WATERINDICATORSLIST,
    data,
  };
}

export function getWaterIndicatorListSuccess(data) {
  return {
    type: constants.GET_WATERINDICATORSLIST_SUCCESS,
    data,
  };
}

export function getWaterIndicatorListFailure(error) {
  return {
    type: constants.GET_WATERINDICATORSLIST_FAILURE,
    error,
  };
}

export function cleanup(error) {
  return {
    type: constants.CLEANUP,
    error,
  };
}
