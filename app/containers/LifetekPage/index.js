import React from 'react';
import { WebView } from 'react-native-webview';
import BackHeader from '../../components/Header/BackHeader';
import { Container } from 'native-base';

const LifetekTab = (props) => {
  const { navigation } = props;

  return (
    <Container>
      <BackHeader navigation={navigation} title={'About Us'} />
      <WebView source={{ uri: 'lifetek.vn' }} />
    </Container>
  );
};
export default LifetekTab;
