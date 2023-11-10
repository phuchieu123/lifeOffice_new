/*
 *
 * AddWaterIndicatorPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  createWaterIndicatorSuccess: null,
};

/* eslint-disable default-case, no-param-reassign */
const addWaterIndicatorPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.CREATE_WATERINDICATOR:
        draft.isLoading = true;
        draft.createWaterIndicatorSuccess = null;
        break;
      case constants.CREATE_WATERINDICATOR_SUCCESS:
        draft.isLoading = false;
        draft.createWaterIndicatorSuccess = true;
        break;
      case constants.CREATE_WATERINDICATOR_FAILURE:
        draft.isLoading = false;
        draft.createWaterIndicatorSuccess = false;
        break;
      case constants.CLEAN:
        draft.isLoading = false;
        draft.createWaterIndicatorSuccess = null;
        break;
    }
  });

export default addWaterIndicatorPageReducer;
