import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  isLoadingMore: false,
  waterIndicatorLists: null,
};

/* eslint-disable default-case, no-param-reassign */
const waterIndicatorListPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.GET_WATERINDICATORSLISTS:
        if (action.isLoadMore) {
          draft.isLoadingMore = true;
          draft.isLoading = false;
        } else {
          draft.isLoadingMore = false;
          draft.isLoading = true;
        }
        break;
      case constants.GET_WATERINDICATORSLISTS_SUCCESS:
        const waterIndicatorLists = action.data;

        if (state.isLoadingMore) {
          if (waterIndicatorLists.length > 0) {
            draft.waterIndicatorLists = [...state.waterIndicatorLists, ...waterIndicatorLists];
          }
        } else {
          draft.waterIndicatorLists = waterIndicatorLists;
        }
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;
      case constants.GET_WATERINDICATORSLISTS_FAILURE:
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;
      case constants.GET_WATERINDICATORSLIST:
        draft.isLoading = true;
        break;
      case constants.GET_WATERINDICATORSLIST_SUCCESS:
        draft.isLoading = false;
        break;
      case constants.GET_WATERINDICATORSLIST_FAILURE:
        draft.isLoading = false;
        break;
      case constants.GET_WATERINDICATORSLIST_FAILURE:
        draft.waterIndicatorLists = null;
        draft.isLoading = false;
        draft.isLoadingMore = false;
        break;
    }
  });

export default waterIndicatorListPageReducer;
