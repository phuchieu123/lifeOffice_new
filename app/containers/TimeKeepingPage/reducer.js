/*
 *
 * LoginPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  timeKeepingHistoryData: [],
  timeKeepingBoardData: {},
  timeKeepingDayoffsData: {},
};

const timeKeepingPage = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case constants.CLEANUP:
        break;
      case constants.GET_TIMEKEEPING_HISTORY_DATA:
        draft.isLoading = true;
        draft.timeKeepingHistoryData = null;
        break;
      case constants.GET_TIMEKEEPING_HISTORY_DATA_SUCCESS:
        draft.isLoading = false;
        draft.timeKeepingHistoryData = action.data;
        break;
      case constants.GET_TIMEKEEPING_HISTORY_DATA_FAILURE:
        draft.loading = false;
        break;
      case constants.GET_TIMEKEEPING_BOARD_DATA:
        draft.isLoading = true;
        draft.timeKeepingBoardData = null;
        break;
      case constants.GET_TIMEKEEPING_BOARD_DATA_SUCCESS:
        draft.isLoading = false;
        draft.timeKeepingBoardData = action.data;
        break;
      case constants.GET_TIMEKEEPING_BOARD_DATA_FAILURE:
        draft.loading = false;
        break;
      case constants.GET_TIMEKEEPING_DAYOFFS_DATA:
        draft.isLoading = true;
        draft.timeKeepingDayoffsData = null;
        break;
      case constants.GET_TIMEKEEPING_DAYOFFS_DATA_SUCCESS:
        draft.isLoading = false;
        draft.timeKeepingDayoffsData = action.data;
        break;
      case constants.GET_TIMEKEEPING_DAYOFFS_DATA_FAILURE:
        draft.loading = false;
        break;

      case constants.GET_TIMEKEEPING_PAYCHECK:
        draft.loadingPayCheck = true;
        draft.payCheck = null;
        break;
      case constants.GET_TIMEKEEPING_PAYCHECK_SUCCESS:
        draft.loadingPayCheck = false;
        draft.payCheck = action.data;
        break;
      case constants.GET_TIMEKEEPING_PAYCHECK_FAILURE:
        draft.loadingPayCheck = false;
        break;
      case constants.GET_ALL_SALARY_FORMULA:
        draft.salaryFormula = null;
        break;
      case constants.GET_ALL_SALARY_FORMULA_SUCCESS:
        draft.salaryFormula = action.data;
        break;
    }
  });

export default timeKeepingPage;
