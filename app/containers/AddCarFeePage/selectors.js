import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the addWaterIndicatorPage state domain
 */

const selectAddWaterIndicatorPageDomain = state => state.addWaterIndicatorPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by AddWaterIndicatorPage
 */

const makeSelectAddWaterIndicatorPage = () =>
  createSelector(
    selectAddWaterIndicatorPageDomain,
    substate => substate,
  );

export default makeSelectAddWaterIndicatorPage;
export { selectAddWaterIndicatorPageDomain };
