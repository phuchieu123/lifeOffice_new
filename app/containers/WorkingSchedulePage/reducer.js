import { produce } from 'immer';
import { GET_MEETING_SCHEDULE, GET_MEETING_SCHEDULE_SUCCESS, GET_MEETING_SCHEDULE_FAILURE, UPDATE_SCHEDULE, UPDATE_SCHEDULE_SUCCESS, UPDATE_SCHEDULE_FAILURE, CLEANUP, ADD_SCHEDULE, ADD_SCHEDULE_SUCCESS, ADD_SCHEDULE_FAILURE } from "./constants";


export const initialState = {
  isLoading: false,
  meeting: null,
};
/* eslint-disable default-case, no-param-reassign */
const meetingSchedulePageReducer = (state = initialState, action) =>

  produce(state, (draft) => {
    switch (action.type) {
      case GET_MEETING_SCHEDULE:
        draft.isLoading = true;
        draft.meeting = null;
        break;

      case GET_MEETING_SCHEDULE_SUCCESS:
        draft.isLoading = false;
        draft.meeting = action.data;
        break;
      case GET_MEETING_SCHEDULE_FAILURE:
        draft.isLoading = false;
        break;

      case ADD_SCHEDULE:
        draft.updating = true;
        draft.updateSuccess = null;
        break;
      case ADD_SCHEDULE_SUCCESS:
        draft.updating = false;
        draft.updateSuccess = true;
        break;
      case ADD_SCHEDULE_FAILURE:
        draft.updating = false;
        draft.updateSuccess = false;
        break;

      case UPDATE_SCHEDULE:
        draft.updating = true;
        draft.updateSuccess = null;
        break;
      case UPDATE_SCHEDULE_SUCCESS:
        draft.updating = false;
        draft.updateSuccess = true;
        break;
      case UPDATE_SCHEDULE_FAILURE:
        draft.updating = false;
        draft.updateSuccess = false;
        break;

      case CLEANUP:
        draft.updateSuccess = null;
        draft.meeting = null;
        break;
    }
  });

export default meetingSchedulePageReducer;
