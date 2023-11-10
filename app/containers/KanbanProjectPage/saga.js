import { call, put, takeLatest } from 'redux-saga/effects';

import * as actions from './actions';
import * as constants from './constants';
import request from '../../utils/request';
import { API_TASK } from '../../configs/Paths';
import { serialize } from '../../utils/common';
import { REQUEST_METHOD } from '../../utils/constants';

export function* fetchProject(params) {
  const { data } = params;

  try {
    const url = `${yield API_TASK()}/projects?${serialize(data)}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };
    const response = yield call(request, url, body);
    if (response) {
      const flatData = response.data;
      yield put(actions.getProjectSuccess({ flatData, parentId: data.filter.projectId }));
    } else {
      yield put(actions.getProjectFailure());
    }
  } catch (err) {
    

    
    yield put(actions.getProjectFailure(err));
  }
}

export function* updateProject(action) {
  const { data } = action;

  try {
    const url = `${yield API_TASK()}/${data._id}`;
    const body = {
      method: REQUEST_METHOD.PATCH,
      body: JSON.stringify({ kanbanCode: data.kanbanCode }),
    };

    const response = yield call(request, url, body);
    if (response.success) {
      yield put(actions.updateProjectSuccess(response));
    } else {
      yield put(actions.updateProjectFailure(response));
    }
  } catch (err) {
  
    yield put(actions.updateProjectFailure(err));
  }
}

// Individual exports for testing
export default function* kanbanProjectPageSaga() {
  yield takeLatest(constants.GET_PROJECT, fetchProject);
  yield takeLatest(constants.UPDATE_PROJECT, updateProject);
}
