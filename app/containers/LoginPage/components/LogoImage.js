import React, { memo } from 'react';
import { Dimensions, ImageBackground } from 'react-native';
// import styled from 'styled-components';
import images from '../../../images';

const deviceHeight = Dimensions.get('window').height - 20;

function LogoImage(props) {
  const { imageUrl, children } = props;

  return imageUrl ? (
    <ImageBackground style={styles.logoSize} source={{ uri: imageUrl }}>
      {children}
    </ImageBackground>
  ) : (
    <ImageBackground resizeMode="stretch" style={styles.logoSize} source={images.loginBg}>
      {children}
    </ImageBackground>
  );
}
export default memo(LogoImage);

const styles = {
  logoSize: {
    height: deviceHeight,
    flex: 1,
    width: '100%',
  },
};
