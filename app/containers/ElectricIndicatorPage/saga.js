import { takeLatest, call, put } from 'redux-saga/effects';

import * as actions from './actions';
import * as constants from './constants';
import request from '../../utils/request';
import { API_TASK } from '../../configs/Paths';
import { serialize } from '../../utils/common';

export function* fetchElectricIndicatorsLists(action) {
  const { query } = action;
  try {
    if (query.filter.isElectricIndicatorsList) {
      const url = `${yield API_TASK()}/electricIndicatorsLists?${serialize(query)}`;
      const body = {
        method: 'GET',
      };
      const response = yield call(request, url, body);

      if (response) {
        const flatData = response.data ? response.data.filter(c => c.isElectricIndicatorsList) : [];

        const sortedTree = flatData.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        yield put(actions.getElectricIndicatorsListsSuccess(sortedTree));
      } else {
        yield put(actions.getElectricIndicatorsListsFailure());
      }
    } else {
      const url = `${yield API_TASK()}?${serialize(query)}`;
      const body = {
        method: 'GET',
      };
      const response = yield call(request, url, body);

      if (response) {
        yield put(actions.getElectricIndicatorsListsSuccess(response.data));
      } else {
        yield put(actions.getElectricIndicatorsListsFailure());
      }
    }
  } catch (err) {
    

    
    yield put(actions.getElectricIndicatorsListsFailure(err));
  }
}

// Individual exports for testing
export default function* electricIndicatorsListPageSaga() {
  yield takeLatest(constants.GET_WATERINDICATORSLISTS, fetchElectricIndicatorsLists);
}
