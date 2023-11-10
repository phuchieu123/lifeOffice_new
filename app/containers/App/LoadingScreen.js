import React, { useState, useEffect, memo } from 'react';
import { DeviceEventEmitter, Dimensions, Image } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';

import images from '../../images';
import { View } from 'react-native';
import { mergeConfig } from './actions';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';

import makeSelectGlobal from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getData } from '../../utils/storage';
import TouchID from 'react-native-touch-id'
import theme from '../../utils/customTheme'
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { getToken, getApproveToken, getDriverToken } from '../../api/oauth';
import {
  getViewConfig,
  getCrmStatus,
  getTaskConfigs,
  getCrmSource,
  getHrmSource,
  getDepartments,
  getRoles,
} from '../../api/configs';
import { getProfile } from '../../api/employees';
import { onLogout } from '../../utils/deviceEventEmitter';
import { createSocket } from '../../utils/socket';
import { onLogin as onLoginEvent } from '../../utils/deviceEventEmitter';
import { messagingUserPermission } from '../../utils/permission';

const optionalConfigObject = {
  title: 'Yêu cầu xác thực', // Android
  imageColor: '#e00606', // Android
  imageErrorColor: '#ff0000', // Android
  sensorDescription: 'Vân tay', // Android
  sensorErrorDescription: 'Thất bại', // Android
  cancelText: 'Đóng', // Android
  fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
  unifiedErrors: false, // use unified error messages (default false)
  passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.

};
export function LoadingScreen(props) {
  useInjectReducer({ key: 'global', reducer });
  useInjectSaga({ key: 'global', saga });

  const {
    onMergeConfig,
    navigation,
  } = props;

  const [showInstalling, setShowInstalling] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    const onFocus = navigation.addListener('focus', () => {
      handleChecking();
    });

    return () => {
      setDownloadProgress(0)
      onFocus()
    };
  }, []);

  const handleChecking = async () => {
    getData('accessToken')
      .then(async (isLogin) => {
        const checkIsTrusty = await getData('UseFingerPrintLoggin')
        if (isLogin && checkIsTrusty) {
          TouchID.authenticate('Vui lòng quyét vân tay để tiếp tục , có thể sử dụng các vân tay đang có sẫn ở trên thiết bị', optionalConfigObject)
            .then(() => onLogin())
            .catch(onLogout);
        }
        else if (isLogin) onLogin()
        else onLogout();
      });
  };

  const loading = async (funcObj, allow) => {
    setDownloadProgress(0)
    setShowInstalling(true)

    let current = 0
    const keys = Object.keys(funcObj)
    const arr = keys.map(e => funcObj[e])
    const result = await Promise.all(arr.map(async (func, idx) => {
      const res = await func()
      const number = ++current / arr.length * 100
      setDownloadProgress(number)
      onMergeConfig({ name: keys[idx], val: res })
      return res
    }))

    await new Promise(resolve => setTimeout(resolve, 500));
    setShowInstalling(false)
    if (allow) return true
    return result.length === result.filter(e => e).length
  }

  const onLogin = async () => {
    try {

      // // get auth
      // if (!(await loading({
      //   getToken,
      //   getApproveToken,
      //   getDriverToken,
      // }))) return onLogout()

      //getProfile
      if (!(await loading({ getProfile }))) return onLogout()

      //getRoles
      if (!(await loading({ getRoles }))) return onLogout()

      // get config
      if (!(await loading({
        getUrlConfig: async () => await getData('urlConfig'),
        getViewConfig,
        getCrmStatus,
        getTaskConfigs,
        getCrmSource,
        getHrmSource,
        getDepartments,
        createSocket,
        messagingUserPermission,
      }, true))) return onLogout()

      onLoginEvent()
    } catch (error) {
    }
  }

  return (
    <View style={styles.wrapperView} >
      {showInstalling && <View style={styles.progressView}>
        {/* <Text style={styles.progressText}>Downloading update... {`${parseInt(downloadProgress, 10)} %`}</Text>
        <ProgressBar color={theme.brandPrimary} progress={parseInt(downloadProgress, 10)} /> */}
        <View style={{ flexDirection: 'row', alignSelf: "center", position: 'absolute', bottom: 0 }}>
          <ProgressBarAnimated
            borderRadius={0}
            borderColor='#rgba(0, 0, 0, 0)'
            width={Dimensions.get('screen').width}
            height={5}
            value={downloadProgress}
            backgroundColor={theme.brandPrimary}
            useNativeDriver
          />
        </View>
      </View>}
      <Image resizeMode="cover" style={styles.logoSize} source={images.splashScreen} />
    </View>
  );
}

const mapStateToProps = createStructuredSelector({
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    onMergeConfig: (data) => dispatch(mergeConfig(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(LoadingScreen);

const styles = {
  wrapperView: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  installText: {
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 15,
  },
  progressView: {
    position: 'absolute',
    alignSelf: 'stretch',
    justifyContent: 'center',
    padding: 20,
    bottom: 0,
    zIndex: 1,
    width: '100%'
  },
  progressText: {
    color: theme.brandPrimary,
    alignSelf: 'center',
    marginBottom: 10,
    fontSize: 15,
  },
  logoSize: {
    flex: 1,
    width: '100%',
  },
};
