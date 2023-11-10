import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the businessOpDetailPage state domain
 */

const selectBusinessOpDetailPageDomain = state => state.businessOpDetailPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by BusinessOpDetailPage
 */

const makeSelectBusinessOpDetailPage = () =>
  createSelector(
    selectBusinessOpDetailPageDomain,
    substate => substate,
  );

export default makeSelectBusinessOpDetailPage;
export { selectBusinessOpDetailPageDomain };
