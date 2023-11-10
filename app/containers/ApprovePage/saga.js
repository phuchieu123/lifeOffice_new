import { takeLatest, call, put } from 'redux-saga/effects';

import { getApproveSuccess, getApprove, updateApproveFailure, getApproveFailure, updateApproveSuccess } from './actions';
import * as constants from './constants';
import request, { requestApprove } from '../../utils/request';
import { REQUEST_METHOD } from '../../utils/constants';
import { API_APPROVE, API_USERS } from '../../configs/Paths';
import { getProfile } from '../../utils/authen';
import qs from 'qs';
import _ from 'lodash'
import { serialize } from '../../utils/common';

export function* fetchApprove() {
  try {
    const approUrl = yield call(API_APPROVE);
    const approveResponse = yield call(requestApprove, `${approUrl}`, {
      method: REQUEST_METHOD.GET,
    });

    if (approveResponse) {

      let idArr = []

      approveResponse.data.forEach((item) => {
        item.groupInfo.forEach((employee) => {
          idArr.push(employee.person)
        })
      })


      idArr = _.uniq(idArr)

      const query = {
        filter: {
          userId: { $in: idArr }
        }
      }

      let userUrl = yield call(API_USERS)
      userUrl = `${userUrl}?${serialize(query)}`
      const users = yield call(request, userUrl, { method: REQUEST_METHOD.GET });
      const newData = approveResponse.data.map((item) => {
        item.groupInfo = item.groupInfo.map((employee, index) => {
          const found = users.data.find(e => e.userId === employee.person) || {}

          return {
            ...employee,
            name: found.name,
            avatar: found.avatar,
            gender: found.gender,
            order: Number.isInteger(employee.order) ? employee.order : index
          }
        });

        return item;
      });


      yield put(getApproveSuccess(newData));
    } else {
      yield put(getApproveFailure());
    }
  } catch (err) {
    yield put(getApproveFailure(err));
  }
}
export function* updateApprove(action) {
  const { approve, data } = action;
  const approUrl = yield API_APPROVE();

  try {
    const response = yield call(requestApprove, `${approUrl}/${approve._id}`, {
      method: REQUEST_METHOD.PATCH,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify(data),
    });
    if (response) {
      yield put(updateApproveSuccess());
    } else {
      yield put(updateApproveFailure());
    }
  } catch (err) {
    yield put(updateApproveFailure(err));
  }
}

// Individual exports for testing
export default function* approvePageSaga() {
  yield takeLatest(constants.GET_APPROVE, fetchApprove);
  yield takeLatest(constants.UPDATE_APPROVE, updateApprove);
}
