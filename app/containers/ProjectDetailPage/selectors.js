import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the projectDetailPage state domain
 */

const selectProjectDetailPageDomain = state => state.projectDetailPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProjectDetailPage
 */

const makeSelectProjectDetailPage = () =>
  createSelector(
    selectProjectDetailPageDomain,
    substate => substate,
  );

export default makeSelectProjectDetailPage;
export { selectProjectDetailPageDomain };
