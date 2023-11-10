import { call, put, takeLatest } from 'redux-saga/effects';
import * as actions from './actions';
import * as constants from './constants';
import request from '../../utils/request';
import { APP_URL, API_COMMENT } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import { parseTreeMapData, serialize } from '../../utils/common';

export function* fetchComments(action) {
  const { data } = action;

  try {
    const url = `${yield API_COMMENT()}?${serialize(data)}`;

    const body = {
      method: REQUEST_METHOD.GET,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = yield call(request, url, body);
    if (response) {
      const treeData = parseTreeMapData(response.data);
      yield put(actions.getCommentsSuccess(treeData));
    } else {
      yield put(actions.getCommentsFailure());
    }
  } catch (err) {
    yield put(actions.getCommentsFailure(err));
  }
}

export function* sendComment(action) {
  
  const { data } = action;
  try {
    const url = `${yield API_COMMENT()}`;

    const body = {
      method: REQUEST_METHOD.POST,
      body: JSON.stringify(data),
    };
    const response = yield call(request, url, body);
    if (response) {
      yield put(actions.sendCommentSuccess(response));
    } else {
      yield put(actions.sendCommentFailure());
    }
  } catch (err) {
    yield put(actions.sendCommentFailure(err));
  }
}

export function* deleteComment(action) {
  
  id = action.data;
  console.log("ID SAGA", id);
  try {
    const url = `${yield API_COMMENT()}/${id}`;
    const body = {
      method: REQUEST_METHOD.DELETE,
      
    };
    const response = yield call(request, url, body);
    if (response) {
      yield put(actions.deleteCommentSuccess(response));
    } else {
      yield put(actions.deleteCommentFailure());
    }
  } catch (err) {
    yield put(actions.deleteCommentFailure(err));
  }
}

// Individual exports for testing
export default function* commentViewSaga() {
  console.log(444);
  yield takeLatest(constants.GET_COMMENTS, fetchComments);
  yield takeLatest(constants.SEND_COMMENT, sendComment);
  yield takeLatest(constants.DELETE_COMMENT, deleteComment);
}
