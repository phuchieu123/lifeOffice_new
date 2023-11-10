/*
 *
 * SettingPage reducer
 *
 */
import { produce } from 'immer';
import { DEFAULT_ACTION, UPDATE_AVATAR, UPDATE_AVATAR_FAILED, UPDATE_AVATAR_SUCCESS } from './constants';

export const initialState = {
  uploadAvatarSuccess: null,
  uploadingAvatar: null,
  avatar: null
};

/* eslint-disable default-case, no-param-reassign */
const settingPageReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case UPDATE_AVATAR:
        draft.uploadingAvatar = true
        draft.uploadAvatarSuccess = null
        break;
      case UPDATE_AVATAR_SUCCESS:
        draft.uploadingAvatar = false
        draft.uploadAvatarSuccess = true
        break;
      case UPDATE_AVATAR_FAILED:
        draft.uploadingAvatar = false
        draft.uploadAvatarSuccess = false
        break;
      case DEFAULT_ACTION:
        break;
    }
  });

export default settingPageReducer;
