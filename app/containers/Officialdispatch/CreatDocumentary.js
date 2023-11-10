import React, { useState, useEffect } from 'react';
import { Body, Card, CardItem, Container, Content, Icon, Input, Text, View, Label, Item, ListItem, Right, Button, ActionSheet } from 'native-base';
import _ from 'lodash';
import CustomHeader from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import moment from 'moment';
import BackHeader from '../../components/Header/BackHeader';
import DepartmentSelect from '../../components/CustomMultiSelect/DepartmentSelect';
import { API_TASK, API_CUSTOMER, API_DOCUMENTARY, API_USERS, API_ROLE_GROUPS } from '../../configs/Paths';
import { compose } from 'redux';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import { ScrollView } from 'react-native';
import LoadingButton from '../../components/LoadingButton';
import { crmSourceCode, makeSelectViewConfig, makeSelectClientId } from '../App/selectors';
import { DATE_FORMAT, MODULE } from '../../utils/constants';
import { checkedRequireForm, convertLabel } from '../../utils/common';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Search from '../../components/CustomMultiSelect/Search';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import FileView from '../../components/FileView';
import { TouchableOpacity } from 'react-native';
import { DeviceEventEmitter } from 'react-native';
import ToastCustom from '../../components/ToastCustom';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { addFile, } from '../../api/fileSystem';
import DocumentPicker from 'react-native-document-picker'
import * as actions from './actions';
import makeSelectOfficialdispatchPage from './selectors';
import { add, update } from '../../api/documentary';
import { autoLogout } from '../../utils/autoLogout';

