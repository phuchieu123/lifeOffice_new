import { takeLatest, call, put } from 'redux-saga/effects';
import * as actions from './actions';
import * as constants from './constants';
import request from '../../utils/request';
import { API_TASK } from '../../configs/Paths';
import { serialize } from '../../utils/common';

export function* fetchProjects(action) {
  const { query } = action;
  try {
    const url = `${yield API_TASK()}/projects?${serialize(query)}`;
    const body = {
      method: 'GET',
    };
    const response = yield call(request, url, body);

    if (response) {
      yield put(actions.getProjectsSuccess(response.data));
    } else {
      yield put(actions.getProjectsFailure());
    }
  } catch (err) {
    
    yield put(actions.getProjectsFailure(err));
  }
}

// Individual exports for testing
export default function* projectPageSaga() {
  yield takeLatest(constants.GET_PROJECTS, fetchProjects);
}
