import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the commentView state domain
 */

const selectCommentViewDomain = state => state.commentView || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by CommentView
 */

const makeSelectCommentView = () =>
  createSelector(
    selectCommentViewDomain,
    substate => substate,
  );

export default makeSelectCommentView;
export { selectCommentViewDomain };
