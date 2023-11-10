/*
 *
 * CrmPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  isLoadingMore: false,
  businessOps: null,
  businessOp: null,
  updateBusinessOpSuccess: null,
  deleteBusinessOpSuccess: null,
};

const crmPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.GET_BUSINESS_OPPORTUNITIES:
        // draft.isLoading = true;
        // draft.businessOps = null;
        if (action.isLoadMore) {
          draft.isLoadingMore = true;
          draft.isLoading = false;
        } else {
          draft.isLoadingMore = false;
          draft.isLoading = true;
        }
        break;
      case constants.GET_BUSINESS_OPPORTUNITIES_SUCCESS:
        const businessOps = action.data;
        const kanban = action.kanban;

        if (state.isLoadingMore) {
          if (businessOps.length > 0) {
            draft.businessOps = [...state.businessOps, ...businessOps];
          }
        } else {
          draft.businessOps = businessOps;
        }
        draft.isLoadingMore = false;
        draft.isLoading = false;
        // draft.isLoading = false;
        // draft.businessOps = action.data;
        break;
      case constants.GET_BUSINESS_OPPORTUNITIES_FAILURE:
        draft.isLoading = false;
        draft.businessOps = null;
        break;

      case constants.GET_BUSINESS_OPPORTUNITY:
        draft.isLoading = true;
        draft.businessOp = null;
        break;

      case constants.GET_BUSINESS_OPPORTUNITY_SUCCESS:
        draft.isLoading = false;
        draft.businessOp = action.data;
        break;
      case constants.GET_BUSINESS_OPPORTUNITY_FAILURE:
        draft.isLoading = false;
        draft.businessOp = null;
        break;

      case constants.UPDATE_BUSINESS_OPPORTUNITY:
        draft.isLoading = true;
        draft.updateBusinessOpSuccess = null;
        break;
      case constants.UPDATE_BUSINESS_OPPORTUNITY_SUCCESS:
        draft.isLoading = false;
        draft.updateBusinessOpSuccess = true;
        break;

      case constants.UPDATE_BUSINESS_OPPORTUNITY_FAILURE:
        draft.isLoading = false;
        draft.updateBusinessOpSuccess = false;
        break;

      case constants.DELETE_BUSINESS_OPPORTUNITY:
        draft.isLoading = true;
        draft.deleteBusinessOpSuccess = null;

        break;
      case constants.DELETE_BUSINESS_OPPORTUNITY_SUCCESS:
        draft.isLoading = false;
        draft.deleteBusinessOpSuccess = true;
        break;

      case constants.DELETE_BUSINESS_OPPORTUNITY_FAILURE:
        draft.isLoading = false;
        draft.deleteBusinessOpSuccess = false;
        break;

      case constants.CLEANUP:
        draft.isLoading = false;
        draft.businessOps = [];
        draft.businessOp = {};
        draft.updateBusinessOpSuccess = null;
        draft.deleteBusinessOpSuccess = null;
        break;
    }
  });

export default crmPageReducer;
