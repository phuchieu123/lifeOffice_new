/*
 *
 * TextManagement saga
 *
 */

import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as constants from './constants';
import request, { fileRequest } from '../../utils/request';
import { API_DOCUMENTARY, API_DOCUMENT_HISTORY } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import { serialize } from '../../utils/common';
import ToastCustom from '../../components/ToastCustom';
import moment from 'moment';
import { uploadImage } from '../../api/fileSystem';

export function* fetchDocument(action) {
  const { data } = action;
  const { changeApi, id } = data;
  try {
    let url = yield call(changeApi);
    url = `${url}/${id}`
    const body = {
      method: REQUEST_METHOD.GET,
    };
    const response = yield call(request, url, body);

    if (response) {
      yield put(actions.getDocumentSuccess(response));
    } else {
      yield put(actions.getDocumentFailure());
    }
  } catch (err) {

    yield put(actions.getDocumentFailure(err));
  }
}

export function* uploadDocument(action) {
  let { data } = action;
  try {
    let url = yield call(API_DOCUMENTARY);
    url = `${url}/${data._id}`
    const newData = { ...data }
    delete newData._id

    const body = {
      method: REQUEST_METHOD.PUT,
      body: JSON.stringify(newData),
    };
    const response = yield call(request, url, body);
    if (response) {
      ToastCustom({ text: 'Cập nhật thành công', type: 'success' })
      yield put(actions.updateDocumentSuccess());
    } else {
      ToastCustom({ text: (response && response.message) ? response.message : 'Cập nhật thất bại', type: 'danger' })
      yield put(actions.updateDocumentFailure());
    }
  } catch (err) {
    ToastCustom({ text: 'Cập nhật thất bại', type: 'danger' })
    yield put(actions.updateDocumentFailure());
  }
}

export function* createDocument(action) {
  let { data } = action;
  try {
    const url = yield call(API_DOCUMENTARY);
    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data),
    };

    const response = yield call(request, url, body);
    if (response) {
      ToastCustom({ text: 'Thêm văn bản thành công ', type: 'success' })
      yield put(actions.uploadCreateDocumentSuccess());
    } else {
      ToastCustom({ text: 'Thêm văn bản thất bại', type: 'danger' })
      yield put(actions.uploadCreateDocumentFailure());
    }
  } catch (err) {
    ToastCustom({ text: 'Thêm văn bản thất bại', type: 'danger' })
    yield put(actions.uploadCreateDocumentFailure());
  }
}

export default function* textManagementSaga() {
  yield takeLatest(constants.GET_DOCUMENT, fetchDocument);
  yield takeLatest(constants.UPDATE_DOCUMENT, uploadDocument);
  yield takeLatest(constants.UPLOAD_CREATE_DOCUMENT, createDocument);
}
