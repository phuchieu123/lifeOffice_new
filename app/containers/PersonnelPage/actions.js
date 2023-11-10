/*
 *
 * PersonnelPage actions
 *
 */

import * as constants from './constants';

export function fetchAllUser(query) {
  return {
    type: constants.GET_ALL_USER,
    query,
  };
}
export function fetchAllUserSuccess(data) {
  return {
    type: constants.GET_ALL_USER_SUCCESS,
    data,
  };
}
export function fetchAllUserFailure(err) {
  return {
    type: constants.GET_ALL_USER_FAILURE,
    err,
  };
}
export function fetchConfig(id) {
  return {
    type: constants.GET_CONFIG,
    id,
  };
}
export function fetchConfigSuccess(config) {
  return {
    type: constants.GET_CONFIG_SUCCESS,
    config,
  };
}
export function fetchConfigFailure() {
  return {
    type: constants.GET_CONFIG_FAILURE,
  };
}
export function fetchUpdateConfig(body) {
  return {
    type: constants.UPDATE_GET_CONFIG,
    body,
  };
}
export function fetchUpdateConfigSuccess(data) {
  return {
    type: constants.UPDATE_GET_CONFIG_SUCCESS,
    data,
  };
}
export function fetchUpdateConfigFailure() {
  return {
    type: constants.UPDATE_GET_CONFIG_FAILURE,
  };
}

export function fetchListDepartment(query) {
  return {
    type: constants.GET_LIST_DEPARTMENT,
    query,
  };
}
export function fetchListDepartmentSuccess(data) {
  return {
    type: constants.GET_LIST_DEPARTMENT_SUCCESS,
    data,
  };
}
export function fetchListDepartmentFailure(err) {
  return {
    type: constants.GET_LIST_DEPARTMENT_FAILURE,
    err,
  };
}


export function getchAllPersonel(data) {
  return {
    type: constants.GET_LIST_PERSONNEL,
    data,
  };
}
export function getchAllPersonelSuccess(data) {
  return {
    type: constants.GET_LIST_PERSONNEL_SUCCESS,
    data,
  };
}
export function getchAllPersonelFailure(data) {
  return {
    type: constants.GET_LIST_PERSONNEL_FAILURE,
    data,
  };
}
