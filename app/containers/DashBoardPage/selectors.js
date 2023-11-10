import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the dashBoardPage state domain
 */

const selectDashBoardPageDomain = state => state.dashBoardPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by DashBoardPage
 */

const makeSelectDashBoardPage = () =>
  createSelector(
    selectDashBoardPageDomain,
    substate => substate,
  );

export default makeSelectDashBoardPage;
export { selectDashBoardPageDomain };
