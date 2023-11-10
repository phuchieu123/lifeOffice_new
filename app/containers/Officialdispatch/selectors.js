import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the projectDetailPage state domain
 */

const selectOfficialdispatchPageDomain = state => state.CreatDocumentary || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProjectDetailPage
 */

const makeSelectOfficialdispatchPage = () =>
  createSelector(
    selectOfficialdispatchPageDomain,

    substate => substate,
  );

export default makeSelectOfficialdispatchPage;
export { selectOfficialdispatchPageDomain };
