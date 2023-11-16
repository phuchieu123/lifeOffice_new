/**
 *
 * LoadingButton
 *
 */

import React from 'react';
// import styled from 'styled-components';

import { Button } from 'native-base';
import {ActivityIndicator} from 'react-native';
function LoadingButton(props) {
  const { handlePress, onPress, isBusy, children } = props;
  return (
    <Button {...props} onPress={handlePress || onPress} disabled={isBusy} style={{ justifyContent: 'center', marginHorizontal: 5, marginBottom: 4, borderRadius: 10, ...(props.style || {}) }}>
      {isBusy && <ActivityIndicator color="#aaa" />}
      {!isBusy && children}

    </Button>

  );

}

export default LoadingButton;
