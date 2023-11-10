import React, { memo } from 'react';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

import { View, Card, CardItem, Button, Icon, Text } from 'native-base';
import { formartDate } from '../../utils/common';
import { DATE_FORMAT } from '../../utils/constants';

function LogModal(props) {
  const { open, currentLog, onClose } = props;

  return (
    <Modal isVisible={open}>
      <Card>
        <CardItem header>
          <Text uppercase>{currentLog && currentLog.employee && currentLog.employee.name}</Text>
        </CardItem>
        <CardItem style={{ height: 300 }}>
          {currentLog && currentLog.content.includes('<div>') ? (
            <WebView
              originWhitelist={['*']}
              source={{
                html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${
                  currentLog.content
                }</body></html>`,
              }}
            />
          ) : (
            <View>
              <Text>{currentLog.content}</Text>
            </View>
          )}
        </CardItem>
        <CardItem>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Icon name="clockcircleo" type="AntDesign" style={{ fontSize: 12, marginRight: 3 }} />
            <Text>{formartDate(currentLog.createdAt, DATE_FORMAT.DATE_TIME)}</Text>
          </View>
        </CardItem>
        <CardItem>
          <Button style={{ flex: 1 }} block full title="Hide modal" onPress={onClose}>
            <Text>Đóng</Text>
          </Button>
        </CardItem>
      </Card>
    </Modal>
  );
}

export default memo(LogModal);
