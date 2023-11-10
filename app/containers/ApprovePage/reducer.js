/*
 *
 * ApprovePage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';
import _ from 'lodash';

export const initialState = {
  isLoading: false,
  approveData: [],
  updateApproveSuccess: null,
  approveCount: {},
};

const approvePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.GET_APPROVE:
        draft.isLoading = true;
        break;
      case constants.GET_APPROVE_SUCCESS:
        draft.approveData = action.data;
        draft.isLoading = false;
        break;
      case constants.GET_APPROVE_FAILURE:
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;

      case constants.UPDATE_APPROVE:
        draft.updateApproveSuccess = null;
        break;
      case constants.UPDATE_APPROVE_SUCCESS:
        draft.updateApproveSuccess = true;
        break;

      case constants.UPDATE_APPROVE_FAILURE:
        draft.updateApproveSuccess = false;
        break;

      case constants.UPDATE_COUNT:
        const { approveType, count } = action
        if (!state.approveCount[approveType]) draft.approveCount[approveType] = {}
        if (count === 'loading') draft.approveCount[approveType].loading = true
        else if (count === 'end') draft.approveCount[approveType].loading = false
        else if (_.get(state, `approveCount.[${approveType}].count`) !== count) {
          draft.approveCount[approveType].count = count
          if (count > 0) draft.approveCount[approveType].width = 15 + count.toString().length * 6
        }
        break;
      case constants.CLEANUP:
        draft.updateApproveSuccess = null;
        draft.notifications = {};
        draft.isLoading = false;
        draft.isLoadingMore = false;
        break;
    }
  });

export default approvePageReducer;
