import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the meetingSchedulePage state domain
 */

const selectMeetingSchedulePageDomain = state => state.workingSchedulePage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by MeetingSchedulePage
 */


const makeSelectMeetingSchedulePage = () =>
  createSelector(
    selectMeetingSchedulePageDomain,
    substate => substate,
  );

export default makeSelectMeetingSchedulePage;
export { selectMeetingSchedulePageDomain };
