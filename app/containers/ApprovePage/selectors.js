import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the approvePage state domain
 */

const selectApprovePageDomain = state => state.approvePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ApprovePage
 */

const makeSelectApprovePage = () =>
  createSelector(
    selectApprovePageDomain,
    substate => substate,
  );

export default makeSelectApprovePage;
export { selectApprovePageDomain };
