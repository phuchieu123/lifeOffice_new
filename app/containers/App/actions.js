import * as constants from './constants';


export function mergeConfig(data) {
  return {
    type: constants.MERGE_CONFIG,
    data,
  };
}

export function mergeData(data) {
  return {
    type: constants.MERGE_DATA,
    data,
  };
}

export function loadConfig() {
  return {
    type: constants.LOAD_CONFIG,
  };
}

export function initConfig(viewConfig, profile) {
  return {
    type: constants.INIT_CONFIG,
    viewConfig,
    profile,
  };
}

export function getViewConfig(data) {
  return {
    type: constants.GET_VIEW_CONFIG,
    data,
  };
}

export function getViewConfigSuccess(data) {
  return {
    type: constants.GET_VIEW_CONFIG_SUCCESS,
    data,
  };
}

export function getViewConfigFailure(data) {
  return {
    type: constants.GET_VIEW_CONFIG_FAILURE,
    data,
  };
}

export function getKanbanData(data) {
  return {
    type: constants.GET_KANBAN_DATA,
    data,
  };
}

export function getKanbanDataSuccess(data) {
  return {
    type: constants.GET_KANBAN_DATA_SUCCESS,
    data,
  };
}

export function getKanbanDataFailure(data) {
  return {
    type: constants.GET_KANBAN_DATA_FAILURE,
    data,
  };
}

export function getRoleTask(data) {
  return {
    type: constants.GET_ROLE_TASK,
    data,
  };
}

export function getRoleTaskSuccess(data) {
  return {
    type: constants.GET_ROLE_TASK_SUCCESS,
    data,
  };
}

export function getRoleTaskFailure(data) {
  return {
    type: constants.GET_ROLE_TASK_FAILURE,
    data,
  };
}

export function getRoleBos(data) {
  return {
    type: constants.GET_ROLE_BOS,
    data,
  };
}

export function getRoleBosSuccess(data) {
  return {
    type: constants.GET_ROLE_BOS_SUCCESS,
    data,
  };
}

export function getRoleBosFailure(data) {
  return {
    type: constants.GET_ROLE_BOS_FAILURE,
    data,
  };
}

export function getHrmSource(data) {
  return {
    type: constants.GET_HRM_SOURCE,
    data,
  };
}

export function getHrmSourceSuccess(data) {
  return {
    type: constants.GET_HRM_SOURCE_SUCCESS,
    data,
  };
}

export function getHrmSourceFailure(data) {
  return {
    type: constants.GET_HRM_SOURCE_FAILURE,
    data,
  };
}

export function getCrmSource(data) {
  return {
    type: constants.GET_CRM_SOURCE,
    data,
  };
}

export function getCrmSourceSuccess(data) {
  return {
    type: constants.GET_CRM_SOURCE_SUCCESS,
    data,
  };
}

export function getCrmSourceFailure(data) {
  return {
    type: constants.GET_CRM_SOURCE_FAILURE,
    data,
  };
}

export function getProfile() {
  return {
    type: constants.GET_PROFILE,
  };
}

export function initSocket(socket) {
  return {
    type: constants.INIT_SOCKET,
    socket,
  };
}

export function getNotification() {
  return {
    type: constants.GET_NOFICATION,
  };
}

export function updateNotification(data) {
  return {
    type: constants.UPDATE_NOFICATION,
    data,
  };
}

export function login(data) {
  return {
    type: constants.LOGIN,
    data,
  };
}

export function loginSuccess(data, appInfo) {
  return {
    type: constants.LOGIN_SUCCESS,
    data,
    appInfo,
  };
}

export function loginFailure(data) {
  return {
    type: constants.LOGIN_FAILURE,
    data,
  };
}

export function setIsLoading(isLoading) {
  return {
    type: constants.SET_IS_LOADING,
    isLoading,
  };
}

export function setIsLoggedIn(isLoggedIn) {
  return {
    type: constants.SET_IS_LOGGED_IN,
    isLoggedIn,
  };
}

export function logout() {
  return {
    type: constants.LOGOUT,
  };
}

export function getTaskConfigs() {
  return {
    type: constants.GET_TASK_CONFIGS,
  };
}

export function getTaskConfigsSuccess(data) {
  return {
    type: constants.GET_TASK_CONFIGS_SUCCESS,
    data,
  };
}

export function getTaskConfigsFailure(data) {
  return {
    type: constants.GET_TASK_CONFIGS_FAILURE,
    data,
  };
}

export function getDepartment() {
  return {
    type: constants.GET_DEPARTMENT,
  };
}

export function getDepartmentSuccess(data) {
  return {
    type: constants.GET_DEPARTMENT_SUCCESS,
    data,
  };
}

export function getDepartmentFailure(data) {
  return {
    type: constants.GET_DEPARTMENT_FAILURE,
    data,
  };
}

export function updateLastestMessage(msg) {
  return {
    type: constants.UPDATE_LASTEST_MESSAGE,
    msg
  };
}

export function getDriverToken(data) {
  return {
    type: constants.GET_DRIVER_TOKEN,
    data,
  };
}

export function getDriverTokenSuccess(data) {
  return {
    type: constants.GET_DRIVER_TOKEN_SUCCESS,
    data,
  };
}

export function getDriverTokenFailure(msg) {
  return {
    type: constants.GET_DRIVER_TOKEN_FAILURE,
    msg
  };
}



export function getRoles(data) {
  return {
    type: constants.GET_ROLES,
    data,
  };
}

export function getRolesSuccess(data) {
  return {
    type: constants.GET_ROLES_SUCCESS,
    data,
  };
}

export function getRolesFailure(data) {
  return {
    type: constants.GET_ROLES_FAILURE,
    data,
  };
}