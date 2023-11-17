/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * ApprovedTab
 *
 */

import React, {memo, useEffect, useState} from 'react';
import {ActionSheet} from 'native-base';
import {
  Image,
  Touchable,
  TouchableOpacity,
  Text,
  View,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconEntypo from 'react-native-vector-icons/Entypo';
import images from '../../../images';
import moment from 'moment';
import {
  convertGender,
  convertGenderToText,
  getAvatar,
} from '../../../utils/common';
import AvatarInput from '../../../components/CustomInput/AvatarInput';
import {GENDER} from '../../../utils/constants';
import CustomMultiSelect from '../../../components/CustomMultiSelect';
import DateTimePicker from '../../../components/CustomDateTimePicker/DateTimePicker';
import LoadingButton from '../../../components/LoadingButton';
import {scale} from 'react-native-size-matters';
import {updateAvatar} from '../../../api/employees';
import ToastCustom from '../../../components/ToastCustom';
import {
  API_PROFILE,
  APP_URL,
  DOMAIN_URL,
  getConfig,
} from '../../../configs/Paths';
import {getData, storeData} from '../../../utils/storage';
import request from '../../../utils/request';

export function EditAccount(props) {
  const {profile = {}, onCancel, onSave, updating} = props;

  const [localData, setLocalData] = useState({});
  const [uploadingAvatar, setUploadingAvatar] = useState();
  const [avatarProfile, setAvatarProfile] = useState({});

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
      }
    } catch (err) {}
  };

  const OPTIONS = ['Nam', 'Nữ'];
  useEffect(() => {
    setLocalData(avatarProfile);
  }, [avatarProfile]);

  const onItemPress = async () => {
    ActionSheet.show(
      {
        options: OPTIONS,
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            handleChange('gender', 'male');
            break;
          case 1:
            handleChange('gender', 'female');
            break;
        }
      },
    );
  };

  const handleChange = (key, value) => {
    let newData = {};
    newData[key] = value;
    setLocalData({...localData, ...newData});
  };

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
    <View>
      <AvatarInput
        loading={uploadingAvatar}
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
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Text
              style={{
                textAlign: 'right',
                fontWeight: '700',
                color: '#000',
                marginRight: 5,
              }}>
              {profile.code}
            </Text>
          </View>
        </View>
        <View style={styleUse.View}>
          <Icon name="user" type="FontAwesome" style={styleUse.Icon} />

          <Text>Tài khoản: </Text>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Text
              style={{
                textAlign: 'right',
                fontWeight: '700',
                color: '#000',
                marginRight: 5,
              }}>
              {localData.username}
            </Text>
          </View>
        </View>
        <View style={styleUse.View}>
          <View style={styleUse.inputText}>
            <Icon
              active
              name="address-book-o"
              type="FontAwesome"
              style={styleUse.Icon}
            />

            <Text style={{alignSelf: 'center'}}>Tên: </Text>
          </View>
          <View style={styleUse.rightText}>
            <TextInput
              value={localData.name}
              style={{
                textAlign: 'right',
                fontWeight: '700',
                color: '#000',
                marginRight: 5,
                padding: 0,
              }}
              onChangeText={val => handleChange('name', val)}
            />
            <IconEntypo
              active
              type="Entypo"
              name="keyboard"
              style={styleUse.icon}
            />
          </View>
        </View>
        <View style={styleUse.View}>
          <View style={styleUse.inputText}>
            <Icon
              active
              name="envelope-o"
              type="FontAwesome"
              style={styleUse.Icon}
            />

            <Text style={{alignSelf: 'center'}}>Email: </Text>
          </View>
          <View style={styleUse.rightText}>
            <TextInput
              value={localData.email}
              style={{
                textAlign: 'right',
                fontWeight: '700',
                color: '#000',
                marginRight: 5,
                padding: 0,
              }}
              onChangeText={val => handleChange('email', val)}
            />
            <IconEntypo
              active
              type="Entypo"
              name="keyboard"
              style={styleUse.icon}
            />
          </View>
        </View>
        <View style={styleUse.View}>
          <View style={styleUse.inputText}>
            <Icon
              active
              name="transgender"
              type="FontAwesome"
              style={styleUse.Icon}
            />

            <Text style={{alignSelf: 'center'}}>Giới tính: </Text>
          </View>
          <View style={{textAlign: 'right', flex: 1}}>
            <TouchableOpacity
              onPress={onItemPress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
                marginRight: 3,
              }}>
              <TextInput
                style={{
                  fontWeight: '700',
                  marginRight: 5,
                  textAlign: 'right',
                  color: '#000',
                  marginRight: 5,
                }}
                value={convertGenderToText(localData.gender)}
                disabled={true}
              />
              <Icon
                type="FontAwesome"
                name="caret-down"
                style={{fontSize: 16, textAlign: 'right', flex: 1}}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styleUse.View}>
          <View style={styleUse.inputText}>
            <Icon
              active
              name="mobile-phone"
              type="FontAwesome"
              style={styleUse.Icon}
            />

            <Text style={{alignSelf: 'center'}}>SĐT: </Text>
          </View>
          <View style={styleUse.rightText}>
            <TextInput
              value={localData.phoneNumber}
              onChangeText={val => handleChange('phoneNumber', val)}
              keyboardType="numeric"
              style={{
                fontWeight: '700',
                textAlign: 'right',
                color: '#000',
                marginRight: 5,
                padding: 0,
              }}
            />
            <IconEntypo
              active
              type="Entypo"
              name="keyboard"
              style={styleUse.icon}
            />
          </View>
        </View>
        <View style={styleUse.View}>
          <View style={styleUse.inputText}>
            <Icon
              active
              name="address-book"
              type="FontAwesome"
              style={styleUse.Icon}
            />

            <Text style={{alignSelf: 'center'}}>Địa Chỉ: </Text>
          </View>
          <View style={styleUse.rightText}>
            <TextInput
              value={localData.address}
              style={{
                fontWeight: '700',
                textAlign: 'right',
                color: '#000',
                marginRight: 5,
                padding: 0,
              }}
              onChangeText={val => handleChange('address', val)}
            />
            <IconEntypo
              active
              type="Entypo"
              name="keyboard"
              style={styleUse.icon}
            />
          </View>
        </View>
        <View style={styleUse.View}>
          <Icon
            active
            name="birthday-cake"
            type="FontAwesome"
            style={styleUse.Icon}
          />

          <Text>Ngày sinh: </Text>
          <View style={styleUse.rightText}>
            <DateTimePicker
              onSave={e => handleChange('dob', e)}
              value={
                localData.dob && moment(localData.dob).format('DD/MM/YYYY')
              }
              textStyle={{fontWeight: 'bold', fontSize: 15}}
            />
          </View>
        </View>
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
      </View>
      <View
        padder
        style={{
          flexDirection: 'row',
          marginHorizontal: 20,
          marginVertical: 10,
        }}>
        <LoadingButton
          isBusy={updating || uploadingAvatar}
          handlePress={() => onSave(localData)}
          style={{
            flex: 1,
            borderRadius: 10,
            marginLeft: 0,
            marginRight: 5,
     
            backgroundColor: 'rgba(46, 149, 46, 1)',
            paddingVertical: 10,
   
          }}>
          <Icon name="check" type="Feather" style={{ color: 'white',  textAlign: 'center',}} />
        </LoadingButton>
        <LoadingButton
          handlePress={onCancel}
          full
          style={{
            flex: 1,
            borderRadius: 10,
            marginRight: 0,
            marginLeft: 5,
          
            backgroundColor: 'orange',
            paddingVertical: 10,
           
          }}
          warning>
          <Icon name="close" type="AntDesign"  style={{ color: 'white',  textAlign: 'center',}}/>
        </LoadingButton>

        {/* <Button block onPress={() => onSave(localData)} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
          <Icon name="check" type="Feather" />
        </Button>
        <Button block onPress={onCancel} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
          <Icon name="close" type="AntDesign" />
        </Button> */}
      </View>
    </View>
  );
}

export default memo(EditAccount);

// const styles = {
//   input: {

//     fontWeight: '700',
//     textAlign: 'right',
//     height: 20,
//     fontSize: 14,

//   },
//   icon: {
//     fontSize: 16,
//     // fontWeight: '700',
//     // color: '#000'
//   },
//   right: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   cardbig: {
//     height: scale(52),
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center'
//   },
//   inputText: {
//     flex: 0.5, flexDirection: 'row',

//   },
//   rightText: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center'
//   }
// }

const styleUse = {
  View: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 2,
  },
  icon: {paddingRight: 5},
  Icon: {
    paddingHorizontal: 10,
    color: 'rgba(46, 149, 46, 1)',
  },
  inputText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padidng: 0,
  },
};
