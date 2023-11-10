import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the kanbanProjectPage state domain
 */

const selectKanbanProjectPageDomain = state => state.kanbanProjectPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by KanbanProjectPage
 */

const makeSelectKanbanProjectPage = () =>
  createSelector(
    selectKanbanProjectPageDomain,
    substate => substate,
  );

export default makeSelectKanbanProjectPage;
export { selectKanbanProjectPageDomain };
