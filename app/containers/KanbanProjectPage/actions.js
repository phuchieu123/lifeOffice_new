/*
 *
 * KanbanProjectPage actions
 *
 */

import * as constants from './constants';

export function getProject(data) {
  return {
    type: constants.GET_PROJECT,
    data,
  };
}

export function getProjectSuccess(data) {
  return {
    type: constants.GET_PROJECT_SUCCESS,
    data,
  };
}

export function getProjectFailure(error) {
  return {
    type: constants.GET_PROJECT_FAILURE,
    error,
  };
}

export function updateProject(data) {
  return {
    type: constants.UPDATE_PROJECT,
    data,
  };
}

export function updateProjectSuccess(data) {
  return {
    type: constants.UPDATE_PROJECT_SUCCESS,
    data,
  };
}

export function updateProjectFailure(error) {
  return {
    type: constants.UPDATE_PROJECT_FAILURE,
    error,
  };
}

export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}
