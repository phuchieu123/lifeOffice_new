import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHrmReportPageDomain = state => state.hrmReportPage || initialState;

const makeSelectHrmReportPage = () =>
  createSelector(
    selectHrmReportPageDomain,
    substate => substate,
  );

export default makeSelectHrmReportPage;
export { selectHrmReportPageDomain };
