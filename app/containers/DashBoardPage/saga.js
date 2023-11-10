import { takeLatest, call, put } from 'redux-saga/effects';
import request from '../../utils/request';
import * as actions from './actions';
import * as constants from './constants';
import { serialize } from '../../utils/common';
import { REQUEST_METHOD } from '../../utils/constants';
import { API_TASK } from '../../configs/Paths';
import { getProfile } from '../../utils/authen';

export function* fetchReport(action) {
  // const { query } = action;
  const profile = yield getProfile();
  const query = {
    filter: {
      isProject: false,
      $or: [
        { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
        { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
        { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
      ],
    },
    skip: 0,
    limit: 1,
  };

  const todoFilter = serialize({
    ...query,
    filter: {
      ...query.filter,
      taskStatus: 1,
    },
  });

  // dang thuc hien
  const inProgressFilter = serialize({
    ...query,
    filter: {
      ...query.filter,
      taskStatus: 2,
    },
  });
  // da hoan thanh
  const completeFilter = serialize({
    ...query,
    filter: {
      ...query.filter,
      taskStatus: 3,
    },
  });
  try {
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const inProgressResponse = yield call(request, `${yield API_TASK()}?${inProgressFilter}`, body);
    const todoResponse = yield call(request, `${yield API_TASK()}?${todoFilter}`, body);
    const completeResponse = yield call(request, `${yield API_TASK()}?${completeFilter}`, body);

    if (inProgressResponse && todoResponse && completeResponse) {
      yield put(
        actions.getReportSuccess({
          inProgressTask: inProgressResponse,
          todoTask: todoResponse,
          completeTask: completeResponse,
        }),
      );
    } else {
      yield put(actions.getReportFailure());
    }
  } catch (err) {
    
    yield put(actions.getReportFailure(err));
  }
}
// Individual exports for testing
export default function* dashBoardPageSaga() {
  yield takeLatest(constants.GET_REPORT, fetchReport);
}
