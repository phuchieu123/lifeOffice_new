/**
 *
 * SettingPage
 *
 */

import React, {memo, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {createStructuredSelector} from 'reselect';

import _ from 'lodash';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {View, Text, TouchableOpacity} from 'react-native';
import {BackHandler} from 'react-native';
import {useInjectReducer} from '../../utils/injectReducer';
import {useInjectSaga} from '../../utils/injectSaga';
import {updateProfile} from '../../api/employees';
import {getById} from '../../api/personnel';
import RightHeader from '../../components/CustomSetting/RightHeader';
import BackHeader from '../../components/Header/BackHeader';
import ToastCustom from '../../components/ToastCustom';
import {autoLogout} from '../../utils/autoLogout';
import {onLogout} from '../../utils/deviceEventEmitter';
import {clearAll} from '../../utils/storage';
import {makeSelectProfile} from '../App/selectors';
import {updateAvatar} from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectSettingPage from './selectors';
import AccountTab from './tabs/account';
import {EditAccount} from './tabs/editAccount';

export function SettingPage(props) {
  useInjectReducer({key: 'settingPage', reducer});
  useInjectSaga({key: 'settingPage', saga});

  const {navigation, onGoBack, onUpdateAvatar, settingPage, profile} = props;
  const {uploadAvatarSuccess, uploadingAvatar} = settingPage;

  const [isEdit, setIsEdit] = useState();
  const [updating, setUpdating] = useState();

  const [localData, setLocalData] = useState({});
  const [focus, setFocus] = useState(false);
  const id = profile['hrmEmployeeId'];

  useEffect(() => {
    if (id) getData();
    else {
      setLocalData({
        code: `KH${moment()}`,
        detailInfo: {
          typeCustomer: {},
        },
      });
    }

    const onFocus = navigation.addListener('focus', e => {
      setFocus(true);
    });

    const onBlur = navigation.addListener('blur', e => {
      setFocus(false);
    });

    return () => {
      onFocus();
      onBlur();
    };
  }, []);

  const getData = async () => {
    const result = await getById(id);
    console.log('~ result', result);
    setLocalData(result);
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      autoLogout();
    });
  }, []);

  useEffect(() => {
    const backHandlerListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => {
      backHandlerListener.remove();
    };
  }, []);

  const onEdit = () => {
    setIsEdit(true);
  };

  const onSave = async data => {
    setUpdating(true);
    const {name, email, gender, phoneNumber, address, dob, beginWork, avatar} =
      data;
    const newData = {
      name,
      email,
      gender,
      phoneNumber,
      address,
      dob: moment(dob).format('YYYY-MM-DD'),
      beginWork,
      avatar,
    };

    const result = await updateProfile(newData);
    setUpdating(false);
    if (_.get(result, 'success')) {
      setIsEdit(false);
      ToastCustom({text: 'Cập nhật thành công', type: 'success'});
    } else {
      ToastCustom({text: 'Cập nhật thất bại', type: 'danger'});
    }
  };

  const logout = async () => {
    await clearAll();
    onLogout();
    // auth.signOut()
  };
  return (
    <>
      {/* <CustomHeader title="Cài đặt" navigation={navigation} /> */}
      <BackHeader
        title="Cài đặt"
        // navigation={navigation}
        onGoBack={() => (isEdit ? setIsEdit(false) : navigation.goBack())}
        rightHeader={
          <>
            {isEdit ? (
              <RightHeader
                focus={focus}
                enableFilterModal
                localData={localData}
              />
            ) : (
              <Icon
                name="edit"
                type="MaterialIcons"
                style={{color: '#fff'}}
                onPress={onEdit}
              />
            )}
          </>
        }
      />
      <View padder style={{justifyContent:'space-between' ,backgroundColor: '#ddd',flex: 1,
 }}>
        {isEdit ? (
          <EditAccount
            profile={profile || {}}
            updateAvatar={onUpdateAvatar}
            uploadingAvatar={uploadingAvatar}
            onSave={onSave}
            onCancel={() => setIsEdit(false)}
            updating={updating}
          />
        ) : (
          <AccountTab
            profile={profile || {}}
            updateAvatar={onUpdateAvatar}
            uploadingAvatar={uploadingAvatar}
          />
        )}
        {isEdit ? null : (
          <TouchableOpacity
            
            activeOpacity={0.8}
            block
            onPress={logout}
            style={{
              borderRadius: 30,
              marginHorizontal: 10,
              backgroundColor: 'rgba(46, 149, 46, 1)',
              paddingVertical: 10,
              marginBottom: 20
              
            }}>
            <Text style={{color: '#fff', textAlign:'center'}}>Đăng xuất</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const mapStateToProps = createStructuredSelector({
  settingPage: makeSelectSettingPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    onUpdateAvatar: avatar => dispatch(updateAvatar(avatar)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(SettingPage);
