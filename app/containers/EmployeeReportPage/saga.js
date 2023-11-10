import { takeLatest, call, put, select } from 'redux-saga/effects';
import * as constants from './constants';
import * as actions from './actions';
import request from '../../utils/request';
import API, { API_REPORT_HRM_COUNT_BY_ORG } from '../../configs/Paths';
import { REQUEST_METHOD } from '../../utils/constants';
import { serialize, getLogString } from '../../utils/common';
import { getProfile } from '../../utils/authen';
import { makeSelectKanbanData } from '../App/selectors';

export function* getEmployeeReportAge(action) {
  const { query } = action;
  try {
    //////////////////////////////////

    const data = [
      {
        key: 1,
        amount: 50,
        svg: { fill: '#600080' },
        title: '18-24',
      },
      {
        key: 2,
        amount: 50,
        svg: { fill: '#9900cc' },
        title: '25-34',
      },
      {
        key: 3,
        amount: 40,
        svg: { fill: '#c61aff' },
        title: '35-44',
      },
      {
        key: 4,
        amount: 90,
        svg: { fill: '#d966ff' },
        title: '45-54',
      },
      {
        key: 5,
        amount: 20,
        svg: { fill: '#ecb3ff' },
        title: '55-65',
      },
      {
        key: 6,
        amount: 20,
        svg: { fill: '#ffb3ff' },
        title: 'khác',
      },
    ];
    //////////////////////////////////
    const url = ''; // const url = `${yield API_()}?${serialize(query)}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    // const response = yield call(request, url, body);
    const response = { data };

    yield put(actions.getEmployeeReportAgeSuccess(response.data));
  } catch (err) {
    yield put(actions.getEmployeeReportAgeFailure(err));
  }
}
export function* getEmployeeReportBirth(action) {
  //////////////////////////////////

  //////////////////////////////////
  const { query } = action;
  try {
    const url = ''; // const url = `${yield API_()}?${serialize(query)}`;

    const body = {
      method: REQUEST_METHOD.GET,
    };

    // const response = yield call(request, url, body);
    const response = { data: null };

    yield put(actions.getEmployeeReportBirthSuccess(response.data));
  } catch (err) {
    yield put(actions.getEmployeeReportBirthFailure(err));
  }
}
export function* getEmployeeReportGender(action) {
  //////////////////////////////////

  const data = [
    {
      key: 1,
      amount: 50,
      svg: { fill: '#600080' },
      title: 'Nam',
    },
    {
      key: 2,
      amount: 50,
      svg: { fill: '#9900cc' },
      title: 'Nữ',
    },
    {
      key: 3,
      amount: 40,
      svg: { fill: '#c61aff' },
      title: 'Không xác định',
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
    const response = { data };

    yield put(actions.getEmployeeReportGenderSuccess(response.data));
  } catch (err) {
    yield put(actions.getEmployeeReportGenderFailure(err));
  }
}
export function* getEmployeeReportSkill(action) {
  //////////////////////////////////

  const data = [
    {
      key: 1,
      amount: 50,
      svg: { fill: '#600080' },
      title: 'Tiến sĩ',
    },
    {
      key: 2,
      amount: 50,
      svg: { fill: '#9900cc' },
      title: 'Thạc sĩ',
    },
    {
      key: 3,
      amount: 40,
      svg: { fill: '#c61aff' },
      title: 'Đại học',
    },
    {
      key: 4,
      amount: 90,
      svg: { fill: '#d966ff' },
      title: 'Cao đẳng',
    },
    {
      key: 5,
      amount: 20,
      svg: { fill: '#ecb3ff' },
      title: 'Trung cấp',
    },
    {
      key: 6,
      amount: 20,
      svg: { fill: '#ffb3ff' },
      title: 'Tốt nghiệp PTTH',
    },
    {
      key: 7,
      amount: 20,
      svg: { fill: '#ffb3dd' },
      title: 'Tốt nghiệp PTCS',
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
    const response = { data };

    yield put(actions.getEmployeeReportSkillSuccess(response.data));
  } catch (err) {
    yield put(actions.getEmployeeReportSkillFailure(err));
  }
}
export function* getEmployeeReportContract(action) {
  //////////////////////////////////

  const data = [
    {
      key: 1,
      amount: 50,
      svg: { fill: '#600080' },
      title: 'Hợp đồng mùa vụ',
    },
    {
      key: 2,
      amount: 50,
      svg: { fill: '#9900cc' },
      title: 'Hợp đồng thử việc',
    },
    {
      key: 3,
      amount: 40,
      svg: { fill: '#c61aff' },
      title: 'Hợp đồng chính thức',
    },
    {
      key: 4,
      amount: 90,
      svg: { fill: '#d966ff' },
      title: 'Không xác định',
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
    const response = { data };

    yield put(actions.getEmployeeReportContractSuccess(response.data));
  } catch (err) {
    yield put(actions.getEmployeeReportContractFailure(err));
  }
}
export function* getFillterDepartment() {
  try {
    const url = `${yield API_REPORT_HRM_COUNT_BY_ORG()}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };
    const response = yield call(request, url, body);
    yield put(actions.getHrmEmplyeReportHrmCountSuccess(response));
  } catch (err) {
    yield put(actions.getHrmEmplyeReportHrmCountFailure(err));
  }
}






export default function* employeeReportPageSaga() {
  yield takeLatest(constants.GET_EMPLOYEE_REPORT_AGE, getEmployeeReportAge);
  yield takeLatest(constants.GET_EMPLOYEE_REPORT_BIRTH, getEmployeeReportBirth);
  yield takeLatest(constants.GET_EMPLOYEE_REPORT_GENDER, getEmployeeReportGender);
  yield takeLatest(constants.GET_EMPLOYEE_REPORT_SKILL, getEmployeeReportSkill);
  yield takeLatest(constants.GET_EMPLOYEE_REPORT_CONTRACT, getEmployeeReportContract);
  yield takeLatest(constants.GET_HRMEMPLOYEE_REPORT_HRM_COUNT, getFillterDepartment);
}
