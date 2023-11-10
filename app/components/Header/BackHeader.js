import React from 'react';
import {View, Text} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {Right } from 'native-base';
import MsgIcon from '../../containers/Message/components/MsgIcon';

function BackHeader(props) {
  const { navigation, title, onGoBack, rightHeader, istrue } = props;
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigation.goBack();
    }
  };
  return (
    <View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        {navigation || onGoBack ? <Icon
          name="arrow-back"
          type="MaterialIcons"
          onPress={handleGoBack}
          style={{ color: '#fff', marginRight: 10, top: 3 }}
        /> : null}
    // backgroundColor: theme.brandPrimary,
        <View>
          <Text>{title}</Text>
        </View>
      </View>
      <Right style={{ flex: 0.2, top: 2 }}>
        {rightHeader}
        {/* <MsgIcon /> */}
      </Right>
    </View>
  );
}

export default BackHeader;
