
import { call, put, takeLatest, select } from 'redux-saga/effects';
import request from '../../utils/request';
import { mergeData } from './actions';
import { API_CONVERSATION } from '../../configs/Paths';
import { CREATE_CONVERSATION } from './constants';

export function* createConversationSaga(action) {
    try {
        const url = yield API_CONVERSATION()
        const body = {
            method: 'POST',
            body: JSON.stringify(action.data),
        }
        const res = yield call(request, url, body);
        if (res.success) {
            yield put(mergeData({ conversation: res.data }));
        }
    } catch (err) { }
}

export default function* messageSaga() {
    yield takeLatest(CREATE_CONVERSATION, createConversationSaga);
}