import { GET_MEETING_SCHEDULE, GET_MEETING_SCHEDULE_SUCCESS, GET_MEETING_SCHEDULE_FAILURE, UPDATE_SCHEDULE, UPDATE_SCHEDULE_SUCCESS, UPDATE_SCHEDULE_FAILURE, CLEANUP, ADD_SCHEDULE, ADD_SCHEDULE_FAILURE, ADD_SCHEDULE_SUCCESS } from "./constants";


export function getMeetingSchelude(data) {
    
  return {

    type: GET_MEETING_SCHEDULE,
    data
  };

}


export function getMeetingScheludeSuccess(data) {

  return {
    type: GET_MEETING_SCHEDULE_SUCCESS,
    data,
  }
}
export function getMeetingScheludeFailure() {
  return {
    type: GET_MEETING_SCHEDULE_FAILURE,
    data,
  }
}

export function addScheduleMettingSchedule(data) {
  return {
    type: ADD_SCHEDULE,
    data,
  }
}

export function addScheduleMettingSuccess(data) {
  return {
    type: ADD_SCHEDULE_SUCCESS,
    data,
  }
}
export function addScheduleMettingFailure(data) {
  return {
    type: ADD_SCHEDULE_FAILURE,
    data,
  }
}

export function updateScheduleMettingSchedule(data) {
  return {
    type: UPDATE_SCHEDULE,
    data,
  }
}


export function updateScheduleMettingScheduleSuccess(data) {
  return {
    type: UPDATE_SCHEDULE_SUCCESS,
    data,
  }
}
export function updateScheduleMettingScheduleFailure(data) {
  return {
    type: UPDATE_SCHEDULE_FAILURE,
    data,
  }
}

export function onClean(data) {
  return {
    type: CLEANUP,
  }
}