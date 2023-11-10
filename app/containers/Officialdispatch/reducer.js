/*
 *
 * ProjectDetailPage reducer
 *
 */
import { produce } from 'immer';
import { ActionSheetIOS } from 'react-native';
import * as constants from './constants';

export const initialState = {


  updateOfficialdispatchSuccess: null,
  isLoading: false,

  isBusy: false,

  configs: {},
  templatesItem: [],
};

/* eslint-disable default-case, no-param-reassign */
const OfficialdispatchPageReducer = (state = initialState, action) =>

  produce(state, (draft) => {
    switch (action.type) {
      case constants.UPDATE_OFFICIALDISPATCH:
        draft.isBusy = true;
        draft.updateOfficialdispatchSuccess = null;
        break;
      case constants.UPDATE_OFFICIALDISPATCH_SUCCESS:
        draft.updateOfficialdispatchSuccess = true;
        draft.isBusy = false;
        break;
      case constants.UPDATE_OFFICIALDISPATCH_FAILURE:
        draft.updateOfficialdispatchSuccess = false;
        draft.isBusy = false;
        break;
      case constants.UPLOAD_CREATDOCUMENTARY:
        draft.isBusy = true;
        draft.updateOfficialdispatchSuccess = null;
        break;
      case constants.UPLOAD_CREATDOCUMENTARY_SUCCESS:
        draft.isBusy = false;
        draft.updateOfficialdispatchSuccess = true;
        break;
      case constants.UPLOAD_CREATDOCUMENTARY_FAILURE:
        draft.isBusy = false;
        draft.updateOfficialdispatchSuccess = false;
        break;
      // case constants.CLEANUP:
      //   draft.updateProjectSuccess = null;
      //   draft.updateProjectProgressSuccess = null;
      //   draft.updateTransferSuccess = null;
      //   draft.uploadFileSuccess = null;
      //   draft.projectDetail = {};
      //   draft.projectFiles = [];
      //   draft.projectTransfer = [];
      //   draft.transferType = 1;
      //   draft.isLoading = false;
      //   draft.isBusy = false;
      //   break;
    }
  });

export default OfficialdispatchPageReducer;
