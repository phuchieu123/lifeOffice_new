/*
 *
 * LoginPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  isLogIn: null,
  loginSuccess: null,
  profile: {},
};

const loginPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.CLEANUP:
        draft.isLogIn = null;
        draft.loginSuccess = null;
        draft.profile = {};
        break;
    }
  });

export default loginPageReducer;
