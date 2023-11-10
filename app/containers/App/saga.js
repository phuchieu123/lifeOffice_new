import qs from 'qs';
import { eventChannel } from 'redux-saga';
import { call, cancel, fork, put, take, takeLatest } from 'redux-saga/effects';

import { APPROVE_ID, DRIVER_ID } from '../../../urlConfig';
import ToastCustom from '../../components/ToastCustom';
import {
  API_CRM_SOURCE,
  API_CRM_STATUS,
  API_MY_VIEW_CONFIG,
  API_ORIGANIZATION,
  API_ROLES,
  API_ROLE_BUSINESS,
  API_ROLE_TASK,
  API_SOURCE_HRMCONFIG,
  API_TASK_CONFIG,
  getConfig
} from '../../configs/Paths';
import { getProfile } from '../../utils/authen';
import { REQUEST_METHOD } from '../../utils/constants';
import { messagingUserPermission } from '../../utils/permission';
import request, { authenRequest } from '../../utils/request';
import { storeData } from '../../utils/storage';
import * as actions from './actions';
import {
  GET_CRM_SOURCE,
  GET_DEPARTMENT,
  GET_HRM_SOURCE,
  GET_KANBAN_DATA,
  GET_NOFICATION,
  GET_ROLES,
  GET_ROLE_BOS,
  GET_ROLE_TASK,
  GET_TASK_CONFIGS,
  GET_VIEW_CONFIG,
  INIT_SOCKET,
  LOGIN,
  LOGOUT,
} from './constants';

export function* fetchViewConfig() {
  try {
    const url = `${yield API_MY_VIEW_CONFIG()}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getViewConfigSuccess(response));
  } catch (err) {
    yield put(actions.getViewConfigFailure(err));
  }
}

export function* fetchKanbanData() {
  try {
    const url = `${yield API_CRM_STATUS()}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getKanbanDataSuccess(response));
  } catch (err) {
    yield put(actions.getKanbanDataFailure(err));
  }
}

export function* fetchRoleTask() {
  try {
    const info = yield getProfile();

    const url = `${yield API_ROLE_TASK()}/${info._id}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getRoleTaskSuccess(response));
  } catch (err) {
    yield put(actions.getRoleTaskFailure(err));
  }
}

export function* fetchRoles() {
  try {
    const info = yield getProfile();

    const url = `${yield API_ROLES()}/${info.userId}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };
    const response = yield call(request, url, body, true);
    if (response && response.roles) {
      yield put(actions.getRolesSuccess(response));
    }
  } catch (err) {
    yield put(actions.getRolesFailure(err));
  }
}

export function* fetchRoleBos() {
  try {
    const info = yield getProfile();

    const url = `${yield API_ROLE_BUSINESS()}/${info._id}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getRoleBosSuccess(response));
  } catch (err) {
    yield put(actions.getRoleBosFailure(err));
  }
}

export function* fetchDepartment() {
  try {

    const url = `${yield API_ORIGANIZATION()}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };
    const response = yield call(request, url, body);
    yield put(actions.getDepartmentSuccess(response));
  } catch (err) {
    yield put(actions.getDepartmentFailure(err));
  }
}

export function* fetchHrmSourceData() {
  try {
    const url = `${yield API_SOURCE_HRMCONFIG()}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getHrmSourceSuccess(response));
  } catch (err) {

    yield put(actions.getHrmSourceFailure(err));
  }
}


export function* fetchCrmSourceData() {
  try {
    const url = `${yield API_CRM_SOURCE()}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };

    const response = yield call(request, url, body);
    yield put(actions.getCrmSourceSuccess(response));
  } catch (err) {
    yield put(actions.getCrmSourceFailure(err));
  }
}

function connect(socket) {
  return new Promise((resolve) => {
    socket.on('connect', () => {
      resolve(socket);
      socket.emit('notification', {
        command: 1001,
        data: {
          skip: 0,
          limit: 10,
        },
      });
    });
  });
}

