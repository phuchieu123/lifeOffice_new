/*
 *
 * LoginPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  employeeReportAgeData: null,
  employeeReportBirthData: null,
  employeeReportGenderData: null,
  employeeReportSkillData: null,
  employeeReportContractData: null,
  fillterDepartment: null
};

const employeeReportPage = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case constants.CLEANUP:
        break;

      case constants.GET_EMPLOYEE_REPORT_AGE:
        draft.isLoading = true;
        draft.employeeReportAgeData = null;
        break;
      case constants.GET_EMPLOYEE_REPORT_AGE_SUCCESS:
        draft.isLoading = false;
        draft.employeeReportAgeData = action.data;
        break;
      case constants.GET_EMPLOYEE_REPORT_AGE_FAILURE:
        draft.loading = false;
        break;
      case constants.GET_EMPLOYEE_REPORT_BIRTH:
        draft.isLoading = true;
        draft.employeeReportBirthData = null;
        break;
      case constants.GET_EMPLOYEE_REPORT_BIRTH_SUCCESS:
        draft.isLoading = false;
        draft.employeeReportBirthData = action.data;
        break;
      case constants.GET_EMPLOYEE_REPORT_BIRTH_FAILURE:
        draft.loading = false;
        break;
      case constants.GET_EMPLOYEE_REPORT_GENDER:
        draft.isLoading = true;
        draft.employeeReportGenderData = null;
        break;
      case constants.GET_EMPLOYEE_REPORT_GENDER_SUCCESS:
        draft.isLoading = false;
        draft.employeeReportGenderData = action.data;
        break;
      case constants.GET_EMPLOYEE_REPORT_GENDER_FAILURE:
        draft.loading = false;
        break;
      case constants.GET_EMPLOYEE_REPORT_SKILL:
        draft.isLoading = true;
        draft.employeeReportSkillData = null;
        break;
      case constants.GET_EMPLOYEE_REPORT_SKILL_SUCCESS:
        draft.isLoading = false;
        draft.employeeReportSkillData = action.data;
        break;
      case constants.GET_EMPLOYEE_REPORT_SKILL_FAILURE:
        draft.loading = false;
        break;
      case constants.GET_EMPLOYEE_REPORT_CONTRACT:
        draft.isLoading = true;
        draft.employeeReportContractData = null;
        break;
      case constants.GET_EMPLOYEE_REPORT_CONTRACT_SUCCESS:
        draft.isLoading = false;
        draft.employeeReportContractData = action.data;
        break;
      case constants.GET_EMPLOYEE_REPORT_CONTRACT_FAILURE:
        draft.loading = false;
        break;


      case constants.GET_HRMEMPLOYEE_REPORT_HRM_COUNT:
        draft.isLoading = true;
        draft.fillterDepartment = null;
        break;
      case constants.GET_HRMEMPLOYEE_REPORT_HRM_COUNT_SUCCESS:
        draft.isLoading = false;
        draft.fillterDepartment = action.data;
        break;
      case constants.GET_HRMEMPLOYEE_REPORT_HRM_COUNT_FAILURE:
        draft.loading = false;
        break;
    }
  });

export default employeeReportPage;
