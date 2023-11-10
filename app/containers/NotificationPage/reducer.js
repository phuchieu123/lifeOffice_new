/*
 *
 * NotificationPage reducer
 *
 */
import { produce } from 'immer';
import * as constants from './constants';

export const initialState = {
  notifications: {},
  updateNotificationSuccess: null,
  isLoading: false,
  isLoadingMore: false,
  reload: 0,
  loading: false,
};

const notificationPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.GET_NOTIFICATIONS:
        if (action.isLoadMore) {
          draft.isLoadingMore = true;
          draft.isLoading = false;
        } else {
          draft.isLoadingMore = false;
          draft.isLoading = true;
        }
        break;
      case constants.GET_NOTIFICATIONS_SUCCESS:
        const notifications = action.data;

        if (state.isLoadingMore) {
          if (notifications && notifications.data.length > 0) {
            const data = [...state.notifications.data, ...notifications.data];
            draft.notifications = { ...notifications, data };
          }
        } else {
          draft.notifications = notifications;
        }
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;
      case constants.GET_NOTIFICATIONS_FAILURE:
        draft.isLoadingMore = false;
        draft.isLoading = false;
        break;

      case constants.UPDATE_NOTIFICATION:
        draft.updateNotificationSuccess = null;
        break;
      case constants.UPDATE_NOTIFICATION_SUCCESS:
        let newData = state.notifications.data.map(noti => noti);
        newData = newData.map(noti => {
          if (noti._id === action.data._id) {
            noti = { ...noti, ...action.data };
          }
          return noti;

        });
        draft.notifications.data = newData;
        draft.updateNotificationSuccess = true;
        break;

      case constants.UPDATE_NOTIFICATION_FAILURE:
        draft.updateNotificationSuccess = false;
        break;
      //READALLFINISH
      case constants.READALLFINISH:
        draft.reload = state.reload + 1;
        break;
      case constants.CLEANUP:
        draft.updateNotificationSuccess = null;
        draft.notifications = {};
        draft.isLoading = false;
        draft.isLoadingMore = false;
        break;
      case constants.POSTREADALL:
        draft.loading = true;
        break;
      case constants.POSTREADALL_SUCCESS:
        draft.loading = false;
        break;
    }
  });

export default notificationPageReducer;
