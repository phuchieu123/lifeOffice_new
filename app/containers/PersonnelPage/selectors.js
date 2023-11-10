import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the personnelPage state domain
 */

const selectPersonnelPageDomain = state => state.DetailsPersonnel || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PersonnelPage
 */

const makeSelectDetailsPersonnelPage = () =>
  createSelector(
    selectPersonnelPageDomain,
    substate => substate,
  );

export default makeSelectDetailsPersonnelPage;
export { selectPersonnelPageDomain };
