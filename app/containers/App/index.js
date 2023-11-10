import React, { useEffect, useState } from 'react';
import { BackHandler, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import { isMountedRef, navigate } from '../../RootNavigation';
import Navigator from './Navigator';
import reducer from './reducer';
import saga from './saga';
import makeSelectGlobal, { makeSelectProfile, makeSelectSocket } from './selectors';
// import messaging from '@react-native-firebase/messaging';
import { getNotifications } from '../../api/notifications';
import { onSocketEvent } from '../../utils/deviceEventEmitter';
import { CALL_VIDEO } from '../../utils/socket';
import { clearAllData } from '../../utils/storage';
import { mergeData } from './actions';

function App(props) {
  useInjectReducer({ key: 'global', reducer });
  useInjectSaga({ key: 'global', saga });
  const { onMergeData, socket, global, profile } = props

  const [isLoggedIn, setIsLogin] = useState()
  const [changeCall, setChangeCall] = useState()

  useEffect(() => {
    let onSocketErrorEvent
    isMountedRef.current = true;
    BackHandler.addEventListener('hardwareBackPress', () => true);

    // onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     const userId = user.uid
    //     firebase.set(
    //       firebase.ref(firebase, `users/${userId}`)
    //       , {
    //         email: user.email,
    //         tokenKey: user.tokenKey,
    //         accessToken: user.accessToken,
    //       }
    //     )
    //   }
    // })

    const loginEvent = DeviceEventEmitter.addListener("loginEvent", onLoginEvent)
    const updateProfileEvent = DeviceEventEmitter.addListener("updateProfile", onMergeData)
    const receiveCallEvent = DeviceEventEmitter.addListener("offer", () => navigate('ReceiveCallPage'))
    const onChat = DeviceEventEmitter.addListener("chat", (latestMessage) => {
      // profile._id !== latestMessage.userId && onMergeData({ unReadMsg: (unReadMsg || 0) + 1 })
    })




    // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    //   console.log('onMessage', remoteMessage);
    // });

    // messaging().onNotificationOpenedApp((remoteMessage) => {
    //   console.log('onNotificationOpenedApp', remoteMessage);
    // });

    // messaging().getInitialNotification().then((remoteMessage) => {
    //   console.log('getInitialNotification', remoteMessage);
    // });

    return () => {
      // unsubscribe();
      socket && socket.close()
      isMountedRef.current = false;
      BackHandler.removeEventListener('hardwareBackPress');
      loginEvent.remove()
      updateProfileEvent.remove()
      receiveCallEvent.remove()
      onChat.remove()
      // incomingCall.remove()
      onSocketErrorEvent && onSocketErrorEvent.remove()
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('App')
    } else if (isLoggedIn === false) {
      navigate('Login')
      // logoutFirebase()
      clearAllData()
    }
    // navigate('Login')
    if (!isLoggedIn && socket) socket.close()
  }, [isLoggedIn])

  useEffect(() => {
    let incomingCall
    if (profile._id)
      incomingCall = DeviceEventEmitter.addListener(CALL_VIDEO, (data) => {

        try {
          if (data.data.type === 'offer') {

            profile._id === data.to[0] ? navigate('ReceiveCallPage', { data: data }) : null

          }
        } catch (err) {
          console.log('err', err)
        }
      })
    else if (incomingCall) incomingCall.remove()

    return () => {
      incomingCall && incomingCall.remove()
    }
  }, [profile])



  const onLoginEvent = isLogin => {
    if (isLogin) {
      onMergeData({ socketError: false })
      onSocketErrorEvent = DeviceEventEmitter.addListener("socket_error", () => {
        onMergeData({ socketError: true })
        getNotifications({ filter: { isRead: false }, limit: 1, skip: 0 }).then(e => e && onSocketEvent('notification', { isNotRead: e.count }))
        onSocketErrorEvent.remove()
      })
    } else {
      navigate('Login')
    }
    setIsLogin(isLogin)
  }

  return (
      <Navigator isLoggedIn={isLoggedIn} />
  );
}

const mapStateToProps = createStructuredSelector({
  socket: makeSelectSocket(),
  global: makeSelectGlobal(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    onMergeData: (data) => dispatch(mergeData(data)),

  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(App);
