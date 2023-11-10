import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectEmployeeReportPageDomain = state => state.employeeReportPage || initialState;

const makeSelectEmployeeReportPage = () =>
  createSelector(
    selectEmployeeReportPageDomain,
    substate => substate,
  );

export default makeSelectEmployeeReportPage;
export { selectEmployeeReportPageDomain };
