import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the notificationPage state domain
 */

const selectTextManagement = state => state.textManagement || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by NotificationPage
 */

const makeSelectTextManagement = () =>
  createSelector(
    selectTextManagement,
    substate => substate,
  );

export default makeSelectTextManagement;
export { selectTextManagement };