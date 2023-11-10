/*
 *
 * AddElectricIndicatorPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  createElectricIndicatorSuccess: null,
};

/* eslint-disable default-case, no-param-reassign */
const addElectricIndicatorPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.CREATE_ELECTRICINDICATOR:
        draft.isLoading = true;
        draft.createElectricIndicatorSuccess = null;
        break;
      case constants.CREATE_ELECTRICINDICATOR_SUCCESS:
        draft.isLoading = false;
        draft.createElectricIndicatorSuccess = true;
        break;
      case constants.CREATE_ELECTRICINDICATOR_FAILURE:
        draft.isLoading = false;
        draft.createElectricIndicatorSuccess = false;
        break;
      case constants.CLEAN:
        draft.isLoading = false;
        draft.createElectricIndicatorSuccess = null;
        break;
    }
  });

export default addElectricIndicatorPageReducer;
