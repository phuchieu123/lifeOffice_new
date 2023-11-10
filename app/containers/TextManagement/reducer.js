/*
 *
 * TextManagement reducer
 *
 */

import { produce } from 'immer';
import { API_OUTGOING_DOCUMENT } from '../../configs/Paths';
import { ActionSheetIOS } from 'react-native';
import * as constants from './constants';

export const initialState = {
  localState: {
    changeApi: API_OUTGOING_DOCUMENT,
    apiDocument: [],
  },
  updateDocumentSuccess: null,
  isLoading: false,
  isBusy: false,
  configs: {},
  templatesItem: [],
};

const textManagementReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case constants.GET_DOCUMENT:
        const { data } = action;
        return {
          ...state,
          localState: {
            ...state.localState,
            changeApi: data.changeApi,
          }
        }
      case constants.GET_DOCUMENT_SUCCESS:
        return {
          ...state,
          localState: {
            ...state.localState,
            apiDocument: action.data,
          }
        }
      case constants.GET_DOCUMENT_FAILURE:
        draft.updateDocumentSuccess = false;
        draft.isBusy = false;
        break;

      case constants.UPDATE_DOCUMENT:
        draft.isBusy = true;
        draft.updateDocumentSuccess = null;
        break;
      case constants.UPDATE_DOCUMENT_SUCCESS:
        draft.updateDocumentSuccess = true;
        draft.isBusy = false;
        break;
      case constants.UPDATE_DOCUMENT_FAILURE:
        draft.updateDocumentSuccess = false;
        draft.isBusy = false;
        break;

      case constants.UPLOAD_CREATE_DOCUMENT:
        draft.isBusy = true;
        draft.updateDocumentSuccess = null;
        break;
      case constants.UPLOAD_CREATE_DOCUMENT_SUCCESS:
        draft.isBusy = false;
        draft.updateDocumentSuccess = true;
        break;
      case constants.UPLOAD_CREATE_DOCUMENT_FAILURE:
        draft.isBusy = false;
        draft.updateDocumentSuccess = false;
        break;
    }
  });

export default textManagementReducer;