/*
 *
 * ProjectPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLoading: false,
  isLoadingMore: false,
  projects: null,
};

/* eslint-disable default-case, no-param-reassign */
const projectPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.GET_PROJECTS:
        if (action.isLoadMore) {
          draft.isLoadingMore = true;
          draft.isLoading = false;
        } else {
          draft.isLoadingMore = false;
          draft.isLoading = true;
        }
        break;
      case constants.GET_PROJECTS_SUCCESS:
        const projects = action.data;

        if (state.isLoadingMore) {
          if (projects.length > 0) {
            draft.projects = [...state.projects, ...projects];
          }
        } else {
          draft.projects = projects;
        }
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;
      case constants.GET_PROJECTS_FAILURE:
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;
      case constants.GET_PROJECT:
        draft.isLoading = true;
        break;
      case constants.GET_PROJECT_SUCCESS:
        draft.isLoading = false;
        break;
      case constants.GET_PROJECT_FAILURE:
        draft.isLoading = false;
        break;
      case constants.GET_PROJECT_FAILURE:
        draft.projects = null;
        draft.isLoading = false;
        draft.isLoadingMore = false;
        break;
    }
  });

export default projectPageReducer;
