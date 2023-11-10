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
import RenderPagePersonnel from './RenderPagePersonnel';
import { API_FILE_COMPANY, UPLOAD_FILE, LISTFILE_PERSONNEL } from '../../configs/Paths';
import CustomThumbnail from '../../components/CustomThumbnail';
import { navigate } from '../../RootNavigation';




export function ListFilePersonnel(props) {
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



    const getData = async () => {
        const result = await getById(id)
        setLocalData(result)
        setLoading(false)
    }

    return (
        <>
            <BackHeader
                title={'Danh sách tâp tin'}
                navigation={navigation}
            />
            <Content padder style={{ backgroundColor: '#fff' }}>
                <LoadingLayout isLoading={loading}>
                    <RenderPagePersonnel api={`${LISTFILE_PERSONNEL()}/${id}`} folder="company" />
                    {/* <RenderPagePersonnel api={UPLOAD_FILE} folder="company" /> */}

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

export default compose(withConnect, memo)(ListFilePersonnel);
