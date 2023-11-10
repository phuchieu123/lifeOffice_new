import { produce } from 'immer';
import { GET_ADVANCE_REQUIRE, GET_ADVANCE_REQUIRE_FAILURE, GET_ADVANCE_REQUIRE_SUCCESS } from './constants';


export const initialState = {
  isLoading: false,
  inTernalFinace: null,
};
/* eslint-disable default-case, no-param-reassign */
const inTernalFinanceReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_ADVANCE_REQUIRE:
        draft.isLoading = true;
        draft.inTernalFinace = null;
        draft.internal = {};
        break;
      case GET_ADVANCE_REQUIRE_SUCCESS:
        draft.isLoading = false;
        draft.inTernalFinace = true
        draft.internal = action.data;
        break;
      case GET_ADVANCE_REQUIRE_FAILURE:
        draft.isLoading = false;
        draft.inTernalFinace = false;
        break;
    }
  });

export default inTernalFinanceReducer;