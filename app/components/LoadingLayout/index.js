/**
 *
 * Layout
 *
 */

import React, { memo } from 'react';
// import styled from 'styled-components';
import {View,ActivityIndicator} from 'react-native';
function LoadingLayout(props) {
  const { isLoading, children, style = {}, ...rest } = props;
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0)', ...style }} {...rest}>
      {isLoading ? <ActivityIndicator style={{ flex: 1, alignContent: 'center' }} /> : children}
    </View>
  );
}

export default memo(LoadingLayout);
