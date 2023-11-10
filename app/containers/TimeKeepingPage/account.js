/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * ApprovedTab
 *
 */

import React, { memo } from 'react';
import { Text, Icon, View, Card, CardItem, Right, Button, Thumbnail, Left, Body } from 'native-base';
import { Image } from 'react-native';
import { getAvatar } from '../../utils/common';

export function AccountTab(props) {
  const { profile } = props;
  return (
    <View>

      <Button style={{ height: 80, borderRadius: 15, marginBottom: 15 }}>

        <Left >
          <Image
            resizeMode="contain"
            source={getAvatar(profile.avatar, profile.gender)}
            style={{ width: '100%', height: 50, right: '30%', borderRadius: 60 }}
          />

        </Left>
        <Body>
          <Text style={{ right: '55%', color: '#fff', fontSize: 16 }}>{profile.name}</Text>
          <Text style={{ right: '55%', color: '#fff', fontSize: 16 }}>{profile.position}</Text>
        </Body>
        {/* <Right style={styles.right}>
            <Text style={styles.white}>{moment().format('HH:mm')}</Text>
          </Right> */}
      </Button>
    </View>
  );
}

export default memo(AccountTab);
