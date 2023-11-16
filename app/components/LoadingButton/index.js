/**
 *
 * LoadingButton
 *
 */

import React from 'react';
// import styled from 'styled-components';

import {TouchableOpacity} from 'react-native';
import {ActivityIndicator} from 'react-native';
function LoadingButton(props) {
  const { handlePress, onPress, isBusy, children } = props;
  return (
    <TouchableOpacity {...props} onPress={handlePress || onPress} disabled={isBusy} style={{ justifyContent: 'center', marginHorizontal: 5, marginBottom: 4, borderRadius: 10, ...(props.style || {}) }}>
      {isBusy && <ActivityIndicator color="#aaa" />}
      {!isBusy && children}

    </TouchableOpacity>

  );

}

export default LoadingButton;
