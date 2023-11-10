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

export function getEmployeeReportAge(query) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_AGE,
    query,
  };
}

export function getEmployeeReportAgeSuccess(data) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_AGE_SUCCESS,
    data,
  };
}

export function getEmployeeReportAgeFailure(data) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_AGE_FAILURE,
    data,
  };
}

export function getEmployeeReportBirth(query) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_BIRTH,
    query,
  };
}

export function getEmployeeReportBirthSuccess(data) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_BIRTH_SUCCESS,
    data,
  };
}

export function getEmployeeReportBirthFailure(data) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_BIRTH_FAILURE,
    data,
  };
}

export function getEmployeeReportGender(query) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_GENDER,
    query,
  };
}

export function getEmployeeReportGenderSuccess(data) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_GENDER_SUCCESS,
    data,
  };
}

export function getEmployeeReportGenderFailure(data) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_GENDER_FAILURE,
    data,
  };
}

export function getEmployeeReportSkill(query) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_SKILL,
    query,
  };
}

export function getEmployeeReportSkillSuccess(data) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_SKILL_SUCCESS,
    data,
  };
}

export function getEmployeeReportSkillFailure(data) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_SKILL_FAILURE,
    data,
  };
}

export function getEmployeeReportContract(query) {

  return {
    type: constants.GET_EMPLOYEE_REPORT_CONTRACT,
    query,
  };
}

export function getEmployeeReportContractSuccess(data) {

  return {
    type: constants.GET_EMPLOYEE_REPORT_CONTRACT_SUCCESS,
    data,
  };
}

export function getEmployeeReportContractFailure(data) {
  return {
    type: constants.GET_EMPLOYEE_REPORT_CONTRACT_FAILURE,
    data,
  };
}








export function getHrmEmplyeReportHrmCount(query) {
  return {
    type: constants.GET_HRMEMPLOYEE_REPORT_HRM_COUNT,
    query,
  };
}

export function getHrmEmplyeReportHrmCountSuccess(data) {
  return {
    type: constants.GET_HRMEMPLOYEE_REPORT_HRM_COUNT_SUCCESS,
    data,
  };
}

export function getHrmEmplyeReportHrmCountFailure(data) {

  return {
    type: constants.GET_HRMEMPLOYEE_REPORT_HRM_COUNT_FAILURE,
    data,
  };
}