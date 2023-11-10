/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * ApprovedTab
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Text, Icon, View, Card, CardItem, Right, Button, Thumbnail, Input, ActionSheet } from 'native-base';
import { Image, Touchable, TouchableOpacity } from 'react-native';
import images from '../../../images';
import moment from 'moment';
import { convertGender, convertGenderToText, getAvatar } from '../../../utils/common';
import AvatarInput from '../../../components/CustomInput/AvatarInput';
import { GENDER } from '../../../utils/constants';
import CustomMultiSelect from '../../../components/CustomMultiSelect';
import DateTimePicker from '../../../components/CustomDateTimePicker/DateTimePicker';
import LoadingButton from '../../../components/LoadingButton';
import { scale } from 'react-native-size-matters';
import { updateAvatar } from '../../../api/employees';
import ToastCustom from '../../../components/ToastCustom';
import { API_PROFILE, APP_URL, DOMAIN_URL, getConfig } from '../../../configs/Paths';
import { getData, storeData } from '../../../utils/storage';
import request from '../../../utils/request';

export function EditAccount(props) {
  const { profile = {}, onCancel, onSave, updating } = props;

  const [localData, setLocalData] = useState({})
  const [uploadingAvatar, setUploadingAvatar] = useState()
  const [avatarProfile, setAvatarProfile] = useState({})

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
      }
    } catch (err) { }
  }

  const OPTIONS = ['Nam', 'Nữ']
  useEffect(() => {
    setLocalData(avatarProfile)
  }, [avatarProfile])

  const onItemPress = async () => {
    ActionSheet.show({
      options: OPTIONS,
    }, (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          handleChange('gender', 'male')
          break;
        case 1:
          handleChange('gender', 'female')
          break;
      }
    })
  }

  const handleChange = (key, value) => {
    let newData = {}
    newData[key] = value
    setLocalData({ ...localData, ...newData });
  };

  const onChangeAvatar = async (e) => {
    setUploadingAvatar(true)
    const result = await updateAvatar(e)
    if (result && result.success) {
      ToastCustom({ text: 'Cập nhật thành công', type: 'success' });
      getProfile();
    } else ToastCustom({ text: 'Cập nhật thất bại', type: 'warning' });
    setUploadingAvatar(false)
  }

  return (
    <View>
      <AvatarInput loading={uploadingAvatar} onSave={onChangeAvatar} source={getAvatar(avatarProfile.avatar, profile.gender)} />
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
            <Text style={{ textAlign: 'right', fontWeight: '700' }}>{localData.username}</Text>
          </Right>
        </CardItem>
        <CardItem bordered style={styles.cardbig}>
          <View style={styles.inputText}>
            <Button style={{ alignItems: 'center' }} transparent iconRight small>
              <Icon active name="address-book-o" type="FontAwesome" />
            </Button>

            <Text style={{ alignSelf: 'center' }}>Tên: </Text>
          </View>
          <Right style={styles.rightText}>
            <Input value={localData.name} style={{
              textAlign: 'right',
              fontWeight: '700',
            }} onChangeText={val => handleChange('name', val)} />
            <Icon active type="Entypo" name="keyboard" style={styles.icon} />
          </Right>
        </CardItem>
        <CardItem bordered style={styles.cardbig}>
          <View style={styles.inputText}>
            <Button transparent iconRight small style={{ alignItems: 'center' }}>
              <Icon active name="envelope-o" type="FontAwesome" />
            </Button>
            <Text style={{ alignSelf: 'center' }}>Email: </Text>
          </View>
          <Right style={styles.rightText}>
            <Input value={localData.email} style={{
              textAlign: 'right',
              fontWeight: '700',
            }} onChangeText={val => handleChange('email', val)} />
            <Icon active type="Entypo" name="keyboard" style={styles.icon} />
          </Right>
        </CardItem>
        <CardItem bordered style={styles.cardbig}>
          <View style={styles.inputText}>
            <Button transparent iconRight small style={{ alignItems: 'center' }}>
              <Icon active name="transgender" type="FontAwesome" />
            </Button>
            <Text style={{ alignSelf: 'center' }}>Giới tính: </Text>
          </View>
          <Right style={{ textAlign: 'right' }}>
            <TouchableOpacity onPress={onItemPress} style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 3 }}>
              <Input style={{ fontWeight: '700', marginRight: 5, textAlign: 'right' }} value={convertGenderToText(localData.gender)} disabled={true} />
              <Icon type="FontAwesome" name="caret-down" color="red" style={styles.icon} />
            </TouchableOpacity>
          </Right>
        </CardItem>
        <CardItem bordered style={styles.cardbig}>
          <View style={styles.inputText}>
            <Button transparent iconRight small style={{ alignItems: 'center' }}>
              <Icon active name="mobile-phone" type="FontAwesome" />
            </Button>
            <Text style={{ alignSelf: 'center' }}>SĐT: </Text>
          </View>
          <Right style={styles.rightText}>
            <Input value={localData.phoneNumber} onChangeText={val => handleChange('phoneNumber', val)} keyboardType='numeric' style={{ fontWeight: '700', textAlign: 'right' }} />
            <Icon active type="Entypo" name="keyboard" style={styles.icon} />
          </Right>
        </CardItem>
        <CardItem bordered style={styles.cardbig}>
          <View style={styles.inputText}>
            <Button transparent iconRight small style={{ alignItems: 'center' }}>
              <Icon active name="address-book" type="FontAwesome" />
            </Button>
            <Text style={{ alignSelf: 'center' }}>Địa Chỉ: </Text>
          </View>
          <Right style={styles.rightText}>
            <Input value={localData.address} style={{ fontWeight: '700', textAlign: 'right' }} onChangeText={val => handleChange('address', val)} />
            <Icon active type="Entypo" name="keyboard" style={styles.icon} />
          </Right>
        </CardItem>
        <CardItem bordered>
          <Button transparent iconRight small>
            <Icon active name="birthday-cake" type="FontAwesome" />
          </Button>
          <Text>Ngày sinh: </Text>
          <Right style={styles.right}>
            <DateTimePicker
              onSave={(e) => handleChange('dob', e)}
              value={localData.dob && moment(localData.dob).format('DD/MM/YYYY')}
              textStyle={{ fontWeight: 'bold', fontSize: 15, }}
            />
          </Right>
        </CardItem>
        {/* <CardItem bordered>
          <Button transparent iconRight small>
            <Icon active name="briefcase" type="FontAwesome" />
          </Button>
          <Text>Bắt đầu làm: </Text>
          <Right style={styles.right}>
            <DateTimePicker
              onSave={(e) => handleChange('beginWork', e)}
              value={localData.beginWork && moment(localData.beginWork).format('DD/MM/YYYY')}
              style={{ height: 20 }}
              textStyle={{ fontWeight: 'bold', fontSize: 15, }}
            />
          </Right>
        </CardItem> */}
      </Card>
      <View padder style={{ flexDirection: 'row' }}>


        <LoadingButton isBusy={updating || uploadingAvatar} handlePress={() => onSave(localData)} style={{ flex: 1, borderRadius: 10, marginLeft: 0, marginRight: 5 }}>
          <Icon name="check" type="Feather" />
        </LoadingButton>
        <LoadingButton handlePress={onCancel} full style={{ flex: 1, borderRadius: 10, marginRight: 0, marginLeft: 5 }} warning>
          <Icon name="close" type="AntDesign" />
        </LoadingButton>

        {/* <Button block onPress={() => onSave(localData)} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
          <Icon name="check" type="Feather" />
        </Button>
        <Button block onPress={onCancel} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
          <Icon name="close" type="AntDesign" />
        </Button> */}
      </View>
    </View >
  );
}

export default memo(EditAccount);


const styles = {
  input: {

    fontWeight: '700',
    textAlign: 'right',
    height: 20,
    fontSize: 14,


  },
  icon: {
    fontSize: 16,
    // fontWeight: '700',
    // color: '#000'
  },
  right: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardbig: {
    height: scale(52),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputText: {
    flex: 0.5, flexDirection: 'row',

  },
  rightText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
}