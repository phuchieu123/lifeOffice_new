import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  isLoadingMore: false,
  carFees: null,
};

/* eslint-disable default-case, no-param-reassign */
const carFeePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.GET_CARFEES:
        if (action.isLoadMore) {
          draft.isLoadingMore = true;
          draft.isLoading = false;
        } else {
          draft.isLoadingMore = false;
          draft.isLoading = true;
        }
        break;
      case constants.GET_CARFEES_SUCCESS:
        const carFees = action.data;

        if (state.isLoadingMore) {
          if (carFees.length > 0) {
            draft.carFees = [...state.carFees, ...carFees];
          }
        } else {
          draft.carFees = carFees;
        }
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;
      case constants.GET_CARFEES_FAILURE:
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;
      case constants.GET_CARFEE:
        draft.isLoading = true;
        break;
      case constants.GET_CARFEE_SUCCESS:
        draft.isLoading = false;
        break;
      case constants.GET_CARFEE_FAILURE:
        draft.isLoading = false;
        break;
      case constants.GET_CARFEE_FAILURE:
        draft.carFees = null;
        draft.isLoading = false;
        draft.isLoadingMore = false;
        break;
    }
  });

export default carFeePageReducer;
