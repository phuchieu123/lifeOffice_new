/*
 *
 * ProjectDetailPage actions
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

export function getTemplate(data) {
  return {
    type: constants.GET_TEMPLATE,
    data,
  };
}

export function getTemplateSuccess(data) {
  return {
    type: constants.GET_TEMPLATE_SUCCESS,
    data,
  };
}

export function getTemplateFailure(error) {
  return {
    type: constants.GET_TEMPLATE_FAILURE,
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

export function updateProjectProgress(data) {
  return {
    type: constants.UPDATE_PROJECT_PROGRESS,
    data,
  };
}

export function updateProjectProgressSuccess(data) {
  return {
    type: constants.UPDATE_PROJECT_PROGRESS_SUCCESS,
    data,
  };
}

export function updateProjectProgressFailure(error) {
  return {
    type: constants.UPDATE_PROJECT_PROGRESS_FAILURE,
    error,
  };
}

export function updateTransfer(data) {
  return {
    type: constants.UPDATE_TRANSFER,
    data,
  };
}

export function updateTransferSuccess(data) {
  return {
    type: constants.UPDATE_TRANSFER_SUCCESS,
    data,
  };
}

export function updateTransferFailure(error) {
  return {
    type: constants.UPDATE_TRANSFER_FAILURE,
    error,
  };
}

export function uploadFile(data) {
  return {
    type: constants.UPLOAD_FILE,
    data,
  };
}

export function uploadFileSuccess(data) {
  return {
    type: constants.UPLOAD_FILE_SUCCESS,
    data,
  };
}

export function uploadFileFailure(error) {
  return {
    type: constants.UPLOAD_FILE_FAILURE,
    error,
  };
}

export function getProjectTransfer(data) {
  return {
    type: constants.GET_PROJECT_TRANSFER,
    data,
  };
}

export function getProjectTransferSuccess(data) {
  return {
    type: constants.GET_PROJECT_TRANSFER_SUCCESS,
    data,
  };
}

export function getProjectTransferFailure(error) {
  return {
    type: constants.GET_PROJECT_TRANSFER_FAILURE,
    error,
  };
}

export function getProjectFiles(data) {
  return {
    type: constants.GET_PROJECT_FILES,
    data,
  };
}

export function getProjectFilesSuccess(data) {
  return {
    type: constants.GET_PROJECT_FILES_SUCCESS,
    data,
  };
}

export function getProjectFilesFailure(error) {
  return {
    type: constants.GET_PROJECT_FILES_FAILURE,
    error,
  };
}

export function changeTransferType(index) {
  return {
    type: constants.CHANGE_TRANSFER_TYPE,
    index,
  };
}

export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}
