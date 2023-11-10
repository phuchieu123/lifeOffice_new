import { produce } from 'immer';
import actions, { MERGE_DATA, CLEAN } from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const messageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case MERGE_DATA:
        Object.keys(action.data).map(key => {
          draft[key] = action.data[key]
        })
        break
      case CLEAN:
        draft.conversation = null
        break
    }
  });

export default messageReducer;
