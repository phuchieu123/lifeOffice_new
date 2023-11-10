import * as constants from './constants';

export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}

export function getTimeKeepingHistory(query) {
  return {
    type: constants.GET_TIMEKEEPING_HISTORY_DATA,
    query,
  };
}

export function getTimeKeepingHistorySuccess(data) {
  return {
    type: constants.GET_TIMEKEEPING_HISTORY_DATA_SUCCESS,
    data,
  };
}

export function getTimeKeepingHistoryFailure(data) {
  return {
    type: constants.GET_TIMEKEEPING_HISTORY_DATA_FAILURE,
    data,
  };
}

export function getTimeKeepingBoard(query) {
  return {
    type: constants.GET_TIMEKEEPING_BOARD_DATA,
    query,
  };
}

export function getTimeKeepingBoardSuccess(data) {
  return {
    type: constants.GET_TIMEKEEPING_BOARD_DATA_SUCCESS,
    data,
  };
}

export function getTimeKeepingBoardFailure(data) {
  return {
    type: constants.GET_TIMEKEEPING_BOARD_DATA_FAILURE,
    data,
  };
}

export function getTimeKeepingDayoffs(query) {
  return {
    type: constants.GET_TIMEKEEPING_DAYOFFS_DATA,
    query,
  };
}

export function getTimeKeepingDayoffsSuccess(data) {
  return {
    type: constants.GET_TIMEKEEPING_DAYOFFS_DATA_SUCCESS,
    data,
  };
}

export function getTimeKeepingDayoffsFailure(data) {
  return {
    type: constants.GET_TIMEKEEPING_DAYOFFS_DATA_FAILURE,
    data,
  };
}

export function getTimeKeepingPaycheck(query) {
  return {
    type: constants.GET_TIMEKEEPING_PAYCHECK,
    query,
  };
}

export function getTimeKeepingPaycheckSuccess(data) {
  return {
    type: constants.GET_TIMEKEEPING_PAYCHECK_SUCCESS,
    data,
  };
}

export function getTimeKeepinPaycheckFailure(data) {
  return {
    type: constants.GET_TIMEKEEPING_PAYCHECK_FAILURE,
    data,
  };
}

export function getAllSalaryFormula() {
  return {
    type: constants.GET_ALL_SALARY_FORMULA
  }
}
export function getAllSalaryFormulaSuccess(data) {
  return {
    type: constants.GET_ALL_SALARY_FORMULA_SUCCESS,
    data
  }
}
export function getAllSalaryFormulaFailure(error) {
  return {
    type: constants.GET_ALL_SALARY_FORMULA_FAILURE,
    error
  }
}