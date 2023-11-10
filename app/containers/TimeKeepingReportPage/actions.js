/*
 *
 * LoginPage actions
 *
 */

import * as constants from './constants';

export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}

export function getTimeKeepingReport(query) {
  return {
    type: constants.GET_TIMEKEEPING_REPORT,
    query,
  };
}

export function getTimeKeepingReportSuccess(data) {
  return {
    type: constants.GET_TIMEKEEPING_REPORT_SUCCESS,
    data,
  };
}

export function getTimeKeepingReportFailure(data) {
  return {
    type: constants.GET_TIMEKEEPING_REPORT_FAILURE,
    data,
  };
}

export function getTimeKeepingReportEquipment(query) {
  return {
    type: constants.GET_TIMEKEEPING_REPORT_EQUIPMENT,
    query,
  };
}

export function getTimeKeepingReportEquipmentSuccess(data) {
  return {
    type: constants.GET_TIMEKEEPING_REPORT_EQUIPMENT_SUCCESS,
    data,
  };
}

export function getTimeKeepingReportEquipmentFailure(data) {
  return {
    type: constants.GET_TIMEKEEPING_REPORT_EQUIPMENT_FAILURE,
    data,
  };
}

export function getTimeKeepingLateEarly(query) {
  return {
    type: constants.GET_TIMEKEEPING_REPORT_LATEEARLY,
    query,
  };
}

export function getTimeKeepingLateEarlySuccess(data) {
  return {
    type: constants.GET_TIMEKEEPING_REPORT_LATEEARLY_SUCCESS,
    data,
  };
}

export function getTimeKeepingLateEarlyFailure(data) {
  return {
    type: constants.GET_TIMEKEEPING_REPORT_LATEEARLY_FAILURE,
    data,
  };
}

export function getAbsentReport(query) {
  return {
    type: constants.GET_ABSENT_REPORT,
    query,
  };
}

export function getAbsentReportSuccess(data) {
  return {
    type: constants.GET_ABSENT_REPORT_SUCCESS,
    data,
  };
}

export function getAbsentReportFailure(data) {
  return {
    type: constants.GET_ABSENT_REPORT_FAILURE,
    data,
  };
}
