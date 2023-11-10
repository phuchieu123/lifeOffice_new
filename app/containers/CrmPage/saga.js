import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as constants from './constants';
import * as actions from './actions';
import request from '../../utils/request';
import { API_BUSINESS_OPPORTUNITIES, API_LOGS } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import { serialize, getLogString } from '../../utils/common';
import { getProfile } from '../../utils/authen';
import { makeSelectKanbanData } from '../App/selectors';

export function* fetchBusinessOps(action) {
  const { query } = action;
  try {
    const url = `${yield API_BUSINESS_OPPORTUNITIES()}?${serialize(query)}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getBusinessOpportunitiesSuccess(response.data));
  } catch (err) {
    yield put(actions.getBusinessOpportunitiesFailure(err));
  }
}

export function* fetchBusinessOp(action) {
  const { data } = action;
  try {
    const url = `${yield API_BUSINESS_OPPORTUNITIES()}/${data._id}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getBusinessOpportunitySuccess(response));
  } catch (err) {
    yield put(actions.getBusinessOpportunityFailure(err));
  }
}

export function* updateBusinessOp(action) {
  const { data } = action;

  try {
    const businessOpUrl = `${yield API_BUSINESS_OPPORTUNITIES()}/${data._id}`;
    const businessOp = yield call(request, businessOpUrl, {
      method: REQUEST_METHOD.GET,
    });

    const url = `${yield API_BUSINESS_OPPORTUNITIES()}/${data._id}`;
    const body = {
      method: REQUEST_METHOD.PUT,
      body: JSON.stringify(data),
    };
    const updateResponse = yield call(request, url, body);
    if (updateResponse.success) {
      const profile = yield getProfile();
      const employee = {
        employeeId: profile._id,
        name: profile.name,
      };
      const kanbanData = yield select(makeSelectKanbanData());
      const newLog = {
        content: getLogString(businessOp, data, 'ST01', null, kanbanData),
        employee,
        model: 'BusinessOpportunities',
        type: 'update',
        objectId: data._id,
      };
      const logBody = {
        method: REQUEST_METHOD.POST,
        body: JSON.stringify(newLog),
      };

      yield call(request, `${yield API_LOGS()}`, logBody);
      yield put(actions.updateBusinessOpportunitySuccess(updateResponse));
    }
  } catch (err) {
    yield put(actions.updateBusinessOpportunityFailure(err));
  }
}

export function* delteBusinessOp(action) {
  const { data } = action;

  try {
    const url = `${yield API_BUSINESS_OPPORTUNITIES()}/${data._id}`;
    const body = {
      method: REQUEST_METHOD.DELETE,
    };

    const response = yield call(request, url, body);
    yield put(actions.deleteBusinessOpportunitySuccess(response));
  } catch (err) {
    yield put(actions.deleteBusinessOpportunityFailure(err));
  }
}

// Individual exports for testing
export default function* crmPageSaga() {
  yield takeLatest(constants.GET_BUSINESS_OPPORTUNITIES, fetchBusinessOps);
  yield takeLatest(constants.GET_BUSINESS_OPPORTUNITY, fetchBusinessOp);
  yield takeLatest(constants.UPDATE_BUSINESS_OPPORTUNITY, updateBusinessOp);
  yield takeLatest(constants.DELETE_BUSINESS_OPPORTUNITY, delteBusinessOp);
}
