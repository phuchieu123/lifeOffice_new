import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as constants from './constants';
import * as actions from './actions';
import request from '../../utils/request';
import API from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import { serialize, getLogString } from '../../utils/common';
import { getProfile } from '../../utils/authen';
import { makeSelectKanbanData } from '../App/selectors';

export function* getTimeKeepingReport(action) {
  const { query } = action;
  try {
    //////////////////////////////////
    const data1 = [3, 2, 3, 5].map((value) => ({ value }));
    const data2 = [2, 1, 2, 4].map((value) => ({ value }));
    const xData = ['22/3', '23/3', '24/3', '25/3'].map((value) => ({ value }));
    const yData = [1, 2, 3, 4, 5];
    const barData = [
      {
        data: data1,
        svg: {
          fill: 'green',
        },
      },
      {
        data: data2,
        svg: {
          fill: 'orange',
        },
      },
    ];
    const legendData = [
      {
        title: 'Tổng số nhân viên',
        color: 'green',
      },
      {
        title: 'Nhân viên chấm công',
        color: 'orange',
      },
    ];
    //////////////////////////////////

    const url = ''; // const url = `${yield API_()}?${serialize(query)}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    // const response = yield call(request, url, body);
    const response = { data: { xData, yData, barData, legendData } };

    yield put(actions.getTimeKeepingReportSuccess(response.data));
  } catch (err) {
    yield put(actions.getTimeKeepingReportFailure(err));
  }
}
export function* getTimeKeepingReportEquipment(action) {
  //////////////////////////////////
  const data1 = [3, 2, 3, 5].map((value) => ({ value }));
  const data2 = [2, 1, 2, 4].map((value) => ({ value }));
  const data3 = [2, 1, 2, 4].map((value) => ({ value }));
  const xData = ['22/3', '23/3', '24/3', '25/3'].map((value) => ({ value }));
  const yData = [1, 2, 3, 4, 5];
  const barData = [
    {
      data: data1,
      svg: {
        fill: 'red',
      },
    },
    {
      data: data2,
      svg: {
        fill: 'green',
      },
    },
    {
      data: data3,
      svg: {
        fill: 'yellow',
      },
    },
  ];
  const legendData = [
    {
      title: 'Điện thoại',
      color: 'red',
    },
    {
      title: 'Máy chấm công',
      color: 'green',
    },
    {
      title: 'Chấm công hộ',
      color: 'yellow',
    },
  ];
  //////////////////////////////////

  const { query } = action;
  try {
    const url = ''; // const url = `${yield API_()}?${serialize(query)}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    // const response = yield call(request, url, body);
    const response = { data: { xData, yData, barData, legendData } };

    yield put(actions.getTimeKeepingReportEquipmentSuccess(response.data));
  } catch (err) {
    yield put(actions.getTimeKeepingReportEquipmentFailure(err));
  }
}
export function* getTimeKeepingLateEarly(action) {
  //////////////////////////////////

  const data1 = [3, 2, 3, 5].map((value) => ({ value }));
  const data2 = [2, 1, 2, 4].map((value) => ({ value }));
  const xData = ['22/3', '23/3', '24/3', '25/3'].map((value) => ({ value }));
  const yData = [1, 2, 3, 4, 5];
  const barData = [
    {
      data: data1,
      svg: {
        fill: 'green',
      },
    },
    {
      data: data2,
      svg: {
        fill: 'orange',
      },
    },
  ];
  const legendData = [
    {
      title: 'Vào ca muộn',
      color: 'green',
    },
    {
      title: 'Ra ca sớm',
      color: 'orange',
    },
  ];
  //////////////////////////////////

  const { query } = action;
  try {
    const url = ''; // const url = `${yield API_()}?${serialize(query)}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    // const response = yield call(request, url, body);
    const response = { data: { xData, yData, barData, legendData } };

    yield put(actions.getTimeKeepingLateEarlySuccess(response.data));
  } catch (err) {
    yield put(actions.getTimeKeepingLateEarlyFailure(err));
  }
}
export function* getAbsentReport(action) {
  //////////////////////////////////

  const data1 = [3, 2, 3, 5].map((value) => ({ value }));
  const data2 = [2, 1, 2, 4].map((value) => ({ value }));
  const xData = ['22/3', '23/3', '24/3', '25/3'].map((value) => ({ value }));
  const yData = [1, 2, 3, 4, 5];
  const barData = [
    {
      data: data1,
      svg: {
        fill: 'green',
      },
    },
    {
      data: data2,
      svg: {
        fill: 'orange',
      },
    },
  ];
  const legendData = [
    {
      title: 'Không vào ca',
      color: 'green',
    },
    {
      title: 'Không ra ca',
      color: 'orange',
    },
  ];
  //////////////////////////////////

  const { query } = action;
  try {
    const url = ''; // const url = `${yield API_()}?${serialize(query)}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    // const response = yield call(request, url, body);
    const response = { data: { xData, yData, barData, legendData } };

    yield put(actions.getAbsentReportSuccess(response.data));
  } catch (err) {
    yield put(actions.getAbsentReportFailure(err));
  }
}

export default function* timeKeepingReportPageSaga() {
  yield takeLatest(constants.GET_TIMEKEEPING_REPORT, getTimeKeepingReport);
  yield takeLatest(constants.GET_TIMEKEEPING_REPORT_EQUIPMENT, getTimeKeepingReportEquipment);
  yield takeLatest(constants.GET_TIMEKEEPING_REPORT_LATEEARLY, getTimeKeepingLateEarly);
  yield takeLatest(constants.GET_ABSENT_REPORT, getAbsentReport);
}
