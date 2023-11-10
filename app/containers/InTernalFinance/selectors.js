import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the meetingSchedulePage state domain
 */

const selecInternalFinanceDomain = state => state.internalFinace || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MeetingSchedulePage
 */


const makeInternalFinancePage = () =>
  createSelector(
    selecInternalFinanceDomain,
    substate => substate,
  );

export default makeInternalFinancePage;
export { selecInternalFinanceDomain };
