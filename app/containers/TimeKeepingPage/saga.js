import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as constants from './constants';
import * as actions from './actions';
import request from '../../utils/request';
import API, { API_HISTORY_CHECK_IN, API_HISTORY_CHECK_IN1, API_PROFILE, API_SALARY_FORMULA, API_TIMEKEEPING_PAYCHECK } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import { serialize, getLogString } from '../../utils/common';
import { makeSelectKanbanData } from '../App/selectors';
import _ from 'lodash';
import moment from 'moment';
import ToastCustom from '../../components/ToastCustom';
import { getProfile } from '../../utils/authen';

const DATE = 'DD/MM/YYYY';

// export function* getTimeKeepingHistory(action) {
//   const { query } = action;
//   const newQuery = {
//     filter: {
//       createdAt: {
//         $gte: moment(query.startDate, 'YYYY-MM-DD').toISOString(),
//         $lt: moment(query.endDate, 'YYYY-MM-DD').add(1, 'day').toISOString(),
//       }
//     }
//   }

//   try {
//     const url = `${yield API_HISTORY_CHECK_IN()}?${serialize(newQuery)}`;

//     const body = {
//       method: REQUEST_METHOD.GET,
//     };

//     const response = yield call(request, url, body);

//     if (response.data) {
//       let { data } = response;

//       data = data.filter(e => _.get(e, 'timekeepingData.faceTk').length > 0)
//       data = data.map((e) => ({
//         ...e,
//         date: moment(_.get(e, 'timekeepingData.createdAt')).format(DATE)
//       }));

//       const dates = _.uniq(data.map((e) => e.date));
//       data = dates.map((date) => {
//         const dd = moment(date, DATE).day();
//         return {
//           date: `${dd ? `Thứ ${dd + 1}` : 'Chủ nhật'} ngày ${date}`,
//           data: data
//             .filter((item) => date === item.date)
//             .map((item) => ({
//               name: item.hrmEmployeeId && item.hrmEmployeeId.name,
//               // detail: 'Ca hành chính 8:00 - 17:30',
//               faceTk: _.get(item, 'timekeepingData.faceTk'),
//               // start: _.get(item, 'timekeepingData.faceTk.[0].in'),
//               // end: _.get(item, 'timekeepingData.faceTk.[0].out'),
//             })),
//         };
//       });

//       yield put(actions.getTimeKeepingHistorySuccess(data));
//     } else {
//       yield put(actions.getTimeKeepingHistoryFailure());
//     }
//   } catch (err) {

//     yield put(actions.getTimeKeepingHistoryFailure(err));
//   }
// }



export function* getTimeKeepingHistory(action) {

  const { query } = action;
  console.log('query', query);
  try {
    const info = yield getProfile();
    const url = `${yield API_HISTORY_CHECK_IN1()}/${info._id}?month=${query.month}&year=${query.year}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);

    if (response.data) {
      let { data } = response;
      yield put(actions.getTimeKeepingHistorySuccess(data));
    } else {
      yield put(actions.getTimeKeepingHistoryFailure());
    }
  } catch (err) {

    yield put(actions.getTimeKeepingHistoryFailure(err));
  }
}

export function* getTimeKeepingBoard(action) {
  const { query } = action;
  try {
    const url = ''; // const url = `${yield API_()}?${serialize(query)}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getTimeKeepingBoardSuccess(response.data));
  } catch (err) {
    yield put(actions.getTimeKeepingBoardFailure(err));
  }
}
export function* getTimeKeepingDayoffs(action) {
  /////////////////////////////////////////////////////
  const data = {
    tableHead: ['Loại nghỉ phép', 'Tổng cộng', 'Đã nghỉ', 'Còn lại'],
    tableTitle: ['Nghỉ phép tiêu chuẩn', 'Nghỉ không lương'],
    tableData: [
      ['10', '0', '10'],
      ['25', '2', '30'],
    ],
  };
  /////////////////////////////////////////////////////

  const { query } = action;
  try {
    const url = ''; // const url = `${yield API_()}?${serialize(query)}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    // const response = yield call(request, url, body);
    const response = { data };
    yield put(actions.getTimeKeepingDayoffsSuccess(response.data));
  } catch (err) {
    yield put(actions.getTimeKeepingDayoffsFailure(err));
  }
}



export function* getTimeKeepingPayCheck(action) {
  const { query } = action;
  try {
    const url = `${yield API_TIMEKEEPING_PAYCHECK()}?${serialize(query)}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getTimeKeepingPaycheckSuccess(response.data));
  } catch (err) {

    ToastCustom({ text: 'Lấy dữ liệu thất bại', type: 'warning' });
    yield put(actions.getTimeKeepinPaycheckFailure(err));
  }
}

export function* getAllSalaryFormulaSaga() {

  try {
    const url = `${yield API_SALARY_FORMULA()}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    const res = yield call(request, url, body);

    if (res && res.status === 1) {
      yield put(getAllSalaryFormulaSuccess(res.data));
    } else {
      ToastCustom({ text: 'Lấy dữ liệu thất bại', type: 'warning' });
      yield put(getAllSalaryFormulaFailure(res));
    }
  } catch (err) {

    ToastCustom({ text: 'Lấy dữ liệu thất bại', type: 'warning' });
    yield put(actions.getAllSalaryFormulaFailure(err));
  }
}

export default function* timeKeepingPageSaga() {
  yield takeLatest(constants.GET_TIMEKEEPING_HISTORY_DATA, getTimeKeepingHistory);
  yield takeLatest(constants.GET_TIMEKEEPING_BOARD_DATA, getTimeKeepingBoard);
  yield takeLatest(constants.GET_TIMEKEEPING_DAYOFFS_DATA, getTimeKeepingDayoffs);
  yield takeLatest(constants.GET_TIMEKEEPING_PAYCHECK, getTimeKeepingPayCheck);
  yield takeLatest(constants.GET_ALL_SALARY_FORMULA, getAllSalaryFormulaSaga);
}
