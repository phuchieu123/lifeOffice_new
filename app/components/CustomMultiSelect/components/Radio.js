import React, { Fragment } from 'react';
import { View, Radio } from 'native-base';
import _ from 'lodash';
import theme from '../../../utils/customTheme';
import { TouchableOpacity } from 'react-native';

const RadioCustom = (props) => {
  const { selected, toggleRadio } = props;

  return (
    <TouchableOpacity
      onPress={toggleRadio}
      style={{
        width: 23,
        height: 23,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{

          backgroundColor: selected ? 'green' : 'white',
          display: 'flex',
          width: 15,
          height: 15,
          borderRadius: 70,
          borderWidth: 1,
          borderColor: selected ? 'green' : 'white',
        }}
      />
    </TouchableOpacity>
  );
};

export default RadioCustom;
