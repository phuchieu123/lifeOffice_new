/*
 *
 * ApprovePage actions
 *
 */

import { ADD_APPROVE, ADD_APPROVE_FAILURE, ADD_APPROVE_FAILURE_ISLOADING, ADD_APPROVE_ISLOADING, ADD_APPROVE_OVER_TIME, ADD_APPROVE_OVER_TIME_FAILURE, ADD_APPROVE_OVER_TIME_SUCCESS, ADD_APPROVE_SUCCESS, ADD_APPROVE_SUCCESS_ISLOADING, ADD_MEETING_SCHEDULE, ADD_MEETING_SCHEDULE_FAILURE, ADD_MEETING_SCHEDULE_SUCCESS, ADD_ON_LEAVE, ADD_ON_LEAVE_FAILURE, ADD_ON_LEAVE_SUCCESS, APPROVE_ADD_ON_LEAVE, APPROVE_ADD_ON_LEAVE_FAILURE, APPROVE_ADD_ON_LEAVE_SUCCESS, APPROVE_MEETING_SCHEDULE, APPROVE_MEETING_SCHEDULE_FAILURE, APPROVE_MEETING_SCHEDULE_SUCCESS, CLEANUP } from './constants';

export function addApprove(data) {
  return {
    type: ADD_APPROVE,
    data,
  };
}
export function addApproveSuccess() {
  return {
    type: ADD_APPROVE_SUCCESS,
  };
}
export function addApproveFailure() {
  return {
    type: ADD_APPROVE_FAILURE,
  };
}




export function addApproveOverTime(data) {
  return {
    type: ADD_APPROVE_OVER_TIME,
    data,
  };
}
export function addApproveOverTimeSuccess(data) {
  return {
    type: ADD_APPROVE_OVER_TIME_SUCCESS,
    data
  };
}
export function addApproveOverTimeFailure() {
  return {
    type: ADD_APPROVE_OVER_TIME_FAILURE,
  };
}




export function addApproveIsloadingSuccess(data) {

  return {
    type: ADD_APPROVE_SUCCESS_ISLOADING,
    data
  };
}





export function addMeetingSchedule(data) {
  return {
    type: ADD_MEETING_SCHEDULE,
    data,
  };
}
export function addMeetingScheduleSuccess() {
  return {
    type: ADD_MEETING_SCHEDULE_SUCCESS,
  };
}
export function addMeetingScheduleFailure() {
  return {
    type: ADD_MEETING_SCHEDULE_FAILURE,
  };
}





export function approveMeetingSchedule(data) {

  return {
    type: APPROVE_MEETING_SCHEDULE,
    data,
  };
}
export function approveMeetingScheduleSuccess() {
  return {
    type: APPROVE_MEETING_SCHEDULE_SUCCESS,
  };
}
export function approveMeetingScheduleFailure() {
  return {
    type: APPROVE_MEETING_SCHEDULE_FAILURE,
  };
}











export function onleave(data) {

  return {
    type: ADD_ON_LEAVE,
    data,
  };
}
export function onleaveSuccess() {
  return {
    type: ADD_ON_LEAVE_SUCCESS,
  };
}
export function onleaveFailure() {
  return {
    type: ADD_ON_LEAVE_FAILURE,
  };
}




export function apprOveonleave(data) {
  return {
    type: APPROVE_ADD_ON_LEAVE,
    data,
  };
}
export function approveOnleaveSuccess() {
  return {
    type: APPROVE_ADD_ON_LEAVE_SUCCESS,
  };
}
export function approveOnleaveFailure() {
  return {
    type: APPROVE_ADD_ON_LEAVE_FAILURE,
  };
}





export function cleanup() {
  return {
    type: CLEANUP,
  };
}








