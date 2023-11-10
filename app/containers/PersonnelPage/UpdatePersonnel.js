import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Button, CardItem, Content, Icon, Input, Item, Label, Right, Text, Textarea, View } from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
import AvatarInput from '../../components/CustomInput/AvatarInput';
import _, { set } from 'lodash'
import LoadingLayout from '../../components/LoadingLayout';
import { add, getById, update } from '../../api/personnel';
import { getAvatar, checkedRequireForm, formartDate } from '../../utils/common';
import LoadingButton from '../../components/LoadingButton';
import ToastCustom from '../../components/ToastCustom';
import { DATE_FORMAT, MODULE } from '../../utils/constants';
import {
    makeSelectViewConfig
} from '../App/selectors';
import moment, { localeData } from 'moment';
import { DeviceEventEmitter, ScrollView } from 'react-native';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import RenderPageWSP from '../WorkingSchedulePage/RenderPageWSP';
import { UPLOAD_FILE } from '../../configs/Paths';
import CustomThumbnail from '../../components/CustomThumbnail';

export function UpdatePersonnel(props) {
    let updateList = 'code, name'.replace(/ /g, '').split(',')

    const { navigation, route, hrmRoles } = props

    const { id } = _.get(route, 'params') || {}


    const [avatar, setAvatar] = useState()
    const [localData, setLocalData] = useState({})
    const [checkis, setCheckis] = useState(false)
    const [error, setError] = useState({})
    const [loading, setLoading] = useState(id ? true : false)
    const [saving, setSaving] = useState(false)
    const ava = (avatar && avatar.uri) || localData.avatar
    const convert = (string) => {
        return string.charAt().toUpperCase() + string.slice(1).toLowerCase();
    }
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


    const getData = async () => {
        const result = await getById(id)
        setLocalData(result)
        setLoading(false)
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


    const checkValid = () => {
        const { isValid, errorList, firstMessage } = checkedRequireForm(hrmRoles, localData, updateList)
        let valid = isValid
        let msg = firstMessage
        let err = errorList
        const checkEmail = validate(localData.email)
        if (!checkEmail) {
            valid = valid && checkEmail;
            msg = `${localData.email} không phải đúng định dạng của email`
            err.email = true
        }

        if (!valid && msg) ToastCustom({ text: msg, type: 'danger' })
        setError(err)
        return valid;
    }

    const handleSubmit = async () => {
        setSaving(true)

        try {
            if (checkValid()) {
                const { code, name, phoneNumber, email, address, birthday, note, identityCardNumber } = localData

                const data = {
                    avatar: localData.avatar,
                    code,
                    name,
                    phoneNumber,
                    email,
                    address,
                    birthday,
                    note,
                    identityCardNumber

                }

                if (id) {
                    const result = await update(id, data, avatar)
                    if (result) {
                        navigation.goBack()
                        DeviceEventEmitter.emit('onAddCustomer')
                        ToastCustom({ text: 'Cập nhật thành công', type: 'success' })
                    }
                    else {
                        ToastCustom({ text: 'Cập nhật thất bại', type: 'danger' })
                    }
                }
                else {
                    const result = await add(data, avatar)
                    if (result) {
                        navigation.goBack()
                        DeviceEventEmitter.emit('onAddCustomer', result)
                        ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
                    }
                    else {
                        ToastCustom({ text: 'Thêm mới thất bại', type: 'danger' })
                    }
                }
            }
        } catch (err) { }
        setSaving(false)
    };


    return (
        <>
            <BackHeader
                title={'Chỉnh sửa hồ sơ nhân sự'}
                navigation={navigation}
            />
            <Content padder style={{ backgroundColor: '#fff' }}>
                <LoadingLayout isLoading={loading}>
                    <AvatarInput source={getAvatar(ava, localData.gender)} onSave={setAvatar} />


                    {!_.get(hrmRoles, 'code.checkedShowForm') ? null : <Item inlineLabel error={error.code} style={styles.item} disabled >
                        <Label>Mã nhân sự</Label>
                        <Input style={{ textAlign: 'right', marginRight: 5 }} onChangeText={e => handleChange('code', e)} value={localData.code} disabled={true} />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>}

                    {!_.get(hrmRoles, 'name.checkedShowForm') ? null : <Item inlineLabel style={styles.item} error={checkis}>
                        <Label >{convert(_.get(hrmRoles, 'name.title') || 'Tên nhân sự')}:</Label>
                        <Input style={{ textAlign: 'right', marginRight: 5, paddingTop: 10 }} onChangeText={e => handleChange('name', e)} value={localData.name} placeholder="Tối thiểu 5 kí tự" placeholderTextColor="#ccc" multiline={true}  />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>}

                    {!_.get(hrmRoles, 'phoneNumber.checkedShowForm') ? null : <Item inlineLabel style={styles.item}>
                        <Label >{convert(_.get(hrmRoles, 'phoneNumber.title') || 'Số điện thoại')}:</Label>
                        <Input style={{ textAlign: 'right', marginRight: 5 }} onChangeText={e => handleChange('phoneNumber', e)} maxLength={13} value={localData.phoneNumber} keyboardType="decimal-pad" />

                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>}

                    {!_.get(hrmRoles, 'identityCardNumber.checkedShowForm') ? null : <Item style={styles.item} error={error.identityCardNumber}>
                        <Label >{convert(_.get(hrmRoles, 'identityCardNumber.title') || 'Số CMND/CCCD')}:</Label>
                        <Input keyboardType="decimal-pad" maxLength={13} style={{ textAlign: 'right', marginRight: 5 }} onChangeText={e => handleChange('identityCardNumber', e)} value={localData.identityCardNumber} />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />

                    </Item>}
                    {!_.get(hrmRoles, 'birthday.checkedShowForm') ? null : <Item inlineLabel>
                        <Label >{convert(_.get(hrmRoles, 'birthday.title') || 'Ngày sinh')}:</Label>

                        <DateTimePicker
                            mode="datetime"
                            onSave={(e) => handleChange('birthday', e)}
                            value={localData.birthday && moment(localData.birthday).format(DATE_FORMAT.DATE_TIME)}
                        />
                    </Item>}

                    {!_.get(hrmRoles, 'email.checkedShowForm') ? null : <Item inlineLabel style={styles.item} error={error.email}>
                        <Label >{convert(_.get(hrmRoles, 'email.title') || 'Email')}:</Label>
                        <Input style={{ textAlign: 'right', marginRight: 5 }} onChangeText={e => handleChange('email', e)} value={localData.email} disabled={true} />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>}

                    {!_.get(hrmRoles, 'address.checkedShowForm') ? null : <Item inlineLabel style={styles.item} error={error.address}>
                        <Label >{convert(_.get(hrmRoles, 'address.title') || 'Địa chỉ')}:</Label>
                        <Input style={{ textAlign: 'right', marginRight: 5, paddingTop: 10 }} onChangeText={e => handleChange('address', e)} value={localData.address} multiline={true} disabled={true} />
                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                    </Item>}


                    {/* {!_.get(hrmRoles, 'note.checkedShowForm') ? null : <View>
                        <Item inlineLabel style={{}} underline={false}>
                            <Label style={{ marginTop: 10 }}>Ghi chú:</Label>
                        </Item>
                        <View  >
                            <Textarea
                                disabled={true}
                                value={localData.note}
                                rowSpan={5}
                                bordered
                                // onChangeText={(val) => handleChange('note', val)}
                                style={{ width: '100%', alignSelf: 'center' }} />

                        </View>
                    </View>} */}

                    {/* <View style={{  maxHeight: 80 }}>
                        <ScrollView style={{ }}>
                            <RenderPageWSP api={UPLOAD_FILE} folder="company" />
                        </ScrollView>
                    </View> */}

                    <LoadingButton isBusy={saving} block handlePress={handleSubmit} style={{ marginTop: 22 }}>
                        <Icon name="check" type="Feather" />
                    </LoadingButton>


                </LoadingLayout>
            </Content>
        </>
    );
}

const mapStateToProps = createStructuredSelector({
    hrmRoles: makeSelectViewConfig(MODULE.HRM),

});
function mapDispatchToProps(dispatch) {
    return {
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(UpdatePersonnel);
