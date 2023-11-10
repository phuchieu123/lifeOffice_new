import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectTimeKeepingReportPageDomain = state => state.timeKeepingReportPage || initialState;

const makeSelectTimeKeepingReportPage = () =>
  createSelector(
    selectTimeKeepingReportPageDomain,
    substate => substate,
  );

export default makeSelectTimeKeepingReportPage;
export { selectTimeKeepingReportPageDomain };
