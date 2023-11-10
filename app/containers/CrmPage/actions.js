/*
 *
 * CrmPage actions
 *
 */

import * as constants from './constants';

export function getBusinessOpportunities(query) {
  return {
    type: constants.GET_BUSINESS_OPPORTUNITIES,
    query,
  };
}

export function getBusinessOpportunitiesSuccess(data) {
  return {
    type: constants.GET_BUSINESS_OPPORTUNITIES_SUCCESS,
    data,
  };
}

export function getBusinessOpportunitiesFailure(data) {
  return {
    type: constants.GET_BUSINESS_OPPORTUNITIES_FAILURE,
    data,
  };
}

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

export function deleteBusinessOpportunity(data) {
  return {
    type: constants.DELETE_BUSINESS_OPPORTUNITY,
    data,
  };
}

export function deleteBusinessOpportunitySuccess(data) {
  return {
    type: constants.DELETE_BUSINESS_OPPORTUNITY_SUCCESS,
    data,
  };
}

export function deleteBusinessOpportunityFailure(data) {
  return {
    type: constants.DELETE_BUSINESS_OPPORTUNITY_FAILURE,
    data,
  };
}

export function cleanup(data) {
  return {
    type: constants.CLEANUP,
    data,
  };
}
