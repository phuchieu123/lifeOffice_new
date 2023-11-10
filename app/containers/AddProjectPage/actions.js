/*
 *
 * AddProjectPage actions
 *
 */

import * as constants from './constants';

export function createProject(data) {
  return {
    type: constants.CREATE_PROJECT,
    data,
  };
}

export function createProjectSuccess(data) {
  return {
    type: constants.CREATE_PROJECT_SUCCESS,
    data,
  };
}

export function createProjectFailure() {
  return {
    type: constants.CREATE_PROJECT_FAILURE,
  };
}

export function clean() {
  return {
    type: constants.CLEAN,
  };
}
