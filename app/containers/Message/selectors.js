import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectMessageDomain = state => state.messagePage || initialState;

const makeSelectMessage = () =>
  createSelector(
    selectMessageDomain,
    substate => substate,
  );

export default makeSelectMessage;
export { selectMessageDomain };
