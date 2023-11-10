/*
 *
 * AddCarFeePage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  createCarFeeSuccess: null,
};

/* eslint-disable default-case, no-param-reassign */
const addCarFeePageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.CREATE_CARFEE:
        draft.isLoading = true;
        draft.createCarFeeSuccess = null;
        break;
      case constants.CREATE_CARFEE_SUCCESS:
        draft.isLoading = false;
        draft.createCarFeeSuccess = true;
        break;
      case constants.CREATE_CARFEE_FAILURE:
        draft.isLoading = false;
        draft.createCarFeeSuccess = false;
        break;
      case constants.CLEAN:
        draft.isLoading = false;
        draft.createCarFeeSuccess = null;
        break;
    }
  });

export default addCarFeePageReducer;
