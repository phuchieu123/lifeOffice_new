import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { ActionSheet, Content, Icon, Input, Item, Label } from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
import AvatarInput from '../../components/CustomInput/AvatarInput';
import _, { set } from 'lodash'
import LoadingLayout from '../../components/LoadingLayout';
import { add, getById, update } from '../../api/customers';
import { getAvatar, checkedRequireForm, convertLabel } from '../../utils/common';
import LoadingButton from '../../components/LoadingButton';
import ToastCustom from '../../components/ToastCustom';
import { MODULE } from '../../utils/constants';
import {
    makeSelectUserRole,
    makeSelectViewConfig
} from '../App/selectors';
import moment from 'moment';
import { DeviceEventEmitter } from 'react-native';
import RightHeader from '../../components/CustomSetting/RightHeader';
import { validateForm } from '../../utils/validate';
import { autoLogout } from '../../utils/autoLogout';

export function AddCustomer(props) {
    const { navigation, route, customerRole, customerRoles } = props
    const { PUT } = customerRole

    const { id, view } = _.get(route, 'params') || {}

    const [avatar, setAvatar] = useState()
    const [localData, setLocalData] = useState({})
    const [putAuth, setPutAuth] = useState(PUT)
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(id ? true : false)
    const [saving, setSaving] = useState(false)
    const ava = (avatar && avatar.uri) || localData.avatar


    useEffect(() => {
        if (id) getData()
        else {
            setLocalData({
                code: `KH${moment()}`,
                detailInfo: {
                    typeCustomer: {}
                }
            })
        }
    }, [])

    const getData = async () => {
        const result = await getById(id)
        setLocalData(result)
        setLoading(false)
        if (view) {
            setPutAuth(false)
        }
    }

    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value
        setLocalData({ ...localData, ...newData });
        if (error[key]) {
            const newErr = { ...error }
            delete newErr[key]
            if (key === 'startDate' || key === 'endDate') {
                delete newErr.startDate
                delete newErr.endDate
            }
            setError(newErr)
        }
    };

    const handleChanRepresent = (key, value) => {
        let newData = { ...localData }
        if (!newData.detailInfo) newData.detailInfo = {}
        if (!newData.detailInfo.represent) newData.detailInfo.represent = {}
        newData.detailInfo.represent[key] = value
        setLocalData(newData);
    }
    const validate = (text) => {
        if (!text) return true
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(text) === false) {
            return false;
        }
        else {
            return true;
        }
    }

    useEffect(() => {
        navigation.addListener(
            'focus', () => {
                autoLogout()
            }
        );

    }, []);

    const validatePhone = (text) => {
        if (!text) return true;
        let reg = /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/;
        if (reg.test(text) === false) {
            return false;
        }
        else {
            return true;
        }
    }

    const validateIdetityCardNumber = (text) => {
        if (!text) return true;
        let reg = /^\d+$/;
        if (reg.test(text) === false) {
            return false;
        }
        else {
            return true;
        }
    }

    const checkValid = () => {
        // let updateList = 'code, name'.replace(/ /g, '').split(',')
        let updateList = 'code, name, phoneNumber,email,address,idetityCardNumber'
            .replace(/ /g, '').split(',').reduce((a, v) => ({ ...a, [v]: v }), {})
        const { isValid, errorList, firstMessage } = checkedRequireForm(customerRoles, localData, updateList)
        let valid = isValid
        let msg = firstMessage
        let err = errorList
        const checkEmail = validate(localData.email)
        const checkPhone = validatePhone(localData.phoneNumber)
        const checkIdetityCardNumber = validateIdetityCardNumber(localData.idetityCardNumber)
        if (!localData.idetityCardNumber || !localData.idetityCardNumber.length) {
            valid = valid && localData.idetityCardNumber;
            ToastCustom({ text: 'Nhập trường số CMTND', type: 'danger' })
            err.idetityCardNumber = true
        }
        if (!localData.phoneNumber || !localData.phoneNumber.length) {
            valid = valid && localData.phoneNumber;
            ToastCustom({ text: 'Nhập trường số diện thoại', type: 'danger' })
            err.phoneNumber = true
        }
        if (!checkEmail) {
            valid = valid && checkEmail;
            ToastCustom({ text: 'Yêu cầu nhập đúng định dạng của gmail', type: 'danger' })
            err.email = true
        }
        if (!checkPhone) {
            valid = valid && checkPhone;
            ToastCustom({ text: 'Yêu cầu nhập đúng định dạng của số điện thoại', type: 'danger' })
            err.phone = true
        }
        if (!checkIdetityCardNumber) {
            valid = valid && checkIdetityCardNumber;
            ToastCustom({ text: 'Yêu cầu nhập đúng định dạng của số chứng minh nhân dân', type: 'danger' })
            err.idetityCardNumber = true
        }
        // valid = !Object.keys(errorList).length ? true : false
        if (!valid && msg) ToastCustom({ text: msg, type: 'danger' })
        setError(err)
        return valid;
    }

    const handleSubmit = async () => {
        setSaving(true)
        if (checkValid()) {
            try {
                const { code, name, nickName, phoneNumber, idetityCardNumber, email, address, detailInfo, avatar } = localData

                const data = {
                    avatar: ava,
                    code,
                    name,
                    nickName,
                    phoneNumber,
                    idetityCardNumber,
                    email,
                    address,
                    detailInfo,
                }

                if (id) {
                    const result = await update(id, data, avatar)
                    if (result._id) {
                        navigation.goBack()
                        DeviceEventEmitter.emit('onUpdateCustomer', result)
                        ToastCustom({ text: 'Cập nhật thành công', type: 'success' })
                    }
                    else {
                        ToastCustom({ text: result.message || 'Cập nhật thất bại', type: 'danger' })
                    }
                }
                else {
                    const result = await add(data, avatar)
                    if (result._id) {
                        navigation.goBack()
                        DeviceEventEmitter.emit('onAddCustomer', result)
                        ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
                    }
                    else {
                        ToastCustom({ text: result.message || 'Thêm mới thất bại', type: 'danger' })
                    }
                }
            } catch (err) { }
        }
        setSaving(false)
    };

    return (
        <>
            <BackHeader
                title={id ? 'Thông tin khách hàng' : "Thêm mới khách hàng"}
                navigation={navigation}
                rightHeader={
                    <RightHeader
                        enableFilterModal
                        localData={localData}
                        view={view}
                    />
                }
            />

            <Content padder>
                <LoadingLayout isLoading={loading}>
                    <AvatarInput source={getAvatar(ava, localData.gender)} onSave={setAvatar} view={view} />

                    <Item inlineLabel error={error.code} style={styles.item} disabled >
                        <Label>Mã khách hàng</Label>
                        <Input style={{ textAlign: 'right', marginRight: 5 }} onChangeText={e => handleChange('code', e)} value={localData.code} disabled />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>
                    {!_.get(customerRoles, 'name.checkedShowForm') ? null :
                        <Item inlineLabel style={styles.item} error={error.name}>
                            <Label>{convertLabel(_.get(customerRoles, 'name.title') || 'Tên khách hàng')}:</Label>
                            <Input
                                style={{ textAlign: 'right', marginRight: 5, paddingTop: 10 }}
                                onChangeText={e => handleChange('name', e)}
                                value={localData.name}
                                placeholderTextColor="#ccc"
                                multiline={false}
                                disabled={!putAuth}
                            />
                            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                        </Item>}

                    {!_.get(customerRoles, 'nickName.checkedShowForm') ? null :
                        <Item inlineLabel style={styles.item} error={error.nickName} >
                            <Label>{convertLabel(_.get(customerRoles, 'nickName.title') || 'Biệt danh')}:</Label>
                            <Input
                                style={{ textAlign: 'right', marginRight: 5 }}
                                onChangeText={e => handleChange('nickName', e)}
                                value={localData.nickName}
                                disabled={!putAuth}
                                placeholderTextColor="#ccc" />
                            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                        </Item>}

                    {!_.get(customerRoles, 'phoneNumber.checkedShowForm') ? null : <Item inlineLabel style={styles.item} error={error.phoneNumber}>
                        <Label >{convertLabel(_.get(customerRoles, 'phoneNumber.title') || 'Số điện thoại')}:</Label>
                        <Input
                            style={{ textAlign: 'right', marginRight: 5 }}
                            onChangeText={e => handleChange('phoneNumber', e)}
                            maxLength={13}
                            value={localData.phoneNumber}
                            keyboardType="phone-pad"
                            disabled={!putAuth}
                        />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>}

                    <Item style={styles.item} error={error.idetityCardNumber}>
                        <Label >{convertLabel(_.get(customerRoles, 'idetityCardNumber.title') || 'Số CMND/CCCD')}:</Label>
                        <Input keyboardType="decimal-pad" maxLength={13} style={{ textAlign: 'right', marginRight: 5 }} onChangeText={e => handleChange('idetityCardNumber', e)} value={localData.idetityCardNumber} disabled={!putAuth} />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />

                    </Item>

                    {!_.get(customerRoles, 'email.checkedShowForm') ? null : <Item inlineLabel style={styles.item} error={error.email}>
                        <Label >{convertLabel(_.get(customerRoles, 'email.title') || 'Email')}:</Label>
                        <Input style={{ textAlign: 'right', marginRight: 5 }} onChangeText={e => handleChange('email', e)} value={localData.email} disabled={!putAuth} />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>}

                    {!_.get(customerRoles, 'address.checkedShowForm') ? null : <Item inlineLabel style={styles.item} error={error.address}>
                        <Label >{convertLabel(_.get(customerRoles, 'address.title') || 'Địa chỉ')}:</Label>
                        <Input style={{ textAlign: 'right', marginRight: 5, paddingTop: 10 }} onChangeText={e => handleChange('address', e)} value={localData.address} multiline={false} disabled={!putAuth} />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>}

                    {/* {!_.get(_.get(customerRoles, 'detailInfo.represent.name'), 'checkedShowForm') ? null : <Item inlineLabel style={styles.item}>
                        <Label >{convertLabel(_.get(customerRoles['detailInfo.represent.name'], 'title') || 'Tên người đại diện')}:</Label>
                        <Input style={{ textAlign: 'right', marginRight: 5 }} onChangeText={e => handleChanRepresent('name', e)} value={_.get(localData, 'detailInfo.represent.name')} />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>}

                    {!_.get(_.get(customerRoles, 'detailInfo.represent.phoneNumber'), 'checkedShowForm') ? null : <Item inlineLabel style={styles.item} >

                        <Label >{convertLabel(_.get(customerRoles['detailInfo.represent.phoneNumber'], 'title') || 'Số điện thoại NDD')}:</Label>
                        <Input style={{ textAlign: 'right', marginRight: 5 }} onChangeText={e => handleChanRepresent('phoneNumber', e)} value={_.get(localData, 'detailInfo.represent.phoneNumber')} keyboardType="decimal-pad" maxLength={13} />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>} */}

                    {!customerRole.POST || view ? null :
                        <LoadingButton isBusy={saving} block handlePress={handleSubmit}>
                            <Icon name="check" type="Feather" />
                        </LoadingButton>
                    }
                </LoadingLayout>
            </Content>
        </>
    );
}

const mapStateToProps = createStructuredSelector({
    customerRole: makeSelectUserRole(MODULE.CUSTOMER),
    customerRoles: makeSelectViewConfig(MODULE.CUSTOMER)
});

function mapDispatchToProps(dispatch) {
    return {
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(AddCustomer);
