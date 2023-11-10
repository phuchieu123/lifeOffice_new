import { takeLatest, call, put } from 'redux-saga/effects';
import { GET_MEETING_SCHEDULE, UPDATE_SCHEDULE, ADD_SCHEDULE } from "./constants";
import { MEETING_SCHEDULE } from '../../configs/Paths';
import request from '../../utils/request';
import * as actions from './actions';
import { REQUEST_METHOD } from '../../utils/constants';
import ToastCustom from '../../components/ToastCustom';
import _ from 'lodash';

export function* fetchMeeting(action) {
  const { data } = action;

  try {
    const url = `${yield MEETING_SCHEDULE()}/${data}`

    const body = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(request, url, body);
    if (response) {
      yield put(actions.getMeetingScheludeSuccess(response));
    }
    else {
      yield put(actions.getMeetingScheludeFailure());
    }
  }
  catch (err) {
    yield put(actions.getMeetingScheludeFailure(err));
  }
}
export function* addScheduleMetting(action) {
  let { data } = action;

  try {
    const url = yield call(MEETING_SCHEDULE);
    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data),
    };

    const response = yield call(request, url, body);

    if (_.get(response, 'data._id')) {
      ToastCustom({ text: 'Thêm Lịch Họp thành công', type: 'success' })
      yield put(actions.addScheduleMettingSuccess());
      if (response.err === response.message) {
        yield put(actions.addScheduleMettingFailure());
      }
    }
    else {
      ToastCustom({ text: 'Không được dể trống người tham gia', type: 'danger' })
      yield put(actions.addScheduleMettingFailure());
    }

    // if (response) {
    //   ToastCustom({ text: 'Thêm Lịch Họp thành công', type: 'success' })
    //   yield put(actions.addScheduleMettingSuccess());
    // } else {
    //   ToastCustom({ text: 'Thêm Lịch Họp thất bại', type: 'danger' })
    //   yield put(actions.addScheduleMettingFailure());
    // }
  } catch (err) {
    ToastCustom({ text: 'Thêm Lịch Họp thất bại', type: 'danger' })
    yield put(actions.addScheduleMettingFailure());
  }
}


export function* updateScheduleMetting(action) {
  let { data } = action;

  try {
    let url = yield call(MEETING_SCHEDULE);
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
      yield put(actions.updateScheduleMettingScheduleSuccess());
    } else {
      ToastCustom({ text: (response && response.message) ? response.message : 'Cập nhật thất bại', type: 'danger' })
      yield put(actions.updateScheduleMettingScheduleFailure());
    }
  } catch (err) {
    ToastCustom({ text: 'Cập nhật thất bại', type: 'danger' })
    yield put(actions.updateScheduleMettingScheduleFailure());
  }
}


export default function* meetingSchedulePageSaga() {
  // See example in containers/HomePage/saga.js
  yield takeLatest(GET_MEETING_SCHEDULE, fetchMeeting);
  yield takeLatest(ADD_SCHEDULE, addScheduleMetting);
  yield takeLatest(UPDATE_SCHEDULE, updateScheduleMetting);
}
