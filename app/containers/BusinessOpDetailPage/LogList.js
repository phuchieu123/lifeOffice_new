import React from 'react';
import images from '../../images';

import { View, Button, Icon, Text, Thumbnail, Left, ListItem, Body, Right } from 'native-base';
import { formartDate } from '../../utils/common';
import { DATE_FORMAT } from '../../utils/constants';

const LogList = ({ log, onOpenLogDetail }) => (
  <ListItem thumbnail>
    <Left>
      <Thumbnail source={images.userImage} />
    </Left>
    <Body>
      <Text>{log.employee && log.employee.name}</Text>

      {log.content.includes('<div>') ? (
        <Text note>Xem chi tiết</Text>
      ) : (
        <View>
          <Text note>{log.content}</Text>
        </View>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
        <Icon name="clockcircleo" type="AntDesign" style={{ fontSize: 12, marginRight: 3 }} />
        <Text note>{formartDate(log.createdAt, DATE_FORMAT.DATE_TIME)}</Text>
      </View>
    </Body>
    <Right>
      <Button transparent onPress={onOpenLogDetail}>
        <Text>Chi tiết</Text>
      </Button>
    </Right>
  </ListItem>
);

export default LogList;
