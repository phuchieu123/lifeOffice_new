import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the crmPage state domain
 */

const selectCrmPageDomain = state => state.crmPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CrmPage
 */

const makeSelectCrmPage = () =>
  createSelector(
    selectCrmPageDomain,
    substate => substate,
  );

export default makeSelectCrmPage;
export { selectCrmPageDomain };
