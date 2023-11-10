import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addElectricIndicatorPage state domain
 */

const selectAddElectricIndicatorPageDomain = state => state.addElectricIndicatorPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddElectricIndicatorPage
 */

const makeSelectAddElectricIndicatorPage = () =>
  createSelector(
    selectAddElectricIndicatorPageDomain,
    substate => substate,
  );

export default makeSelectAddElectricIndicatorPage;
export { selectAddElectricIndicatorPageDomain };
