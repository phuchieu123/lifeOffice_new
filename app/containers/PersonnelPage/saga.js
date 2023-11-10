import { call, put, takeLatest } from 'redux-saga/effects';

import { API_PERSONNEL, API_USERS, API_MY_VIEW_CONFIG, API_ORIGANIZATION } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import request from '../../utils/request';
import * as actions from './actions';
import { GET_ALL_USER, GET_LIST_DEPARTMENT, GET_CONFIG, GET_LIST_PERSONNEL_SUCCESS, GET_LIST_PERSONNEL_FAILURE, GET_LIST_PERSONNEL } from './constants';
import { serialize } from '../../utils/common';
import { filter } from 'lodash';

export function* fetchGetAllUser(actions) {
  const { query } = actions;
  const url = `${yield API_USERS()}?${serialize(query)}`

  try {
    const data = yield call(request, `${yield API_USERS()}?${serialize(query)}`, {
      method: REQUEST_METHOD.GET,
    });
    if (data) {
      yield put(fetchAllUserSuccess({ data: data.data, count: data.count, skip: data.skip, limit: data.limit }));
    }
  } catch (err) {
    yield put(fetchAllUserFailure(err));
  }
}
export function* fetchGetConfig() {
  try {
    // const departmentId = action.departmentId;
    // const userId = localStorage.getItem('userId');
    const data = yield call(request, `${API_MY_VIEW_CONFIG}`, {
      method: REQUEST_METHOD.GET,
    });
    if (data) {
      let config = [];
      data.forEach(e => {
        if (e.path === '/setting/Employee') {
          config = e.editDisplay.type.fields.type;
        }
      });
      yield put(fetchConfigSuccess(config));
    } else {
      yield put(fetchConfigFailure({}));
    }
  } catch (err) {
    yield put(fetchConfigFailure(err));
  }
}
export function* fetchUpdateConfig(action) {
  try {
    // const departmentId = action.departmentId;

    const data = yield call(request, `${API_MY_VIEW_CONFIG}5c8ea461b74423494cb0d13d`, {
      method: 'PUT',
      body: JSON.stringify(action.body),
    });
    if (data) {
      yield put(fetchUpdateConfigSuccess(data));
    } else {
      yield put(fetchUpdateConfigFailure({}));
    }
  } catch (err) {
    yield put(fetchUpdateConfigFailure(err));
  }
}

export function* fetchAllDepartment() {
  try {
    // const departmentId = action.departmentId;

    const data = yield call(request, yield API_ORIGANIZATION(), {
      method: REQUEST_METHOD.GET,
    });

    if (data) {
      yield put(fetchListDepartmentSuccess(data));
    } else {
      yield put(fetchListDepartmentFailure({}));
    }
  } catch (err) {

    yield put(fetchListDepartmentFailure(err));
  }


}
export function* fetchPersonnel(action) {
  const { data } = action;

  try {
    const url = `${yield API_PERSONNEL()}/${data}`
    const body = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = yield call(request, url, body);
    if (response) {
      yield put(actions.getchAllPersonelSuccess(response));
    }
    else {
      yield put(actions.getchAllPersonelFailure());
    }
  }
  catch (err) {
    yield put(actions.getchAllPersonelFailure(err));
  }
}


// Individual exports for testing
export default function* personnelPageSaga() {
  yield takeLatest(GET_ALL_USER, fetchGetAllUser);
  yield takeLatest(GET_LIST_DEPARTMENT, fetchAllDepartment);
  yield takeLatest(GET_CONFIG, fetchGetConfig);
  yield takeLatest(GET_LIST_PERSONNEL, fetchPersonnel)
}
