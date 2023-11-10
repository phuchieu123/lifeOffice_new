/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * ApprovedTab
 *
 */

import React, { useEffect, useState } from 'react';
import { Text, Icon, View, Card, CardItem, Right, Button, Thumbnail, Input } from 'native-base';
import { Image } from 'react-native';
import images from '../../../images';
import moment from 'moment';
import { getAvatar } from '../../../utils/common';
import AvatarInput from '../../../components/CustomInput/AvatarInput';
import { updateAvatar } from '../../../api/employees';
import ToastCustom from '../../../components/ToastCustom';
import { API_PROFILE } from '../../../configs/Paths';
import request from '../../../utils/request';

export function AccountTab(props) {
  // const { profile = {} } = props;

  const [uploadingAvatar, setUploadingAvatar] = useState()
  const [avatarProfile, setAvatarProfile] = useState({})
  const [profile, setProfile] = useState({})

  useEffect(async () => {
    getProfile();
  }, [])

  const getProfile = async () => {
    try {
      let url = `${await API_PROFILE()}`;
      const body = { method: 'GET' };
      const response = await request(url, body);

      if (response._id) {
        setAvatarProfile(response);
        setProfile(response)
      }
    } catch (err) { }
  }

  function converSex(profile) {
    if (profile && profile.gender && (profile.gender === 'female' || profile.gender === 'f')) {
      return 'Nữ';
    } else if (profile && profile.gender && (profile.gender === 'male' || profile.gender === 'm')) {
      return 'Nam';
    } else return '';
  }
  const onChangeAvatar = async (e) => {
    setUploadingAvatar(true)
    const result = await updateAvatar(e)
    if (result && result.success) {
      ToastCustom({ text: 'Cập nhật thành công', type: 'success' });
      getProfile()
    }
    else ToastCustom({ text: 'Cập nhật thất bại', type: 'warning' });
    setUploadingAvatar(false)
  }

  return (
    <View>
      <AvatarInput loading={uploadingAvatar} type="detail" onSave={onChangeAvatar} source={getAvatar(avatarProfile.avatar, profile.gender)} />
      <Card style={{ marginTop: 10 }}>
        <CardItem bordered>
          <Button transparent iconRight small>
            <Icon name="key" type="FontAwesome" />
          </Button>
          <Text>Mã nhân viên: </Text>
          <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ textAlign: 'right', fontWeight: '700' }}>{profile.code}</Text>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Button transparent iconRight small>
            <Icon name="user" type="FontAwesome" />
          </Button>
          <Text>Tài khoản: </Text>
          <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ textAlign: 'right', fontWeight: '700' }}>{profile.username}</Text>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Button transparent iconRight small>
            <Icon active name="address-book-o" type="FontAwesome" />
          </Button>
          <Text>Tên: </Text>
          <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ textAlign: 'right', fontWeight: '700' }}>{profile.name}</Text>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Button transparent iconRight small>
            <Icon active name="envelope-o" type="FontAwesome" />
          </Button>
          <Text>Email: </Text>
          <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ textAlign: 'right', fontWeight: '700' }}>{profile.email}</Text>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Button transparent iconRight small>
            <Icon active name="transgender" type="FontAwesome" />
          </Button>
          <Text>Giới tính: </Text>
          <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ textAlign: 'right', fontWeight: '700' }}>{converSex(profile)}</Text>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Button transparent iconRight small>
            <Icon active name="mobile-phone" type="FontAwesome" />
          </Button>
          <Text>SĐT: </Text>
          <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ textAlign: 'right', fontWeight: '700' }}>{(profile.phoneNumber)}</Text>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Button transparent iconRight small>
            <Icon active name="address-book" type="FontAwesome" />
          </Button>
          <Text>Địa Chỉ: </Text>
          <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ textAlign: 'right', fontWeight: '700' }}>{(profile.address)}</Text>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Button transparent iconRight small>
            <Icon active name="birthday-cake" type="FontAwesome" />
          </Button>
          <Text>Ngày sinh: </Text>
          <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ textAlign: 'right', fontWeight: '700' }}>{moment(profile.dob).format('DD/MM/YYYY')}</Text>
          </Right>
        </CardItem>
        <CardItem bordered>
          <Button transparent iconRight small>
            <Icon active name="briefcase" type="FontAwesome" />
          </Button>
          <Text>Bắt đầu làm: </Text>
          <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
            <Text style={{ textAlign: 'right', fontWeight: '700' }}>
              {moment(profile.beginWork).format('DD/MM/YYYY')}
            </Text>
          </Right>
        </CardItem>
      </Card>
    </View >
  );
}

export default AccountTab;