function subscribe(socket) {
  return eventChannel((emit) => {
    socket.on(socket.id, (data) => {
      emit(actions.updateNotification(data));
    });

    socket.on('notice', () => {
      socket.emit('notification', {
        command: 1001,
        data: {
          skip: 0,
          limit: 10,
        },
      });
    });

    // socket.on('docUpdated', (msg) => {
    //   getProfile().then(profile => {
    //     const { moduleCode, data } = msg;
    //     if (moduleCode === 'Employee' && data._id !== profile._id) {

    //     }
    //   })
    // });

    // socket.on('users.login', ({ username }) => {
    //   emit(addUser({ username }));
    // });
    // socket.on('users.logout', ({ username }) => {
    //   emit(removeUser({ username }));
    // });
    // socket.on('messages.new', ({ message }) => {
    //   emit(newMessage({ message }));
    // });
    // socket.on('disconnect', e => {
    //   // TODO: handle
    // });
    return () => { };
  });
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* send(socket) {
  while (true) {
    yield take(GET_NOFICATION);
    socket.emit('notification', {
      command: 1001,
      data: {
        skip: 0,
        limit: 10,
      },
    });
  }
}

function* handleIO(socket) {
  yield fork(read, socket);
  yield fork(send, socket);
}

function* flow() {
  while (true) {
    const data = yield take(INIT_SOCKET);
    const socket = yield call(connect, data.socket);
    const task = yield fork(handleIO, socket);
    yield take(LOGOUT);
    yield cancel(task);
    socket.emit('logout');
  }
}

export function* fetchLogin(params) {
  const { data } = params;

  try {
    let hostResponse = yield call(getConfig, data.hostname)

    const { appUrl, clientId, oauthUrl, domain, approveUrl, uploadUrl } = hostResponse;

    let body = {
      headers: {
        'content-Type': 'application/x-www-form-urlencoded',
      },
      method: REQUEST_METHOD.POST,
      body: qs.stringify(data),
    };
    let url = `${oauthUrl}/oauth/token`;

    const loginResponse = yield call(authenRequest, url, body);


    if (typeof loginResponse.access_token === 'string') {
      const { access_token: accessToken } = loginResponse;

      const tokenUrl =
        `${oauthUrl}/oauth/authorize?client_id=${clientId}` +
        `&allowed=true&redirect_uri=${appUrl}/api/oauth/callback&state=antiCSRF&response_type=code&scope=user`;

      const accessOtion = {
        method: REQUEST_METHOD.GET,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const tokenResponse = yield call(authenRequest, tokenUrl, accessOtion);
      if (tokenResponse.status === 'success') {
        const jwtToken = tokenResponse.data;

        const tokenOption = {
          method: REQUEST_METHOD.GET,
          headers: {
            Authorization: `Bearer ${jwtToken.token}`,
          },
        };

        let profile, dataGetToken03Driver, approveToken
        try {
          const profileUrl = `${appUrl}/api/employees/profile`;
          const driverUrl = `${oauthUrl}/oauth/authorize?client_id=${DRIVER_ID}&allowed=true&redirect_uri=${uploadUrl}/api/oauth/callback&state=antiCSRF&response_type=code&scope=user`;
          const authUrl = `${oauthUrl}/oauth/authorize?client_id=${APPROVE_ID}&allowed=true&redirect_uri=${approveUrl}/api/oauth/callback&state=antiCSRF&response_type=code&scope=user`


          profile = yield call(authenRequest, profileUrl, tokenOption);

          dataGetToken03Driver = yield call(authenRequest, driverUrl, accessOtion)

          approveToken = yield call(authenRequest, authUrl, accessOtion)

          messagingUserPermission()
        } catch (error) { }


        storeData('username', data.username);
        storeData('hostname', data.hostname);
        storeData('profile', JSON.stringify(profile));
        storeData('token', JSON.stringify(jwtToken));
        storeData('accessToken', accessToken);
        storeData('appInfo', JSON.stringify(hostResponse));
        dataGetToken03Driver && dataGetToken03Driver.status === 'success' && storeData('token_03', JSON.stringify(dataGetToken03Driver.data.token));
        approveToken && approveToken.status === 'success' && storeData('approveToken', JSON.stringify(approveToken.data.token));
        yield put(actions.loginSuccess(profile, hostResponse));
      } else {
        yield put(actions.loginFailure());
        ToastCustom({ text: "Đăng nhập thất bại", type: 'danger' });
      }
    }
  } catch (err) {
    ToastCustom({ text: "Đăng nhập thất bại", type: 'danger' });
    yield put(actions.loginFailure(err));
  }
}

export function* fetchTaskConfigs() {
  try {
    const url = `${yield API_TASK_CONFIG()}`;
    const body = {
      method: REQUEST_METHOD.GET,
    };
    const response = yield call(request, url, body);
    yield put(actions.getTaskConfigsSuccess(response));
  } catch (err) {
    yield put(actions.getTaskConfigsFailure(err));
  }
}

export default function* globalSaga() {
  yield takeLatest(LOGIN, fetchLogin);
  yield takeLatest(GET_DEPARTMENT, fetchDepartment);
  yield takeLatest(GET_VIEW_CONFIG, fetchViewConfig);
  yield takeLatest(GET_KANBAN_DATA, fetchKanbanData);
  yield takeLatest(GET_ROLE_TASK, fetchRoleTask);
  yield takeLatest(GET_ROLE_BOS, fetchRoleBos);
  yield takeLatest(GET_HRM_SOURCE, fetchHrmSourceData);
  yield takeLatest(GET_CRM_SOURCE, fetchCrmSourceData);
  yield takeLatest(GET_TASK_CONFIGS, fetchTaskConfigs);
  yield takeLatest(GET_ROLES, fetchRoles);
  // yield fork(flow);
}
