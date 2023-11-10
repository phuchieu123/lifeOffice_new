import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the hrmPage state domain
 */

const selectHrmPageDomain = state => state.hrmPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by HrmPage
 */

const makeSelectHrmPage = () =>
  createSelector(
    selectHrmPageDomain,
    substate => substate,
  );

export default makeSelectHrmPage;
export { selectHrmPageDomain };
