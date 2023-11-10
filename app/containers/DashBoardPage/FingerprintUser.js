
import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import _ from 'lodash'
import BackHeader from '../../components/Header/BackHeader';
import { Switch, Text } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Alert, BackHandler, TouchableOpacity, View } from 'react-native';
import TouchID from 'react-native-touch-id'
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storeData, getData } from '../../utils/storage';
import ToastCustom from "../../components/ToastCustom";

const optionalConfigObject = {
    title: 'Yêu cầu xác thực', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Vân tay', // Android
    sensorErrorDescription: 'Thất bại', // Android
    cancelText: 'Đóng', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.

};
export function FingerprintUser(props) {
    const { navigation } = props;

    const [checkFinger, setCheckFinger] = useState(false);
    const [ads, setAds] = useState(false);

    useEffect(() => {
        getData('UseFingerPrintLoggin').then(value => setCheckFinger(value))
        getData('ads').then(ad => (!ad || ad === 'show') && setAds(true))
    }, [])

    useEffect(() => {
        const backHandlerListener = BackHandler.addEventListener('hardwareBackPress',
            () => {
                navigation.goBack();
                return true;
            }
        );
        return () => {
            backHandlerListener.remove();
        }

    }, []);

    const _pressHandler = () => {
        TouchID.authenticate('Vui lòng quét vân tay để tiếp tục , có thể sử dụng các vân tay đang có sẫn ở trên thiết bị', optionalConfigObject)
            .then(success => {
                if (checkFinger === true) {
                    setCheckFinger(false)
                    storeData('UseFingerPrintLoggin', JSON.stringify(false))
                }
                else {
                    setCheckFinger(true)
                    storeData('UseFingerPrintLoggin', JSON.stringify(true))

                }
            })
            .catch(error => { });
    }

    const clickHandler = () => {
        TouchID.isSupported(optionalConfigObject)
            .then(_pressHandler)
            .catch(error => {
                ToastCustom({ text: 'Thiết bị không hỗ trợ sinh trắc học', type: 'warning' })
                console.log(error);
            });
    }

    const toggleAds = () => {
        setAds(!ads)
        storeData('ads', ads ? 'hide' : 'show')
    }


    return (
        <>
            <BackHeader title="Cài đặt chung" navigation={navigation} />
            <View>
                <Card>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='fingerprint' style={{ marginRight: 10, fontSize: 40 }} />
                            <Text style={{ textAlignVertical: 'center' }}>Đăng nhập bằng sinh trắc học</Text>
                        </View>
                        <View style={{ marginTop: 14 }}>
                            <Switch value={checkFinger} onValueChange={clickHandler} />
                        </View>

                    </View>
                </Card>

                <Card>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='alpha-a-box-outline' type='MaterialCommunityIcons' style={{ marginRight: 10, fontSize: 40 }} />
                            <Text style={{ textAlignVertical: 'center' }} >Quảng cáo</Text>
                        </View>
                        <View style={{ marginTop: 14 }}>
                            <Switch value={ads} onValueChange={toggleAds} />
                        </View>

                    </View>
                </Card>
            </View>
        </>
    );
}


const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
    return {

    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(FingerprintUser);
