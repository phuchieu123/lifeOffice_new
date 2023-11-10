/*
 *
 * SettingPage actions
 *
 */

import { DEFAULT_ACTION, UPDATE_AVATAR, UPDATE_AVATAR_FAILED, UPDATE_AVATAR_SUCCESS } from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function updateAvatar(avatar) {
  return {
    type: UPDATE_AVATAR,
    avatar
  };
}

export function updateAvatarSuccess() {
  return {
    type: UPDATE_AVATAR_SUCCESS,
  };
}

export function updateAvatarFailed() {
  return {
    type: UPDATE_AVATAR_FAILED,
  };
}