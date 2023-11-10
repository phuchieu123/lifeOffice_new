import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the meetingSchedulePage state domain
 */

const selecContractDetailsDomain = state => state.internalFinace || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MeetingSchedulePage
 */


const makeContractDetaillsPage = () =>
  createSelector(
    selecContractDetailsDomain,
    substate => substate,
  );

export default makeContractDetaillsPage;
export { selecContractDetailsDomain };
