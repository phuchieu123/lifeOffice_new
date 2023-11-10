import { takeLatest, call, put, select } from 'redux-saga/effects';

import { APP_URL, API_NOTIFICATION, API_READ_ALL_NOTIFICATION } from '../../configs/Paths';
import { serialize } from '../../utils/common';
import * as actions from './actions';
import request from '../../utils/request';
import * as constants from './constants';
import { REQUEST_METHOD } from '../../utils/constants';
import { getNotification } from '../App/actions';
import ToastCustom from '../../components/ToastCustom';

export function* fetchNotifications(action) {
  const { query } = action;
  try {
    const url = `${yield API_NOTIFICATION()}?${serialize(query)}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);

    if (response) {
      yield put(actions.getNotificationsSuccess(response));
    } else {
      yield put(actions.getNotificationsFailure());
    }
  } catch (err) {

    yield put(actions.getNotificationsFailure(err));
  }
}

export function* updateNotification(action) {
  const { data } = action;
  try {
    const url = `${yield API_NOTIFICATION()}/${data._id}`;
    const body = {
      method: REQUEST_METHOD.PUT,
      body: JSON.stringify(data),
    };
    const response = yield call(request, url, body);

    yield put(actions.updateNotificationSuccess(response));
    yield put(getNotification());
  } catch (err) {
    yield put(actions.updateNotificationFailure(err));
  }
}

export function* readAllNotification() {
  try {
    const url = `${yield API_READ_ALL_NOTIFICATION()}`;

    const body = {
      method: REQUEST_METHOD.GET,
      // body: JSON.stringify({ filter: { isRead: false } }),
    };

    const response = yield call(request, url, body);

    if (response) {
      yield put(actions.readAllFinish(response));
      yield put({type: constants.POSTREADALL_SUCCESS});
    }
  } catch (err) {
    yield put(actions.readAllFinish(err));
  }
}




// Individual exports for testing
export default function* notificationPageSaga() {
  yield takeLatest(constants.GET_NOTIFICATIONS, fetchNotifications);
  yield takeLatest(constants.UPDATE_NOTIFICATION, updateNotification);
  yield takeLatest(constants.POSTREADALL, readAllNotification);
}
