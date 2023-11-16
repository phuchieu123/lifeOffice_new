/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * ApprovedTab
 *
 */

import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Image, Text, View} from 'react-native';
import images from '../../../images';
import moment from 'moment';
import {getAvatar} from '../../../utils/common';
import AvatarInput from '../../../components/CustomInput/AvatarInput';
import {updateAvatar} from '../../../api/employees';
import ToastCustom from '../../../components/ToastCustom';
import {API_PROFILE} from '../../../configs/Paths';
import request from '../../../utils/request';

const AccountTab = props => {
  // const { profile = {} } = props;

  const [uploadingAvatar, setUploadingAvatar] = useState();
  const [avatarProfile, setAvatarProfile] = useState({});
  const [profile, setProfile] = useState({});

  useEffect(async () => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      let url = `${await API_PROFILE()}`;
      const body = {method: 'GET'};
      const response = await request(url, body);

      if (response._id) {
        setAvatarProfile(response);
        setProfile(response);
      }
    } catch (err) {}
  };

  function converSex(profile) {
    if (
      profile &&
      profile.gender &&
      (profile.gender === 'female' || profile.gender === 'f')
    ) {
      return 'Nữ';
    } else if (
      profile &&
      profile.gender &&
      (profile.gender === 'male' || profile.gender === 'm')
    ) {
      return 'Nam';
    } else return '';
  }
  const onChangeAvatar = async e => {
    setUploadingAvatar(true);
    const result = await updateAvatar(e);
    if (result && result.success) {
      ToastCustom({text: 'Cập nhật thành công', type: 'success'});
      getProfile();
    } else ToastCustom({text: 'Cập nhật thất bại', type: 'warning'});
    setUploadingAvatar(false);
  };

  return (
    <View >
      <AvatarInput
        loading={uploadingAvatar}
        type="detail"
        onSave={onChangeAvatar}
        source={getAvatar(avatarProfile.avatar, profile.gender)}
      />
      <View
        style={{
          marginTop: 10,
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
        }}>
        <View style={styleUse.View}>
          <Icon name="key" type="FontAwesome" style={styleUse.Icon} />
          <Text>Mã nhân viên: </Text>
          <View style={{justifyContent: 'flex-end', flex: 1, paddingEnd: 10}}>
            <Text style={{textAlign: 'right', fontWeight: '700'}}>
              {profile.code}
            </Text>
          </View>
        </View>
        <View style={styleUse.View}>
          <Icon style={styleUse.Icon} name="user" type="FontAwesome" />

          <Text>Tài khoản: </Text>
          <View style={{justifyContent: 'flex-end', flex: 1, paddingEnd: 10}}>
            <Text style={{textAlign: 'right', fontWeight: '700'}}>
              {profile.username}
            </Text>
          </View>
        </View>
        <View style={styleUse.View}>
          <Icon
            style={styleUse.Icon}
            active
            name="address-book-o"
            type="FontAwesome"
          />

          <Text>Tên: </Text>
          <View style={{justifyContent: 'flex-end', flex: 1, paddingEnd: 10}}>
            <Text style={{textAlign: 'right', fontWeight: '700'}}>
              {profile.name}
            </Text>
          </View>
        </View>
        <View style={styleUse.View}>
          <Icon
            style={styleUse.Icon}
            active
            name="envelope-o"
            type="FontAwesome"
          />

          <Text>Email:  </Text>
          <View style={{justifyContent: 'flex-end', flex: 1, paddingEnd: 10}}>
            <Text style={{textAlign: 'right', fontWeight: '700'}}>
              {profile.email}
            </Text>
          </View>
        </View>
        <View style={styleUse.View}>
          <Icon
            style={styleUse.Icon}
            active
            name="transgender"
            type="FontAwesome"
          />

          <Text>Giới tính: </Text>
          <View style={{justifyContent: 'flex-end', flex: 1, paddingEnd: 10}}>
            <Text style={{textAlign: 'right', fontWeight: '700'}}>
              {converSex(profile)}
            </Text>
          </View>
        </View>
        <View style={styleUse.View}>
          <Icon
            style={styleUse.Icon}
            active
            name="mobile-phone"
            type="FontAwesome"
          />

          <Text>SĐT: </Text>
          <View style={{justifyContent: 'flex-end', flex: 1, paddingEnd: 10}}>
            <Text style={{textAlign: 'right', fontWeight: '700'}}>
              {profile.phoneNumber}
            </Text>
          </View>
        </View>
        <View style={styleUse.View}>
          <Icon
            style={styleUse.Icon}
            active
            name="address-book"
            type="FontAwesome"
          />

          <Text>Địa Chỉ: </Text>
          <View style={{justifyContent: 'flex-end', flex: 1, paddingEnd: 10}}>
            <Text style={{textAlign: 'right', fontWeight: '700'}}>
              {profile.address}
            </Text>
          </View>
        </View>
        <View style={styleUse.View}>
          <Icon
            style={styleUse.Icon}
            active
            name="birthday-cake"
            type="FontAwesome"
          />

          <Text>Ngày sinh: </Text>
          <View style={{justifyContent: 'flex-end', flex: 1, paddingEnd: 10}}>
            <Text style={{textAlign: 'right', fontWeight: '700'}}>
              {moment(profile.dob).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
        <View style={styleUse.View}>
          <Icon
            style={styleUse.Icon}
            active
            name="briefcase"
            type="FontAwesome"
          />

          <Text>Bắt đầu làm: </Text>
          <View style={{justifyContent: 'flex-end', flex: 1, paddingEnd: 10}}>
            <Text style={{textAlign: 'right', fontWeight: '700'}}>
              {moment(profile.beginWork).format('DD/MM/YYYY')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AccountTab;

const styleUse = {
  View: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 2
  },
  Icon: {
    paddingHorizontal: 10,
    color: 'rgba(46, 149, 46, 1)',
  },
};
