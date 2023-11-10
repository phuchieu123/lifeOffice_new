/*
 *
 * BusinessOpDetailPage actions
 *
 */

import * as constants from './constants';

export function getBusinessOpportunity(data) {
  return {
    type: constants.GET_BUSINESS_OPPORTUNITY,
    data,
  };
}

export function getBusinessOpportunitySuccess(data) {
  return {
    type: constants.GET_BUSINESS_OPPORTUNITY_SUCCESS,
    data,
  };
}

export function getBusinessOpportunityFailure(data) {
  return {
    type: constants.GET_BUSINESS_OPPORTUNITY_FAILURE,
    data,
  };
}

export function createBusinessOpportunity(data) {
  return {
    type: constants.CREATE_BUSINESS_OPPORTUNITY,
    data,
  };
}

export function createBusinessOpportunitySuccess(data) {
  return {
    type: constants.CREATE_BUSINESS_OPPORTUNITY_SUCCESS,
    data,
  };
}

export function createBusinessOpportunityFailure(data) {
  return {
    type: constants.CREATE_BUSINESS_OPPORTUNITY_FAILURE,
    data,
  };
}

export function updateBusinessOpportunity(data) {
  return {
    type: constants.UPDATE_BUSINESS_OPPORTUNITY,
    data,
  };
}

export function updateBusinessOpportunitySuccess(data) {
  return {
    type: constants.UPDATE_BUSINESS_OPPORTUNITY_SUCCESS,
    data,
  };
}

export function updateBusinessOpportunityFailure(data) {
  return {
    type: constants.UPDATE_BUSINESS_OPPORTUNITY_FAILURE,
    data,
  };
}

export function createCustomer(data) {
  return {
    type: constants.CREATE_CUSTOMER,
    data,
  };
}

export function createCustomerSuccess(data) {
  return {
    type: constants.CREATE_CUSTOMER_SUCCESS,
    data,
  };
}

export function createCustomerFailure(data) {
  return {
    type: constants.CREATE_CUSTOMER_FAILURE,
    data,
  };
}

export function getBusinessOpportunityLogs(query) {
  return {
    type: constants.GET_BUSINESS_OPPORTUNITY_LOGS,
    query,
  };
}

export function getBusinessOpportunityLogsSuccess(data) {
  return {
    type: constants.GET_BUSINESS_OPPORTUNITY_LOGS_SUCCESS,
    data,
  };
}

export function getBusinessOpportunityLogsFailure(data) {
  return {
    type: constants.GET_BUSINESS_OPPORTUNITY_LOGS_FAILURE,
    data,
  };
}

export function createLog(data) {
  return {
    type: constants.CREATE_LOG,
    data,
  };
}

export function createLogSuccess(data) {
  return {
    type: constants.CREATE_LOG_SUCCESS,
    data,
  };
}

export function createLogFailure(data) {
  return {
    type: constants.CREATE_LOG_FAILURE,
    data,
  };
}

export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}

export function getStock(data) {
  return {
    type: constants.GET_STOCK,
    data,
  }
}
export function getStockSuccess(data) {
  return {
    type: constants.GET_STOCK_SUCCESS,
    data
  }
}
export function getStockFailure(error) {
  return {
    type: constants.GET_STOCK_FAILURE,
    error
  }
}





export function salleLog(data) {
  return {
    type: constants.SALLE_LOG,
    data,
  };
}

export function salleLogSuccess(data) {
  return {
    type: constants.SALLE_LOG_SUCCESS,
    data,
  };
}

export function salleLogFailure(data) {
  return {
    type: constants.SALLE_LOG_FAILURE,
    data,
  };
}