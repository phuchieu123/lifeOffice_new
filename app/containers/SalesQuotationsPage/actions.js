import { GET_DATA, GET_DATA_SUCCESS, GET_DATA_FAILURE, UPDATE_DATA, UPDATE_DATA_SUCCESS, UPDATE_DATA_FAILURE, CLEANUP, ADD_DATA, ADD_DATA_FAILURE, ADD_DATA_SUCCESS } from "./constants";


export function getSalesQuotations(data) {
  return {
    type: GET_DATA,
    data
  };
}


export function getSalesQuotationsSuccess(data) {

  return {
    type: GET_DATA_SUCCESS,
    data,
  }
}
export function getSalesQuotationsFailure() {
  return {
    type: GET_DATA_FAILURE,
    data,
  }
}

export function addSalesQuotationsSchedule(data) {
  return {
    type: ADD_DATA,
    data,
  }
}

export function addSalesQuotationsSuccess(data) {
  return {
    type: ADD_DATA_SUCCESS,
    data,
  }
}
export function addSalesQuotationsFailure(data) {
  return {
    type: ADD_DATA_FAILURE,
    data,
  }
}

export function updateSalesQuotationsSchedule(data) {
  return {
    type: UPDATE_DATA,
    data,
  }
}

export function updateSalesQuotationsScheduleSuccess(data) {
  return {
    type: UPDATE_DATA_SUCCESS,
    data,
  }
}

export function updateSalesQuotationsScheduleFailure(data) {
  return {
    type: UPDATE_DATA_FAILURE,
    data,
  }
}

export function onClean(data) {
  return {
    type: CLEANUP,
  }
}