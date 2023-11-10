/*
 *
 * NotificationPage actions
 *
 */

import * as constants from './constants';

export function getNotifications(query, isLoadMore) {
  return {
    type: constants.GET_NOTIFICATIONS,
    query,
    isLoadMore,
  };
}

export function getNotificationsSuccess(data) {
  return {
    type: constants.GET_NOTIFICATIONS_SUCCESS,
    data,
  };
}

export function getNotificationsFailure(error) {
  return {
    type: constants.GET_NOTIFICATIONS_FAILURE,
    error,
  };
}

export function updateNotification(data) {
  return {
    type: constants.UPDATE_NOTIFICATION,
    data,
  };
}

export function updateNotificationSuccess(data) {
  return {
    type: constants.UPDATE_NOTIFICATION_SUCCESS,
    data,
  };
}
export function postReadAll(data) {
  return {
    type: constants.POSTREADALL,
    data,
  };
}


export function updateNotificationFailure(error) {
  return {
    type: constants.UPDATE_NOTIFICATION_FAILURE,
    error,
  };
}



export function cleanup() {
  return {
    type: constants.CLEANUP,
  };
}
export function readAllFinish(data) {

  return {
    data,
    type: constants.READALLFINISH,
  };
}
