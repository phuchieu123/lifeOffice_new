/*
 *
 * PersonnelPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  departments: [],
  users: {},
};

const personnelPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.GET_LIST_DEPARTMENT:
        break;
      case constants.GET_LIST_DEPARTMENT_SUCCESS:
        draft.departments = action.data;
        draft.getDepartmentSuccess = true;
        break;
      case constants.GET_LIST_DEPARTMENT_FAILURE:
        draft.departments = [];
        draft.getDepartmentSuccess = false;
        break;
      case constants.GET_ALL_USER:
        draft.isLoading = true;
        break;
      case constants.GET_ALL_USER_SUCCESS:
        draft.users = action.data;
        draft.isLoading = false;
        break;
      case constants.GET_ALL_USER_FAILURE:
        draft.users = {};
        draft.isLoading = false;
        break;
      case constants.GET_LIST_PERSONNEL:
        draft.isLoading = true;
        draft.departments = null;
        break;

      case constants.GET_LIST_PERSONNEL_SUCCESS:
        draft.isLoading = false;
        draft.departments = action.data;
        break;
      case constants.GET_LIST_PERSONNEL_FAILURE:
        draft.isLoading = false;
        break;
    }
  });

export default personnelPageReducer;
