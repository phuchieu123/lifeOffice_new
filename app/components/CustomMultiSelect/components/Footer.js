import React from 'react';
import {View} from 'react-native';
import {Button} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import AntIcon from 'react-native-vector-icons/AntDesign';
export default Footer = props => {
  const {single, readOnly, handleSave, onClose} = props;
  return (
    <View padder style={{flexDirection: 'row', margin: 5, marginTop: 0}}>
      {single || readOnly ? null : (
        <Button
          block
          onPress={handleSave}
          style={{
            flex: 1,
            borderRadius: 10,
            margin: 5,
            backgroundColor: 'rgba(46, 149, 46, 1)',
          }}>
          <Icon name="check" type="Feather" color="white" />
        </Button>
      )}
      <Button
        block
        onPress={onClose}
        full
        style={{
          flex: 1,
          borderRadius: 10,
          margin: 5,
          backgroundColor: 'orange',
        }}
        warning>
        <AntIcon name="close" type="AntDesign" color="white" />
      </Button>
    </View>
  );
};
