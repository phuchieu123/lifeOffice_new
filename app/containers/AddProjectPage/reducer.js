/*
 *
 * AddProjectPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  createProjectSuccess: null,
};

/* eslint-disable default-case, no-param-reassign */
const addProjectPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.CREATE_PROJECT:
        draft.isLoading = true;
        draft.createProjectSuccess = null;
        break;
      case constants.CREATE_PROJECT_SUCCESS:
        draft.isLoading = false;
        draft.createProjectSuccess = true;
        break;
      case constants.CREATE_PROJECT_FAILURE:
        draft.isLoading = false;
        draft.createProjectSuccess = false;
        break;
      case constants.CLEAN:
        draft.isLoading = false;
        draft.createProjectSuccess = null;
        break;
    }
  });

export default addProjectPageReducer;
