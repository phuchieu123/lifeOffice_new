import { GET_CONTRACT_DETIAILS } from './constants';
import { takeLatest, call, put } from 'redux-saga/effects';
import { API_CONTRACT } from '../../configs/Paths';
import request from '../../utils/request';
import { getContractDetiailsFailure, getContractDetiailsSuccess } from './actions';
import * as actions from './actions';
// import { act } from 'react-test-renderer'; /// impổt linh tinh dân đế lỗi

export function* fetchContractDetails(action) {
  try {
    const { data } = action;

    const url = `${yield API_CONTRACT()}/${data.route.params.project._id}`
    const body = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(request, url, body);
    if (response) {
      yield put(actions.getContractDetiailsSuccess(response));
    }
    else {
      yield put(actions.getContractDetiailsFailure());
    }
  }
  catch (err) {
    yield put(actions.getContractDetiailsFailure(err));
  }
}
export default function* contractDetailsSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_CONTRACT_DETIAILS, fetchContractDetails);

}