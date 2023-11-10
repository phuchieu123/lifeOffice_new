import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectTimeKeepingPageDomain = (state) => state.timeKeepingPage || initialState;

const makeSelectTimeKeepingPage = () => createSelector(selectTimeKeepingPageDomain, (substate) => substate);

export default makeSelectTimeKeepingPage;
export { selectTimeKeepingPageDomain };
