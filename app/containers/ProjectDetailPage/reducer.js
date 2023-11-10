/*
 *
 * ProjectDetailPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  projectDetail: {},
  projectTransfer: [],
  projectFiles: [],
  projects: [],
  updateProjectSuccess: null,
  updateProjectProgressSuccess: null,
  updateTransferSuccess: null,
  uploadFileSuccess: null,
  isLoading: false,
  isLoadingTranfer: false,
  isBusy: false,
  transferType: 1,
  configs: {},
  templatesItem: [],
};

/* eslint-disable default-case, no-param-reassign */
const projectDetailPageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case constants.GET_PROJECT:
        draft.isLoading = true;
        break;
      case constants.GET_PROJECT_SUCCESS:
        draft.projectDetail = action.data.data;
        draft.projects = action.data.projects;
        draft.isLoading = false;

        break;

      case constants.GET_PROJECT_FAILURE:
        draft.isLoading = false;
        break;

      case constants.GET_TEMPLATE_SUCCESS:
        const { configs, templatesItem } = action.data;
        draft.configs = configs;
        draft.templatesItem = templatesItem;
        break;
      case constants.GET_TEMPLATE_FAILURE:
        break;

      case constants.UPDATE_PROJECT:
        draft.isBusy = true;
        draft.updateProjectSuccess = null;
        break;
      case constants.UPDATE_PROJECT_SUCCESS:
        draft.updateProjectSuccess = true;
        draft.isBusy = false;
        break;
      case constants.UPDATE_PROJECT_FAILURE:
        draft.updateProjectSuccess = false;
        draft.isBusy = false;
        break;

      case constants.UPDATE_PROJECT_PROGRESS:
        draft.isBusy = true;
        draft.updateProjectProgressSuccess = null;
        break;
      case constants.UPDATE_PROJECT_PROGRESS_SUCCESS:
        draft.updateProjectProgressSuccess = true;
        draft.isBusy = false;
        break;
      case constants.UPDATE_PROJECT_PROGRESS_FAILURE:
        draft.updateProjectProgressSuccess = false;
        draft.isBusy = false;
        break;

      case constants.UPDATE_TRANSFER:
        draft.isBusy = true;
        draft.updateTransferSuccess = null;
        break;
      case constants.UPDATE_TRANSFER_SUCCESS:
        draft.updateTransferSuccess = true;
        draft.isBusy = false;
        break;
      case constants.UPDATE_TRANSFER_FAILURE:
        draft.updateTransferSuccess = false;
        draft.isBusy = false;
        break;
      case constants.UPLOAD_FILE:
        draft.isBusy = true;
        draft.uploadFileSuccess = null;
        break;
      case constants.UPLOAD_FILE_SUCCESS:
        draft.uploadFileSuccess = true;
        draft.isBusy = false;
        break;
      case constants.UPLOAD_FILE_FAILURE:
        draft.uploadFileSuccess = false;
        draft.isBusy = false;
        break;
      case constants.GET_PROJECT_TRANSFER:
        draft.isLoadingTranfer = true;
        break;
      case constants.GET_PROJECT_TRANSFER_SUCCESS:
        draft.projectTransfer = action.data;
        draft.isLoadingTranfer = false;
        break;
      case constants.GET_PROJECT_TRANSFER_FAILURE:
        draft.isLoadingTranfer = false;
        break;

      case constants.GET_PROJECT_FILES:
        //draft.isLoading = true;
        break;
      case constants.GET_PROJECT_FILES_SUCCESS:
        draft.projectFiles = action.data;
        //draft.isLoading = false;
        break;
      case constants.GET_PROJECT_FILES_FAILURE:
        //draft.isLoading = false;
        break;
      case constants.CHANGE_TRANSFER_TYPE:
        draft.transferType = action.index;
        break;
      case constants.CLEANUP:
        draft.updateProjectSuccess = null;
        draft.updateProjectProgressSuccess = null;
        draft.updateTransferSuccess = null;
        draft.uploadFileSuccess = null;
        draft.projectDetail = {};
        draft.projectFiles = [];
        draft.projectTransfer = [];
        draft.transferType = 1;
        draft.isLoading = false;
        draft.isBusy = false;
        break;
    }
  });

export default projectDetailPageReducer;
