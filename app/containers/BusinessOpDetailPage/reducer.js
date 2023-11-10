/*
 *
 * BusinessOpDetailPage reducer
 *
 */
import { produce } from 'immer';
import * as actions from './constants';

export const initialState = {
  businessOpDetail: {},
  newCustomer: null,
  createCustomerSuccess: null,
  isLogBusy: false,
  isBusinessLoading: false,
  createLogSuccess: null,
  salleLogSuccess: null,
  updateBusinessOpSuccess: null,
  createBusinessOpSuccess: null,
  businessOpLogs: [],
  isLoading: false,
  isCustomerLoading: false,
  isLogLoading: false,
};

const businessOpDetailPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case actions.GET_BUSINESS_OPPORTUNITY:
        draft.isLoading = true;
        break;

      case actions.GET_BUSINESS_OPPORTUNITY_SUCCESS:
        draft.isLoading = false;
        draft.businessOpDetail = action.data;
        break;
      case actions.GET_BUSINESS_OPPORTUNITY_FAILURE:
        draft.isLoading = false;
        break;

      case actions.CREATE_BUSINESS_OPPORTUNITY:
        draft.isBusinessLoading = true;
        draft.createBusinessOpSuccess = null;
        break;
      case actions.CREATE_BUSINESS_OPPORTUNITY_SUCCESS:
        draft.isBusinessLoading = false;
        draft.createBusinessOpSuccess = true;
        break;

      case actions.CREATE_BUSINESS_OPPORTUNITY_FAILURE:
        draft.isBusinessLoading = false;
        draft.createBusinessOpSuccess = false;
        break;

      case actions.UPDATE_BUSINESS_OPPORTUNITY:
        draft.isBusinessLoading = true;
        draft.updateBusinessOpSuccess = null;
        break;

      case actions.UPDATE_BUSINESS_OPPORTUNITY_SUCCESS:
        draft.isBusinessLoading = false;
        draft.updateBusinessOpSuccess = true;
        break;

      case actions.UPDATE_BUSINESS_OPPORTUNITY_FAILURE:
        draft.isBusinessLoading = false;
        draft.updateBusinessOpSuccess = false;
        break;

      case actions.CREATE_CUSTOMER:
        draft.isCustomerLoading = true;
        draft.createCustomerSuccess = null;
        draft.newCustomer = null;

        break;
      case actions.CREATE_CUSTOMER_SUCCESS:
        draft.isCustomerLoading = false;
        draft.newCustomer = action.data;
        draft.createCustomerSuccess = true;
        break;

      case actions.CREATE_CUSTOMER_FAILURE:
        draft.isCustomerLoading = false;
        draft.newCustomer = null;
        draft.createCustomerSuccess = false;
        break;

      case actions.GET_BUSINESS_OPPORTUNITY_LOGS:
        draft.businessOpLogs = [];
        draft.isLogLoading = true;

        break;
      case actions.GET_BUSINESS_OPPORTUNITY_LOGS_SUCCESS:
        draft.businessOpLogs = action.data;
        draft.isLogLoading = false;
        break;

      case actions.GET_BUSINESS_OPPORTUNITY_LOGS_FAILURE:
        draft.businessOpLogs = [];
        draft.isLogLoading = false;
        break;

      case actions.CREATE_LOG:
        draft.isLogBusy = true;
        draft.createLogSuccess = null;
        break;

      case actions.CREATE_LOG_SUCCESS:
        draft.isLogBusy = false;
        draft.createLogSuccess = true;
        const logs = [...state.businessOpLogs];
        logs.unshift(action.data);
        draft.businessOpLogs = logs;
        break;

      case actions.CREATE_LOG_FAILURE:
        draft.isLogBusy = false;
        draft.createLogSuccess = false;
        break;




      case actions.SALLE_LOG:
        draft.isLogBusy = true;
        draft.salleLogSuccess = null;
        break;

      case actions.SALLE_LOG_SUCCESS:
        draft.isLogBusy = false;
        draft.salleLogSuccess = true;
        break;

      case actions.SALLE_LOG_FAILURE:
        draft.isLogBusy = false;
        draft.salleLogSuccess = false;
        break;

      case actions.CLEANUP:
        draft.isLogLoading = false;
        draft.isCustomerLoading = false;
        draft.isLoading = false;
        draft.isLogBusy = false;
        draft.isBusinessLoading = false;
        draft.isCustomerBusy = false;
        draft.createLogSuccess = false;
        draft.businessOpDetail = {};
        draft.newCustomer = null;
        draft.createBusinessOpSuccess = null;
        draft.updateBusinessOpSuccess = null;
        draft.createCustomerSuccess = null;
        draft.businessOpLogs = [];
        break;
    }
  });

export default businessOpDetailPageReducer;
