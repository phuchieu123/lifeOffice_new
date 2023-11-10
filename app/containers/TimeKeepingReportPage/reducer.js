/*
 *
 * LoginPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  timeKeepingReportData: null,
  timeKeepingReportEquipmentData: null,
  timeKeepingLateEarlyData: null,
  absentReportData: null,
};

const timeKeepingReportPage = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case constants.CLEANUP:
        break;
      case constants.GET_TIMEKEEPING_REPORT:
        draft.isLoading = true;
        draft.timeKeepingReportData = null;
        break;
      case constants.GET_TIMEKEEPING_REPORT_SUCCESS:
        draft.isLoading = false;
        draft.timeKeepingReportData = action.data;
        break;
      case constants.GET_TIMEKEEPING_REPORT_FAILURE:
        draft.loading = false;
        break;
      case constants.GET_TIMEKEEPING_REPORT_EQUIPMENT:
        draft.isLoading = true;
        draft.timeKeepingReportEquipmentData = null;
        break;
      case constants.GET_TIMEKEEPING_REPORT_EQUIPMENT_SUCCESS:
        draft.isLoading = false;
        draft.timeKeepingReportEquipmentData = action.data;
        break;
      case constants.GET_TIMEKEEPING_REPORT_EQUIPMENT_FAILURE:
        draft.loading = false;
        break;
      case constants.GET_TIMEKEEPING_REPORT_LATEEARLY:
        draft.isLoading = true;
        draft.timeKeepingLateEarlyData = null;
        break;
      case constants.GET_TIMEKEEPING_REPORT_LATEEARLY_SUCCESS:
        draft.isLoading = false;
        draft.timeKeepingLateEarlyData = action.data;
        break;
      case constants.GET_TIMEKEEPING_REPORT_LATEEARLY_FAILURE:
        draft.loading = false;
        break;
      case constants.GET_ABSENT_REPORT:
        draft.isLoading = true;
        draft.absentReportData = null;
        break;
      case constants.GET_ABSENT_REPORT_SUCCESS:
        draft.isLoading = false;
        draft.absentReportData = action.data;
        break;
      case constants.GET_ABSENT_REPORT_FAILURE:
        draft.loading = false;
        break;
    }
  });

export default timeKeepingReportPage;
