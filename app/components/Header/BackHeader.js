import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function BackHeader(props) {
  const {navigation, title, onGoBack, rightHeader, istrue} = props;
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigation.goBack();
    }
  };
  return (
    <View
      style={{
        backgroundColor: 'rgba(46, 149, 46, 1)',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
      <View style={{flexDirection: 'row', flex: 1,   justifyContent: 'space-between',
        alignItems: 'center',}}>
        {navigation || onGoBack ? (
          <Icon
            name="arrow-back"
            type="MaterialIcons"
            onPress={handleGoBack}
            style={{color: '#fff', top: 3, justifyContent: 'center'}}
          />
        ) : null}

        <Text style={{marginLeft: 10, fontSize: 20, color: 'white', flex: 1}}>
          {title}
        </Text>
      </View>
      <View style={{paddingRight: 10}}>{rightHeader}</View>
    </View> 
  );
}

export default BackHeader;
