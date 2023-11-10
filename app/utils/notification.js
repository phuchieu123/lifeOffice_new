import PushNotification, { Importance } from 'react-native-push-notification';
import _ from 'lodash';
import { getRoutes, navigate } from '../RootNavigation';
import { clearData, getData, storeData } from 'utils/storage';

PushNotification.configure({
  // (required) Called when a remote or local notification is opened or received
  popInitialNotification: true,
  requestPermissions: true,

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  onNotification: (noti) => onNotification(noti),
});

PushNotification.createChannel(
  {
    channelId: 'LifeOffice', // (required)
    channelName: 'Life Office', // (required)
    // channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
    playSound: false, // (optional) default: true
    soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
    importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
    vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
  },
  (created) => { }, // (optional) callback returns whether the channel was created, false means it already existed.
);

export default notification = (props) => {
  // PushNotification.getChannels(function (channel_ids) {
  //     console.log(channel_ids); // ['channel_id_1']
  // });
  try {
    // if (Platform.OS === 'ios') {
    //     const details = {
    //         // alertBody: props.subText,
    //         // alertTitle: props.message,
    //         title: props.message,
    //         subTitle: props.subText,
    //     }
    //     PushNotificationIOS.addNotificationRequest(details);
    // } else
    PushNotification.localNotification({
      channelId: 'mipecChannel',
      // bigText: 'This is local notification demo in React Native app. Only shown, when expanded.',
      // subText: 'Local Notification Demo',
      // title: 'Local Notification Title',
      // message: 'Expand me to see more',
      autoCancel: true,
      vibrate: true,
      vibration: 300,
      playSound: true,
      soundName: 'default',
      // largeIcon: 'ic_mipec_resident_round',
      // smallIcon: 'ic_mipec_resident_round',
      // actions: '["Yes", "No"]',
      userInfo: props && props.data,
      ...(props || {}),
    });
  } catch (err) {
    console.log('err', err);
  }
};

const onNotification = async (notification) => {
  try {
    console.log('on notification', notification)
    // DO SOMTHING

    if (isNavigate) clearData('notificationChannel');
    else if (isNavigate === false) storeData('notificationChannel', JSON.stringify(notification));
  } catch (error) {
    console.log('notificationChannelErr', error);
  }
};

export const checkOpenOnClick = async () => {
  try {
    const notification = await getData('notificationChannel');
    await clearData('notificationChannel');
    console.log('notification', notification);

    // DO SOMTHING
  } catch (error) { }
};
