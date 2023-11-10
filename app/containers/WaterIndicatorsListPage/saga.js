import { takeLatest, call, put } from 'redux-saga/effects';

import * as actions from './actions';
import * as constants from './constants';
import request from '../../utils/request';
import { API_TASK } from '../../configs/Paths';
import { serialize } from '../../utils/common';

export function* fetchWaterIndicatorsLists(action) {
  const { query } = action;
  try {
    if (query.filter.isWaterIndicatorsList) {
      const url = `${yield API_TASK()}/waterIndicatorsLists?${serialize(query)}`;
      const body = {
        method: 'GET',
      };
      const response = yield call(request, url, body);

      if (response) {
        const flatData = response.data ? response.data.filter(c => c.isWaterIndicatorsList) : [];

        const sortedTree = flatData.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        yield put(actions.getWaterIndicatorsListsSuccess(sortedTree));
      } else {
        yield put(actions.getWaterIndicatorsListsFailure());
      }
    } else {
      const url = `${yield API_TASK()}?${serialize(query)}`;
      const body = {
        method: 'GET',
      };
      const response = yield call(request, url, body);

      if (response) {
        yield put(actions.getWaterIndicatorsListsSuccess(response.data));
      } else {
        yield put(actions.getWaterIndicatorsListsFailure());
      }
    }
  } catch (err) {
    

    
    yield put(actions.getWaterIndicatorsListsFailure(err));
  }
}

// Individual exports for testing
export default function* waterIndicatorsListPageSaga() {
  yield takeLatest(constants.GET_WATERINDICATORSLISTS, fetchWaterIndicatorsLists);
}
