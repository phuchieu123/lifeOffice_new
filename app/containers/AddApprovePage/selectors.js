import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectApprovePageDomain = state => state.addApprovePage || initialState;

const makeSelectApprovePage = () => createSelector(selectApprovePageDomain, substate => substate);

export default makeSelectApprovePage;
export { selectApprovePageDomain };
