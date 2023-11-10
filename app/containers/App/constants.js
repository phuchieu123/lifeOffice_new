/*
 * AppConstants
 * Each action has a corresponding type, which the reducer knows and picks up on.
 * To avoid weird typos between the reducer and the actions, we save them as
 * constants here. We prefix them with 'yourproject/YourComponent' so we avoid
 * reducers accidentally picking up actions they shouldn't.
 *
 * Follow this format:
 * export const YOUR_ACTION_CONSTANT = 'yourproject/YourContainer/YOUR_ACTION_CONSTANT';
 */

export const LOAD_CONFIG = 'app/Global/LOAD_CONFIG';
export const INIT_CONFIG = 'app/App/INIT_CONFIG';
export const MERGE_DATA = 'app/App/MERGE_DATA';
export const MERGE_CONFIG = 'app/App/MERGE_CONFIG';

export const GET_VIEW_CONFIG = 'app/Global/GET_VIEW_CONFIG';
export const GET_VIEW_CONFIG_SUCCESS = 'app/Global/GET_VIEW_CONFIG_SUCCESS';
export const GET_VIEW_CONFIG_FAILURE = 'app/Global/GET_VIEW_CONFIG_FAILURE';

export const GET_KANBAN_DATA = 'app/Global/GET_KANBAN_DATA';
export const GET_KANBAN_DATA_SUCCESS = 'app/Global/GET_KANBAN_DATA_SUCCESS';
export const GET_KANBAN_DATA_FAILURE = 'app/Global/GET_KANBAN_DATA_FAILURE';

export const GET_ROLE_TASK = 'app/Global/GET_ROLE_TASK';
export const GET_ROLE_TASK_SUCCESS = 'app/Global/GET_ROLE_TASK_SUCCESS';
export const GET_ROLE_TASK_FAILURE = 'app/Global/GET_ROLE_TASK_FAILURE';

export const GET_ROLES = 'app/Global/GET_ROLES';
export const GET_ROLES_SUCCESS = 'app/Global/GET_ROLES_SUCCESS';
export const GET_ROLES_FAILURE = 'app/Global/GET_ROLES_FAILURE';

export const GET_ROLE_BOS = 'app/Global/GET_ROLE_BOS';
export const GET_ROLE_BOS_SUCCESS = 'app/Global/GET_ROLE_BOS_SUCCESS';
export const GET_ROLE_BOS_FAILURE = 'app/Global/GET_ROLE_BOS_FAILURE';

export const GET_HRM_SOURCE = 'app/Global/GET_HRM_SOURCE';
export const GET_HRM_SOURCE_SUCCESS = 'app/Global/GET_HRM_SOURCE_SUCCESS';
export const GET_HRM_SOURCE_FAILURE = 'app/Global/GET_HRM_SOURCE_FAILURE';

export const GET_CRM_SOURCE = 'app/Global/GET_CRM_SOURCE';
export const GET_CRM_SOURCE_SUCCESS = 'app/Global/GET_CRM_SOURCE_SUCCESS';
export const GET_CRM_SOURCE_FAILURE = 'app/Global/GET_CRM_SOURCE_FAILURE';

export const GET_PROFILE = 'app/Global/GET_PROFILE';
export const INIT_SOCKET = 'app/Global/INIT_SOCKET';

export const GET_NOFICATION = 'app/Global/GET_NOFICATION';
export const UPDATE_NOFICATION = 'app/Global/UPDATE_NOFICATION';

export const LOGIN = 'app/Global/LOGIN';
export const LOGIN_SUCCESS = 'app/Global/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'app/Global/LOGIN_FAILURE';

export const SET_IS_LOADING = 'app/Global/SET_IS_LOADING';
export const SET_IS_LOGGED_IN = 'app/Global/SET_IS_LOGGED_IN';
export const LOGOUT = 'app/Global/LOGOUT';

export const GET_TASK_CONFIGS = 'app/Global/GET_TASK_CONFIGS';
export const GET_TASK_CONFIGS_SUCCESS = 'app/Global/GET_TASK_CONFIGS_SUCCESS';
export const GET_TASK_CONFIGS_FAILURE = 'app/Global/GET_TASK_CONFIGS_FAILURE';

export const GET_DEPARTMENT = 'app/Global/GET_DEPARTMENT';
export const GET_DEPARTMENT_SUCCESS = 'app/Global/GET_DEPARTMENT_SUCCESS';
export const GET_DEPARTMENT_FAILURE = 'app/Global/GET_DEPARTMENT_FAILURE';

export const GET_DRIVER_TOKEN = 'app/Global/GET_DRIVER_TOKEN';
export const GET_DRIVER_TOKEN_SUCCESS = 'app/Global/GET_DRIVER_TOKEN_SUCCESS';
export const GET_DRIVER_TOKEN_FAILURE = 'app/Global/GET_DRIVER_TOKEN_FAILURE';

export const UPDATE_LASTEST_MESSAGE = 'app/Global/UPDATE_LASTEST_MESSAGE';