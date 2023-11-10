/*
 *
 * KanbanProjectPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';
import lodash from 'lodash';
import { parseTreeMapData } from '../../utils/common';

export const initialState = {
  isLoading: false,
  kanbanData: [],
  updateProjectSuccess: null,
};

/* eslint-disable default-case, no-param-reassign */
const kanbanProjectPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.GET_PROJECT:
        draft.isLoading = true;
        break;
      case constants.GET_PROJECT_SUCCESS:
        draft.isLoading = false;
        const { flatData } = action.data;
        if (flatData.length > 0) {
          const treeData = parseTreeMapData(flatData);
          const project = treeData[0];

          if (project) {
            const kanban = lodash.sortBy(project.children, ['order']).map((item, index) => ({
              ...item,
              ...{ code: `DATA.${index}` },
            }));
            const groupedData = lodash.groupBy(flatData.filter(c => c._id !== project._id), 'kanbanCode');

            draft.kanbanData = kanban.map(item => ({
              ...item,
              ...{ children: groupedData[item.code] || [] },
            }));
            draft.kanbanOption = kanban;
          }
        } else {
          draft.kanbanData = [];
          draft.kanbanOption = [];
        }
        break;

      case constants.GET_PROJECT_FAILURE:
        draft.isLoading = false;
        draft.kanbanData = [];
        draft.kanbanOption = [];
        break;

      case constants.UPDATE_PROJECT:
        draft.updateProjectSuccess = null;
        break;
      case constants.UPDATE_PROJECT_SUCCESS:
        draft.updateProjectSuccess = true;
        break;
      case constants.UPDATE_PROJECT_FAILURE:
        draft.updateProjectSuccess = false;
        break;

      case constants.CLEANUP:
        draft.isLoading = false;
        draft.updateProjectSuccess = null;
        draft.kanbanData = [];
        break;
    }
  });

export default kanbanProjectPageReducer;
