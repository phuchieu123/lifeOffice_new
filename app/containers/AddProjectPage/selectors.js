import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addProjectPage state domain
 */

const selectAddProjectPageDomain = state => state.addProjectPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddProjectPage
 */

const makeSelectAddProjectPage = () =>
  createSelector(
    selectAddProjectPageDomain,
    substate => substate,
  );

export default makeSelectAddProjectPage;
export { selectAddProjectPageDomain };
