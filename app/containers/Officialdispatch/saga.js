import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as constants from './constants';
import request, { fileRequest } from '../../utils/request';
import { UPLOAD_URL, INCOMING_DOCUMENT, UPLOAD_FILE, API_DOCUMENTARY } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import { serialize } from '../../utils/common';
import ToastCustom from '../../components/ToastCustom';
import moment from 'moment';
import { uploadImage } from '../../api/fileSystem';


export function* uploadFile(action) {
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
      yield put(actions.updateOfficialdispatchSuccess());
    } else {
      ToastCustom({ text: (response && response.message) ? response.message : 'Cập nhật thất bại', type: 'danger' })
      yield put(actions.updateOfficialdispatchFailure());
    }
  } catch (err) {
    ToastCustom({ text: 'Cập nhật thất bại', type: 'danger' })
    yield put(actions.updateOfficialdispatchFailure());
  }
}
export function* creatDocumentary(action) {
  let { data } = action;
  try {
    const url = yield call(API_DOCUMENTARY);
    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data),
    };

    const response = yield call(request, url, body);
    if (response) {
      ToastCustom({ text: 'Thêm công văn thành công ', type: 'success' })
      yield put(actions.uploadCreatDocumentarySuccess());
    } else {
      ToastCustom({ text: 'Thêm công văn thất bại', type: 'danger' })
      yield put(actions.uploadCreatDocumentaryFailure());
    }
  } catch (err) {
    ToastCustom({ text: 'Thêm công văn thất bại', type: 'danger' })
    yield put(actions.uploadCreatDocumentaryFailure());
  }
}



export default function* projectDetailPageSaga() {
  yield takeLatest(constants.UPDATE_OFFICIALDISPATCH, uploadFile);
  yield takeLatest(constants.UPLOAD_CREATDOCUMENTARY, creatDocumentary);
}
