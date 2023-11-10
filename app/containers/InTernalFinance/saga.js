import { GET_ADVANCE_REQUIRE, GET_ADVANCE_REQUIRE_FAILURE, GET_ADVANCE_REQUIRE_SUCCESS } from './constants';
import { takeLatest, call, put } from 'redux-saga/effects';
import { API_ADVANCE_REQUIRE } from '../../configs/Paths';
import request from '../../utils/request';
import { getAdvanceRequireSuccess, getAdvanceRequireFailure } from './actions';
import * as actions from './actions';
// import { act } from 'react-test-renderer'; /// impổt linh tinh dân đế lỗi

export function* fetchInternalFinace(action) {
  try {
    const { data } = action;

    const url = `${yield API_ADVANCE_REQUIRE()}/${data.route.params.project._id}`
    const body = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(request, url, body);
    if (response) {
      yield put(actions.getAdvanceRequireSuccess(response));
    }
    else {
      yield put(actions.getAdvanceRequireFailure());
    }
  }
  catch (err) {
    yield put(actions.getAdvanceRequireFailure(err));
  }
}
export default function* inTernalFinaceSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_ADVANCE_REQUIRE, fetchInternalFinace);

}