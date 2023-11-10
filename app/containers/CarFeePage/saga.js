import { takeLatest, call, put } from 'redux-saga/effects';

import * as actions from './actions';
import * as constants from './constants';
import request from '../../utils/request';
import { API_TASK } from '../../configs/Paths';
import { serialize } from '../../utils/common';

export function* fetchCarFees(action) {
  const { query } = action;
  try {
    if (query.filter.isCarFee) {
      const url = `${yield API_TASK()}/cafees?${serialize(query)}`;
      const body = {
        method: 'GET',
      };
      const response = yield call(request, url, body);

      if (response) {
        const flatData = response.data ? response.data.filter(c => c.isCarFee) : [];

        const sortedTree = flatData.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB - dateA;
        });

        yield put(actions.getCarFeesSuccess(sortedTree));
      } else {
        yield put(actions.getCarFeesFailure());
      }
    } else {
      const url = `${yield API_TASK()}?${serialize(query)}`;
      const body = {
        method: 'GET',
      };
      const response = yield call(request, url, body);

      if (response) {
        yield put(actions.getCarFeesSuccess(response.data));
      } else {
        yield put(actions.getCarFeesFailure());
      }
    }
  } catch (err) {
   

    
    yield put(actions.getCarFeesFailure(err));
  }
}

// Individual exports for testing
export default function* cafeePageSaga() {
  yield takeLatest(constants.GET_CARFEE, fetchCarFees);
}