function CreatDocumentary(props) {
    useInjectReducer({ key: 'CreatDocumentary', reducer });
    useInjectSaga({ key: 'CreatDocumentary', saga });
    const { navigation, route, crmSourceCode, docuentaryConfig, clientId } = props;
    const { params } = route
    const { type } = params

    const [error, setError] = useState({});
    const [localData, setLocalData] = useState({ code: `CV${moment()}`, type })
    const [saving, setSaving] = useState(false)

    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value
        setLocalData({ ...localData, ...newData });
    };

    const checkValid = () => {
        let updateList = 'customers, name, code, typeDocument, task, abstract, replyDispatch, where, officialDispatch, toDate, signer, signerPosition, receivingUnit, toUsers, recieverPosition,receiveTime,replyDeadline,densityreceiverSign'
            .replace(/ /g, '').split(',').reduce((a, v) => ({ ...a, [v]: v }), {})
        const { isValid, errorList, firstMessage } = checkedRequireForm(docuentaryConfig, localData, updateList)

        let valid = isValid
        let msg = firstMessage
        let err = errorList
        const isValidName = localData.name && localData.name.trim().length >= 5;
        if (!isValidName) {
            valid = false;
            msg = `${docuentaryConfig.name.title} phải có tối thiểu 5 kí tự`
            err.name = true
        }

        // if (!localData.replyDeadline && !localData.receiveTime) {
        //     const isValidDate = !moment(localData.replyDeadline).isAfter(localData.receiveTime)
        //     if (!isValidDate) {
        //         valid = false;
        //         msg = msg || `${docuentaryConfig.receiveTime.title} sau ${docuentaryConfig.replyDeadline.title}`
        //         err.replyDeadline = true
        //         err.receiveTime = true
        //     }
        // }
        if (!err.toDate && !err.receiveTime) {
            const isValidDate = moment(localData.toDate).isBefore(localData.receiveTime)
            if (!isValidDate) {
                valid = valid && isValidDate;
                ToastCustom({ text: 'Thời gian nhận phải sau ngày gửi', type: 'danger' })
                err.toDate = true
                err.receiveTime = true
            }
        }

        if (!err.receiveTime && !err.replyDeadline) {
            const isValidDate = moment(localData.receiveTime).isBefore(localData.replyDeadline)
            if (!isValidDate) {
                valid = valid && isValidDate;
                ToastCustom({ text: 'Thời gian nhận sau thời gian trả lời', type: 'danger' })
                err.receiveTime = true
                err.replyDeadline = true
            }
        }

        // if (!localData.receiveTime && !localData.replyDeadline) {
        //     const isValidDate = !moment(localData.receiveTime).isAfter(localData.replyDeadline)
        //     if (!isValidDate) {
        //         valid = false;
        //         msg = msg || `${docuentaryConfig.receiveTime.title} sau ${docuentaryConfig.replyDeadline.title}`
        //         err.receiveTime = true
        //         err.replyDeadline = true
        //     }
        // }

        if (!valid && msg) {
            ToastCustom({ text: msg, type: 'danger' })
        }

        setError(err)
        return valid;
    };

    useEffect(() => {
        navigation.addListener(
            'focus', () => {
                autoLogout()
            }
        );
    }, []);

    const handleAdd = async () => {
        setSaving(true)
        try {
            if (checkValid()) {
                let body = {
                    ...localData,
                    customers: localData.customers,
                    name: localData.name,
                    code: localData.code,
                    typeDocument: localData.typeDocument,
                    task: localData.task || null,
                    abstract: localData.abstract || "",
                    replyDispatch: localData.replyDispatch || null,
                    where: localData.where || "",
                    officialDispatch: localData.officialDispatch || null,
                    toDate: localData.toDate,
                    signer: localData.signer || "",
                    signerPosition: localData.signerPosition || "",
                    receivingUnit: localData.receivingUnit || "",
                    toUsers: localData.toUsers,
                    recieverPosition: localData.recieverPosition,
                    receiveTime: localData.receiveTime,
                    replyDeadline: localData.replyDeadline,
                    density: localData.density || "",
                    receiverSign: localData.receiverSign || null,
                    content: localData.content || "",
                    handlingComments: "",
                    kanbanStatus: "1",
                    files: [],
                    fromUsers: [],
                    nameUnit: "",
                    type: type.toString(),
                    storage: "",
                    viewer: null,
                    workingSchedule: null
                }
                const res = await add(body)
                if (res) {
                    ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
                    navigation.goBack()
                    DeviceEventEmitter.emit('updateOfficialdispatchSuccess')
                }
                else
                    ToastCustom({ text: 'Thêm mới thất bại', type: 'danger' })
            }

        } catch (err) { }
        setSaving(false)
    };

    return (

        <Container>
            <BackHeader
                navigation={navigation}
                title={type === 2 ? 'Thêm mới công văn đến' : 'Thêm mới công văn đi'}
            />
            <Content style={{ marginHorizontal: 5 }}>

                {!_.get(docuentaryConfig, 'code.checkedShowForm') ? null : <Item inlineLabel error={error.code} >
                    <Label >{convertLabel(_.get(docuentaryConfig, 'code.title')) || 'Mã công văn'}:</Label>
                    <Input value={localData.code} style={styles.input} disabled={true} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </Item>}

                {!_.get(docuentaryConfig, 'name.checkedShowForm') ? null : <Item inlineLabel error={error.name}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'name.title')) || 'Tên công văn'}:</Label>
                    <Input value={localData.name} style={styles.input} onChangeText={(e) => handleChange('name', e)} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </Item>}

                {!_.get(docuentaryConfig, 'typeDocument.checkedShowForm') ? null : <Item inlineLabel error={error.typeDocument}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'typeDocument.title')) || 'Loại công văn'}:</Label>
                    <Search
                        single
                        handleSelectItems={(value) => handleChange('typeDocument', value[0])}
                        onRemoveSelectedItem={() => handleChange('typeDocument', null)}
                        selectedItems={localData.typeDocument ? [localData.typeDocument] : []}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S19']}
                    />

                </Item>}

                {!_.get(docuentaryConfig, 'task.checkedShowForm') ? null : <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }} error={error.task}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'task.title')) || 'Công việc dự án'}:</Label>
                    <SingleAPISearch
                        Single
                        API={API_TASK}
                        onSelectedItemObjectsChange={(value) => handleChange('task', value.length ? value[0] : null)}
                        selectedItems={_.get(localData, 'task._id')}

                    />
                </Item>}

                {!_.get(docuentaryConfig, 'customers.checkedShowForm') ? null : <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }} error={error.customers}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'customers.title')) || 'Khách hàng'}:</Label>
                    <MultiAPISearch
                        API={API_CUSTOMER}
                        onSelectedItemObjectsChange={(e) => handleChange('customers', e)}
                        selectedItems={Array.isArray(_.get(localData, 'customers')) && localData.customers.map(e => e._id)}

                    />
                </Item>}

                {!_.get(docuentaryConfig, 'abstract.checkedShowForm') ? null : <Item inlineLabel error={error.abstract}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'abstract.title')) || 'Tóm lược'}:</Label>
                    <Input value={_.get(localData, 'abstract')} style={styles.input} onChangeText={(e) => handleChange('abstract', e)} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </Item>}

                {!_.get(docuentaryConfig, 'replyDispatch.checkedShowForm') ? null : <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }} error={error.replyDispatch}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'replyDispatch.title')) || 'Công văn trả lời'}:</Label>
                    <SingleAPISearch
                        API={API_DOCUMENTARY}
                        onSelectedItemObjectsChange={(value) => handleChange('replyDispatch', value.length ? value[0] : null)}
                        selectedItems={_.get(localData, 'replyDispatch._id')}

                    />

                </Item>}

                {!_.get(docuentaryConfig, 'officialDispatch.checkedShowForm') ? null : <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }} error={error.officialDispatch}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'officialDispatch.title')) || 'Công văn chính thức'}:</Label>
                    <SingleAPISearch
                        API={API_DOCUMENTARY}
                        onSelectedItemObjectsChange={(value) => handleChange('officialDispatch', value.length ? value[0] : null)}
                        selectedItems={_.get(localData, 'officialDispatch._id')}

                    />
                </Item>}

                {!_.get(docuentaryConfig, 'where.checkedShowForm') ? null : <Item inlineLabel error={error.where}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'where.title')) || 'Nơi phát hành công văn'}:</Label>
                    <Search
                        single
                        handleSelectItems={(value) => handleChange('where', value[0])}
                        onRemoveSelectedItem={() => handleChange('where', null)}
                        selectedItems={localData.where ? [localData.where] : []}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S23']}
                    />
                </Item>}
                {!_.get(docuentaryConfig, 'toDate.checkedShowForm') ? null : <Item inlineLabel error={error.toDate}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'toDate.title')) || 'Ngày gửi'}:</Label>
                    <DateTimePicker
                        mode="datetime"
                        onSave={(e) => handleChange('toDate', e)}
                        value={localData.toDate && moment(localData.toDate).format(DATE_FORMAT.DATE_TIME)}
                    />
                </Item>}

                {!_.get(docuentaryConfig, 'signer.checkedShowForm') ? null : <Item inlineLabel error={error.singner}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'signer.title')) || 'Người ký'}:</Label>
                    <Input value={_.get(localData, 'signer')} style={styles.input} onChangeText={(e) => handleChange('signer', e)} />
                </Item>}

                {!_.get(docuentaryConfig, 'signerPosition.checkedShowForm') ? null : <Item inlineLabel error={error.signerPosition}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'signerPosition.title')) || 'Chức vụ'}:</Label>
                    <Input value={_.get(localData, 'signerPosition')} style={styles.input} onChangeText={(e) => handleChange('signerPosition', e)} />
                </Item>}

                {!_.get(docuentaryConfig, 'receivingUnit.checkedShowForm') ? null : <Item inlineLabel error={error.receivingUnit}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'receivingUnit.title')) || 'Đơn vị nhận'}:</Label>
                    <DepartmentSelect
                        single
                        handleSelectItems={(value) => {
                            return (handleChange('receivingUnit', value.current))
                        }}
                        selectedItems={_.get(localData, 'receivingUnit') ? _.get(localData, 'receivingUnit') : []}
                    />
                </Item>}

                {!_.get(docuentaryConfig, 'toUsers.checkedShowForm') ? null : <Item inlineLabel error={error.toUsers}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'toUsers.title')) || 'Người Nhận'}:</Label>
                    <MultiAPISearch
                        API={API_USERS}
                        // onSelectedItemChange={(value) => handleChange('toUsers', value)}
                        // selectedItems={_.get(localData, 'toUsers')}
                        //localData, 'toUsers')}
                        onSelectedItemObjectsChange={(e) => handleChange('toUsers', e)}
                        selectedItems={Array.isArray(_.get(localData, 'toUsers')) && localData.toUsers.map(e => e._id)}

                        onRemove={(e) => handleChange('toUsers', [])}
                    />
                </Item>}

                {!_.get(docuentaryConfig, 'recieverPosition.checkedShowForm') ? null : <Item inlineLabel error={error.recieverPosition}>
                    <Label >{convertLabel(_.get(docuentaryConfig['recieverPosition.name'], 'title') || 'Vai trò người nhận')}:</Label>
                    <MultiAPISearch
                        query={{ clientId, moduleCode: code }}
                        API={API_ROLE_GROUPS}
                        onSelectedItemObjectsChange={(e) => handleChange('recieverPosition', e)}
                        selectedItems={Array.isArray(_.get(localData, 'recieverPosition')) && localData.recieverPosition.map(e => e._id)}

                        onRemove={(e) => handleChange('recieverPosition', [])}
                    />
                </Item>}

                {!_.get(docuentaryConfig, 'receiveTime.checkedShowForm') ? null : <Item inlineLabel error={error.receiveTime}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'receiveTime.title')) || 'Thời gian nhận'}:</Label>
                    <DateTimePicker
                        mode="datetime"
                        onSave={(e) => handleChange('receiveTime', e)}
                        value={_.get(localData, 'receiveTime') && moment(_.get(localData, 'receiveTime')).format(DATE_FORMAT.DATE_TIME)}

                    />
                </Item>}
                {!_.get(docuentaryConfig, 'replyDeadline.checkedShowForm') ? null : <CustomInput inlineLabel label={'Thời hạn trả lời'} error={error.replyDeadline}>
                    <DateTimePicker
                        mode="datetime"
                        onSave={(e) => handleChange('replyDeadline', e)}
                        value={_.get(localData, 'replyDeadline') && moment(_.get(localData, 'replyDeadline')).format(DATE_FORMAT.DATE_TIME)}
                    />
                </CustomInput>}
                {!_.get(docuentaryConfig, 'storage.checkedShowForm') ? null : <Item inlineLabel error={error.storage}>
                    <Label >{convertLabel(_.get(docuentaryConfig, 'storage.title')) || 'Nơi lưu trữ công văn'}:</Label>
                    <Search
                        single
                        handleSelectItems={(value) => handleChange('storage', value)}
                        onRemoveSelectedItem={() => handleChange('storage', null)}
                        selectedItems={Array.isArray(_.get(localData, 'storage')) && localData.storage.map(e => e._id)}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S22']}
                    />
                </Item>}
                {!_.get(docuentaryConfig, 'urgency.checkedShowForm') ? null : <CustomInput inlineLabel label={'Độ khẩn'} error={error.urgency}>
                    <Search
                        single
                        handleSelectItems={(value) => handleChange('urgency', value)}
                        onRemoveSelectedItem={() => handleChange('urgency', null)}
                        selectedItems={localData.urgency ? [localData.urgency] : []}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S20']}
                    />
                </CustomInput>}
                {!_.get(docuentaryConfig, 'density.checkedShowForm') ? null : <CustomInput inlineLabel label={'Độ mật'} error={error.density}>
                    <Search
                        single
                        handleSelectObjectItems={(value) => handleChange('density', value[0])}
                        onRemoveSelectedItem={() => handleChange('density', null)}
                        selectedItems={localData.density ? [localData.density] : []}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S21']}
                    />

                </CustomInput>}

                {!_.get(docuentaryConfig, 'receiverSign.checkedShowForm') ? null : <CustomInput inlineLabel label={'Người ký nhận'} error={error.receiverSign}>
                    <SingleAPISearch
                        Single
                        API={API_USERS}
                        onSelectedItemObjectsChange={(value) => handleChange('receiverSign', value.length ? value[0] : null)}
                        selectedItems={_.get(localData, 'receiverSign._id')}

                    />
                </CustomInput>}

                {!_.get(docuentaryConfig, 'viewer.checkedSshowForm') ? null : <CustomInput inlineLabel label={'Người xem'} error={error.viewer}>
                    <MultiAPISearch
                        API={API_USERS}
                        onSelectedItemObjectsChange={(e) => handleChange('viewer', e)}
                        selectedItems={Array.isArray(_.get(localData, 'viewer')) && localData.viewer.map(e => e._id)}
                    />
                </CustomInput>}

                {!_.get(docuentaryConfig, 'content.checkedSshowForm') ? null : <CustomInput inlineLabel label={'Nội dung'} error={error.content}>
                    <Input value={_.get(localData, 'content')} style={styles.input} onChangeText={(e) => handleChange('content', e)} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </CustomInput>}
            </Content>

            <LoadingButton isBusy={saving} block handlePress={handleAdd}>
                <Icon name="check" type="Feather" />
            </LoadingButton>
        </Container >
    )
}

const mapStateToProps = createStructuredSelector({
    crmSourceCode: crmSourceCode(),
    icomingdocumentConfig: makeSelectViewConfig(MODULE.INCOMINGDOCUMENT),
    docuentaryConfig: makeSelectViewConfig(MODULE.DOCUMENTARY),
    clientId: makeSelectClientId(),
    officialdispatchPage: makeSelectOfficialdispatchPage()
});

function mapDispatchToProps(dispatch) {
    return {
    };

}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CreatDocumentary);

const styles = {
    view: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 2
    },
    icon: {
        fontSize: 18,
        opacity: 0.4,
        marginTop: 0
    },
    input: {
        textAlign: 'right',
        marginRight: 5,
        minHeight: 45,
        paddingTop: 10,
    }
}