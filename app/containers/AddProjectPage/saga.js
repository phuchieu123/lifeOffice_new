// import { take, call, put, select } from 'redux-saga/effects';
import { takeLatest, call, put } from 'redux-saga/effects';

import * as actions from './actions';
import * as constants from './constants';
import request, { fileRequest } from '../../utils/request';
import { APP_URL, UPLOAD_URL, API_TASK, UPLOAD_IMG_SINGLE } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import moment from 'moment';
import { uploadImage } from '../../api/fileSystem';
import ToastCustom from '../../components/ToastCustom';

export function* createProject(action) {
  let { data } = action;
  let { avatar, task } = data;

  try {
    if (avatar) task.avatar = yield call(uploadImage, avatar, 'CV')
    const url = yield call(API_TASK);
    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(task),
    };

    const response = yield call(request, url, body);
    if (response.success) {
      yield put(actions.createProjectSuccess(response.data));
    } else {
      yield put(actions.createProjectFailure());
    }
  } catch (err) {
    yield put(actions.createProjectFailure(err));
    ToastCustom({ text: 'Thêm mới thất bại', type: 'warning' });


  }
}

// Individual exports for testing
export default function* addProjectPageSaga() {
  yield takeLatest(constants.CREATE_PROJECT, createProject);
}
