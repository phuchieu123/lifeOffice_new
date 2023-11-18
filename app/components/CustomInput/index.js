/**
 *
 * CommentInput
 *
 */

import {View, Text} from 'react-native'
import React, { memo } from 'react';
// import styled from 'styled-components';

function CustomInput(props) {
  const { label, children, error } = props;

  return (
    <View style={{ 
      marginHorizontal: 10,
      paddingVertical: 5,
      borderBottomWidth: 0.7,
      borderColor: 'gray',
      paddingHorizontal: 5,
          marginHorizontal: 10,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.36,
          shadowRadius: 6.68,

          elevation: 11,
          borderBottomWidth: 1,
          borderColor: 'gray'}} inlineLabel error={error}>
      <Text>{label}</Text>
      {children}
    </View>
  );
}

export default memo(CustomInput);
