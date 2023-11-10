// import { take, call, put, select } from 'redux-saga/effects';
import { takeLatest, call, put } from 'redux-saga/effects';

import * as actions from './actions';
import * as constants from './constants';
import request, { fileRequest } from '../../utils/request';
import { APP_URL, UPLOAD_URL, API_TASK } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';

export function* createCarFee(action) {
  let { data } = action;

  try {
    if (data.avatar) {
      const uploadFileUrl = `${UPLOAD_URL}/api/files/single`;
      const formData = new FormData();
      formData.append('file', data.avatar);
      const fileBody = {
        method: REQUEST_METHOD.POST,
        data: formData,
      };
      const fileResponse = yield call(fileRequest, uploadFileUrl, fileBody);

      if (fileResponse.status === 200) {
        data.task.avatar = fileResponse.data.url;
      }
    }

    const url = `${yield API_TASK()}`;

    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data.task),
    };

    const response = yield call(request, url, body);

    if (response.success) {
      yield put(actions.createCarFeeSuccess(response.data));
    } else {
      yield put(actions.createCarFeeFailure());
    }
  } catch (err) {

    
    yield put(actions.createCarFeeFailure(err));
  }
}

// Individual exports for testing
export default function* addCarFeePageSaga() {
  yield takeLatest(constants.CREATE_CARFEE, createCarFee);
}
