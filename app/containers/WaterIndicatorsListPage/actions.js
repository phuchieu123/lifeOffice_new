/*
 *
 * WaterIndicatorListPage actions
 *
 */

import * as constants from './constants';

export function getWaterIndicatorLists(query, isLoadMore) {
  return {
    type: constants.GET_WATERINDICATORSLISTS,
    query,
    isLoadMore,
  };
}

export function getWaterIndicatorListsSuccess(data) {
  return {
    type: constants.GET_WATERINDICATORSLISTS_SUCCESS,
    data,
  };
}

export function getWaterIndicatorListsFailure(error) {
  return {
    type: constants.GET_WATERINDICATORSLISTS_FAILURE,
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
