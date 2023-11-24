import React from 'react';
import { WebView } from 'react-native-webview';
import BackHeader from '../../components/Header/BackHeader';
import {View} from 'react-native';

const LifetekTab = (props) => {
  const { navigation } = props;

  return (
    <View>
      <BackHeader navigation={navigation} title={'About Us'} />
      <WebView source={{ uri: 'lifetek.vn' }} />
    </View>
  );
};
export default LifetekTab;
