import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  isLoadingMore: false,
  electricIndicators: null,
};

/* eslint-disable default-case, no-param-reassign */
const electricIndicatorPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.GET_ELECTRICINDICATORS:
        if (action.isLoadMore) {
          draft.isLoadingMore = true;
          draft.isLoading = false;
        } else {
          draft.isLoadingMore = false;
          draft.isLoading = true;
        }
        break;
      case constants.GET_ELECTRICINDICATORS_SUCCESS:
        const electricIndicators = action.data;

        if (state.isLoadingMore) {
          if (electricIndicators.length > 0) {
            draft.electricIndicators = [...state.electricIndicators, ...electricIndicators];
          }
        } else {
          draft.electricIndicators = electricIndicators;
        }
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;
      case constants.GET_ELECTRICINDICATORS_FAILURE:
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;
      case constants.GET_ELECTRICINDICATOR:
        draft.isLoading = true;
        break;
      case constants.GET_ELECTRICINDICATOR_SUCCESS:
        draft.isLoading = false;
        break;
      case constants.GET_ELECTRICINDICATOR_FAILURE:
        draft.isLoading = false;
        break;
      case constants.GET_ELECTRICINDICATOR_FAILURE:
        draft.electricIndicators = null;
        draft.isLoading = false;
        draft.isLoadingMore = false;
        break;
    }
  });

export default electricIndicatorPageReducer;
