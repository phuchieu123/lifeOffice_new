/*
 *
 * ProjectPage actions
 *
 */

import * as constants from './constants';

export function getProjects(query, isLoadMore) {
  return {
    type: constants.GET_PROJECTS,
    query,
    isLoadMore,
  };
}

export function getProjectsSuccess(data) {
  return {
    type: constants.GET_PROJECTS_SUCCESS,
    data,
  };
}

export function getProjectsFailure(error) {
  return {
    type: constants.GET_PROJECTS_FAILURE,
    error,
  };
}

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

export function cleanup(error) {
  return {
    type: constants.CLEANUP,
    error,
  };
}
