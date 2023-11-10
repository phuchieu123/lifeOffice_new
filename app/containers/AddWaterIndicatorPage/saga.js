// import { take, call, put, select } from 'redux-saga/effects';
import { takeLatest, call, put } from 'redux-saga/effects';

import * as actions from './actions';
import * as constants from './constants';
import request, { fileRequest } from '../../utils/request';
import { APP_URL, UPLOAD_URL, API_TASK } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';

export function* createWaterIndicator(action) {
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
      yield put(actions.createWaterIndicatorSuccess(response.data));
    } else {
      yield put(actions.createWaterIndicatorFailure());
    }
  } catch (err) {
    
    
    yield put(actions.createWaterIndicatorFailure(err));
  }
}

// Individual exports for testing
export default function* addWaterIndicatorPageSaga() {
  yield takeLatest(constants.CREATE_WATERINDICATOR, createWaterIndicator);
}
