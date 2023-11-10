/*
 *
 * ApprovePage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  approveData: [],
  addApproveSuccess: null,
  addApproveOverTimeSuccess: null,
  addApproveIsloadingSuccess: null,
  addMeetingScheduleSuccess: null,
  approveMeetingScheduleSuccess: null,

  onleaveSuccess: null,
  approveOnleaveSuccess: null
};

const addApprovePageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case constants.ADD_APPROVE:
        draft.addApproveSuccess = null;
        draft.isLoading = true;
        break;
      case constants.ADD_APPROVE_SUCCESS:
        draft.addApproveSuccess = true;
        draft.isLoading = false;
        break;
      case constants.ADD_APPROVE_FAILURE:
        draft.addApproveSuccess = false;
        draft.isLoading = false;
        break;


      case constants.ADD_APPROVE_OVER_TIME:
        draft.addApproveOverTimeSuccess = null;
        draft.isLoading = true;
        break;
      case constants.ADD_APPROVE_OVER_TIME_SUCCESS:
        draft.addApproveOverTimeSuccess = true;
        draft.isLoading = false;
        break;
      case constants.ADD_APPROVE_OVER_TIME_FAILURE:
        draft.addApproveOverTimeSuccess = false;
        draft.isLoading = false;
        break;

      case constants.ADD_APPROVE_SUCCESS_ISLOADING:
        draft.addApproveIsloadingSuccess = false;
        draft.isLoading = false;
        break;



      case constants.ADD_MEETING_SCHEDULE:
        draft.addMeetingScheduleSuccess = null;
        draft.isLoading = true;
        break;
      case constants.ADD_MEETING_SCHEDULE_SUCCESS:
        draft.addMeetingScheduleSuccess = true;
        draft.isLoading = false;
        break;
      case constants.ADD_MEETING_SCHEDULE_FAILURE:
        draft.addMeetingScheduleSuccess = false;
        draft.isLoading = false;
        break;


      case constants.APPROVE_MEETING_SCHEDULE:
        draft.approveMeetingScheduleSuccess = null;
        draft.isLoading = true;
        break;
      case constants.APPROVE_MEETING_SCHEDULE_SUCCESS:
        draft.approveMeetingScheduleSuccess = true;
        draft.isLoading = false;
        break;
      case constants.APPROVE_MEETING_SCHEDULE_FAILURE:
        draft.approveMeetingScheduleSuccess = false;
        draft.isLoading = false;
        break;











      case constants.ADD_ON_LEAVE:
        draft.onleaveSuccess = null;
        draft.isLoading = true;
        break;
      case constants.ADD_ON_LEAVE_SUCCESS:
        draft.onleaveSuccess = true;
        draft.isLoading = false;
        break;
      case constants.ADD_ON_LEAVE_FAILURE:
        draft.onleaveSuccess = false;
        draft.isLoading = false;
        break;



      case constants.APPROVE_ADD_ON_LEAVE:
        draft.approveOnleaveSuccess = null;
        draft.isLoading = true;
        break;
      case constants.APPROVE_ADD_ON_LEAVE_SUCCESS:
        draft.approveOnleaveSuccess = true;
        draft.isLoading = false;
        break;
      case constants.APPROVE_ADD_ON_LEAVE_FAILURE:
        draft.approveOnleaveSuccess = false;
        draft.isLoading = false;
        break;







      case constants.CLEANUP:
        draft.addApproveSuccess = null;
        draft.notifications = {};
        draft.isLoading = false;
        break;
    }
  });

export default addApprovePageReducer;
