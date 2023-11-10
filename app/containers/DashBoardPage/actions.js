/*
 *
 * DashBoardPage actions
 *
 */

import { GET_REPORT, GET_REPORT_SUCCESS, GET_REPORT_FAILURE } from './constants';

export function getReport(query) {
  return {
    type: GET_REPORT,
    query,
  };
}

export function getReportSuccess(data) {
  return {
    type: GET_REPORT_SUCCESS,
    data,
  };
}


export function getReportFailure() {
  return {
    type: GET_REPORT_FAILURE,
  };
}
