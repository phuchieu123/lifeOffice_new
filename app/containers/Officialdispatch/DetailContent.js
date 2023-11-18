import React, { useState, useEffect } from 'react';
import { Body, Card, CardItem, Container, Content, Input, Label, Item, ListItem, Right, Button, ActionSheet, Tabs, Tab, TabHeading } from 'native-base';
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
import { ScrollView, Text, View, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import LoadingButton from '../../components/LoadingButton';
import { crmSourceCode, makeSelectViewConfig, makeSelectClientId, makeSelectUserRole } from '../App/selectors';
import { DATE_FORMAT, MODULE } from '../../utils/constants';
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
const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
function DetailContent(props) {
    useInjectReducer({ key: 'officialdispatch', reducer });
    useInjectSaga({ key: 'officialdispatch', saga });
    const { navigation, crmSourceCode, icomingdocumentConfig, docuentaryConfig, clientId, onUpdateOfficialdispatch, localData, params, projectTask } = props;
    const {PUT} = projectTask
    // const { params } = route
    const [error, setError] = useState({});

    const [isComingDoc, setIsComingDoc] = useState()
    const [isUpdate, setIsUpdate] = useState()
    const [showFile, setShowFile] = useState()
    const [code, setCode] = useState()
    const [query, setQuery] = useState({})
    const [saving, setSaving] = useState(false)
    const [converData, setConverData] = useState(params)

    useEffect(() => {
        setIsComingDoc(converData.type === 2)
        const newCode = converData.type === 2 ? 'inComingDocument' : 'outGoingDocument'
        setCode(newCode)

    }, [converData.type])


    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value
        setConverData({ ...converData, ...newData });
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
    const [reload, setReload] = useState(0)
    const handleReload = () => setReload(reload + 1)
    const newFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })
            await addFile({ folder, clientId, path: body.body.path, file: res[0] })
            handleReload()
            ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
        } catch (err) {
            ToastCustom({ text: 'Thêm mới không thành công', type: 'danger' })
        }
    }
    const handleSubmit = async () => {
        setSaving(true)
        try {
            let data = {
                ...converData,

            }
            if (isUpdate) {
                onUpdateOfficialdispatch(data)

            }
            else {
                onUpdateOfficialdispatch(data)
                DeviceEventEmitter.emit('updateOfficialdispatchSuccess')
                navigation.goBack()
            }
        } catch (err) { }
        setSaving(false)
    };
    const convert = (string) => {
        return string.charAt().toUpperCase() + string.slice(1).toLowerCase();
    }

    return (

        <TouchableWithoutFeedback
        
        onPress={Keyboard.dismiss}>
            <ScrollView
            keyboardShouldPersistTaps="always"
           onScroll={()=> Keyboard.dismiss()}
      >
            <View style={{ marginHorizontal: 5, marginVertical: 10 }}>

                {!_.get(docuentaryConfig, 'code.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.code} >
                    <Text >{convert(_.get(docuentaryConfig, 'code.title')) || 'Mã cuộc họp'}:</Text>
                    <TextInput value={converData.code} style={styles.input} disabled={true} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </View>}

                {!_.get(docuentaryConfig, 'name.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.name}>
                    <Text >{convert(_.get(docuentaryConfig, 'name.title')) || 'Tên công văn'}:</Text>
                    <TextInput disabled={!docuentaryConfig} value={converData.name} style={styles.input} onChangeText={(e) => handleChange('name', e)} multiline={true} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </View>}

                {!_.get(docuentaryConfig, 'typeDocument.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.typeDocument}>
                    <Text >{convert(_.get(docuentaryConfig, 'typeDocument.title')) || 'Loại công văn'}:</Text>
                    <Search
                        single
                        disabled={!PUT}
                        handleSelectItems={(value) => handleChange('typeDocument', value[0])}
                        onRemoveSelectedItem={() => handleChange('typeDocument', null)}
                        selectedItems={converData.typeDocument ? [converData.typeDocument] : []}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S19']}
                        readOnly={!docuentaryConfig}
                    />

                </View>}

                {!_.get(docuentaryConfig, 'task.checkedShowForm') ? null : <View  inlineLabel style={{ display: 'flex', justifyContent: 'space-between', ...styles.item }} error={error.task}>
                    <Text >{convert(_.get(docuentaryConfig, 'task.title')) || 'Công việc dự án'}:</Text>
                    <SingleAPISearch
                        Single
                        disabled={!PUT}
                        API={API_TASK}
                        onSelectedItemObjectsChange={(value) => handleChange('task', value.length ? value[0] : null)}
                        selectedItems={_.get(converData, 'task._id')}
                        selectedDatas={_.get(converData, 'task') && [_.get(converData, 'task')]}
                        readOnly={!docuentaryConfig}
                    />
                </View>}

                {!_.get(docuentaryConfig, 'customers.checkedShowForm') ? null : <View inlineLabel style={{ display: 'flex', justifyContent: 'space-between', ...styles.item }} error={error.customers}>
                    <Text >{convert(_.get(docuentaryConfig, 'customers.title')) || 'Khách hàng'}:</Text>
                    <MultiAPISearch
                        disabled={!PUT}
                        API={API_CUSTOMER}
                        onSelectedItemObjectsChange={(e) => handleChange('customers', e)}
                        selectedItems={Array.isArray(_.get(converData, 'customers')) && converData.customers.map(e => e._id)}
                        selectedDatas={_.get(converData, 'customers')}
                    />
                </View>}

                {!_.get(docuentaryConfig, 'abstract.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.abstract}>
                    <Text >{convert(_.get(docuentaryConfig, 'abstract.title')) || 'Tóm lược'}:</Text>
                    <TextInput disabled={!docuentaryConfig} multiline={true} value={_.get(converData, 'abstract')} style={styles.input} onChangeText={(e) => handleChange('abstract', e)} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </View>}

                {!_.get(docuentaryConfig, 'replyDispatch.checkedShowForm') ? null : <View   inlineLabel style={{ display: 'flex', justifyContent: 'space-between', ...styles.item }} error={error.replyDispatch}>
                    <Text >{convert(_.get(docuentaryConfig, 'replyDispatch.title')) || 'Công văn trả lời'}:</Text>
                    <SingleAPISearch
                        disabled={!PUT}
                        API={API_DOCUMENTARY}
                        onSelectedItemObjectsChange={(value) => handleChange('replyDispatch', value.length ? value[0] : null)}
                        selectedItems={_.get(converData, 'replyDispatch._id')}
                        selectedDatas={_.get(converData, 'replyDispatch') && [_.get(converData, 'replyDispatch')]}
                        readOnly={!docuentaryConfig}
                    />

                </View>}

                {!_.get(docuentaryConfig, 'officialDispatch.checkedShowForm') ? null : <View  inlineLabel style={{ display: 'flex', justifyContent: 'space-between',...styles.item }} error={error.officialDispatch}>
                    <Text >{convert(_.get(docuentaryConfig, 'officialDispatch.title')) || 'Công văn chính thức'}:</Text>
                    <SingleAPISearch
                        disabled={!PUT}
                        API={API_DOCUMENTARY}
                        onSelectedItemObjectsChange={(value) => handleChange('officialDispatch', value.length ? value[0] : null)}
                        selectedItems={_.get(converData, 'officialDispatch._id')}
                        selectedDatas={_.get(converData, 'officialDispatch') && [_.get(converData, 'officialDispatch')]}
                        readOnly={!docuentaryConfig}
                    />
                </View>}

                {!_.get(docuentaryConfig, 'where.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.where}>
                    <Text >{convert(_.get(docuentaryConfig, 'where.title')) || 'Nơi phát hành công văn'}:</Text>
                    <Search
                        single
                        disabled={!PUT}
                        handleSelectItems={(value) => handleChange('where', value[0])}
                        onRemoveSelectedItem={() => handleChange('where', null)}
                        selectedItems={converData.where ? [converData.where] : []}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S23']}
                        readOnly={!docuentaryConfig}
                    />
                </View>}
                {!_.get(docuentaryConfig, 'toDate.checkedShowForm') ? null : <View style={styles.item} inlineLabel>
                    <Text >{convert(_.get(docuentaryConfig, 'toDate.title')) || 'Ngày gửi'}:</Text>
                    <DateTimePicker
                        disabled={!PUT}
                        mode="datetime"
                        onSave={(e) => handleChange('toDate', e)}
                        value={converData.toDate && moment(converData.toDate).format(DATE_FORMAT.DATE_TIME)}
                    />
                </View>}

                {!_.get(docuentaryConfig, 'signer.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.singner}>
                    <Text >{convert(_.get(docuentaryConfig, 'signer.title')) || 'Người ký'}:</Text>
                    <TextInput disabled={!docuentaryConfig} multiline={true} value={_.get(converData, 'signer')} style={styles.input} onChangeText={(e) => handleChange('signer', e)} />
                </View>}

                {!_.get(docuentaryConfig, 'signerPosition.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.signerPosition}>
                    <Text >{convert(_.get(docuentaryConfig, 'signerPosition.title')) || 'Chức vụ'}:</Text>
                    <TextInput readOnly={!docuentaryConfig} disabled={!PUT} value={_.get(converData, 'signerPosition')} style={styles.input} onChangeText={(e) => handleChange('signerPosition', e)} />
                </View>}

                {!_.get(docuentaryConfig, 'receivingUnit.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.receivingUnit}>
                    <Text >{convert(_.get(docuentaryConfig, 'receivingUnit.title')) || 'Đơn vị nhận'}:</Text>
                    <DepartmentSelect
                        single
                        disabled={!PUT}
                        handleSelectItems={(value) => handleChange('receivingUnit', value)}
                        selectedItems={_.get(converData, 'receivingUnit') ? [_.get(converData, 'receivingUnit')] : []}
                    />
                </View>}

                {!_.get(docuentaryConfig, 'toUsers.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.toUsers}>
                    <Text >{convert(_.get(docuentaryConfig, 'toUsers.title')) || 'Người Nhận'}:</Text>
                    <MultiAPISearch
                        API={API_USERS}
                        disabled={!PUT}
                        // onSelectedItemChange={(value) => handleChange('toUsers', value)}
                        // selectedItems={_.get(converData, 'toUsers')}
                        // selectedDatas={_.get(converData, 'toUsers') && _.get(converData, 'toUsers')}
                        onSelectedItemObjectsChange={(e) => handleChange('toUsers', e)}
                        selectedItems={Array.isArray(_.get(converData, 'toUsers')) && converData.toUsers.map(e => e._id)}
                        selectedDatas={_.get(converData, 'toUsers')}
                        onRemove={(e) => handleChange('toUsers', [])}
                    />
                </View>}

                {!_.get(docuentaryConfig, 'recieverPosition.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.recieverPosition}>
                    <Text >{convert(_.get(docuentaryConfig['recieverPosition.name'], 'title') || 'Vai trò người nhận')}:</Text>
                    <MultiAPISearch
                        disabled={!PUT}
                        query={{ clientId, moduleCode: code }}
                        API={API_ROLE_GROUPS}
                        onSelectedItemObjectsChange={(e) => handleChange('recieverPosition', e)}
                        selectedItems={Array.isArray(_.get(converData, 'recieverPosition')) && converData.recieverPosition.map(e => e._id)}
                        selectedDatas={_.get(converData, 'recieverPosition')}
                        onRemove={(e) => handleChange('recieverPosition', [])}
                    />
                </View>}

                {!_.get(docuentaryConfig, 'receiveTime.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.receiveTime}>
                    <Text >{convert(_.get(docuentaryConfig, 'receiveTime.title')) || 'Thời gian nhận'}:</Text>
                    <DateTimePicker
                        disabled={!PUT}
                        mode="datetime"
                        onSave={(e) => handleChange('receiveTime', e)}
                        value={_.get(converData, 'receiveTime') && moment(_.get(converData, 'receiveTime')).format(DATE_FORMAT.DATE_TIME)}
                    />
                </View>}
                {isComingDoc && <CustomInput inlineLabel label={'Thời hạn trả lời'}>
                    <DateTimePicker
                        disabled={!PUT}
                        mode="datetime"
                        onSave={(e) => handleChange('replyDeadline', e)}
                        value={_.get(converData, 'replyDeadline') && moment(_.get(converData, 'replyDeadline')).format(DATE_FORMAT.DATE_TIME)}
                    />
                </CustomInput>}
                {!_.get(docuentaryConfig, 'storage.checkedShowForm') ? null : <View style={styles.item} inlineLabel error={error.storage}>
                    <Text >{convert(_.get(docuentaryConfig, 'storage.title')) || 'Nơi lưu trữ công văn'}:</Text>
                    <Search
                        disabled={!PUT}
                        single
                        handleSelectItems={(value) => handleChange('storage', value.length ? value[0] : "")}
                        onRemoveSelectedItem={() => handleChange('storage', null)}
                        selectedItems={converData.storage ? [converData.storage] : []}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S22']}
                        readOnly={!docuentaryConfig}
                    />
                </View>}
                {!_.get(docuentaryConfig, 'urgency.checkedShowForm') ? null : <CustomInput  inlineLabel label={'Độ khẩn'} error={error.urgency}>
                    <Search
                        disabled={!PUT}
                        single
                        handleSelectItems={(value) => handleChange('urgency', value.length ? value[0] : null)}
                        onRemoveSelectedItem={() => handleChange('urgency', null)}
                        selectedItems={converData.urgency ? [converData.urgency] : []}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S20']}
                        readOnly={!docuentaryConfig}
                    />
                </CustomInput>}

                {!_.get(docuentaryConfig, 'density.checkedShowForm') ? null : <CustomInput inlineLabel label={'Độ mật'} error={error.density}>
                    <Search
                        disabled={!PUT}
                        single
                        handleSelectItems={(value) => handleChange('density', value.length ? value[0] : null)}
                        onRemoveSelectedItem={() => handleChange('density', null)}
                        selectedItems={converData.density ? [converData.density] : []}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S21']}
                        readOnly={!docuentaryConfig}
                    />

                </CustomInput>}

                {!_.get(docuentaryConfig, 'receiverSign.checkedShowForm') ? null : <CustomInput inlineLabel label={'Người ký nhận'} error={error.receiverSign}>
                    <SingleAPISearch
                        Single
                        disabled={!PUT}
                        API={API_USERS}
                        onSelectedItemObjectsChange={(value) => handleChange('receiverSign', value.length ? value[0] : null)}
                        selectedItems={_.get(converData, 'receiverSign._id')}
                        selectedDatas={_.get(converData, 'receiverSign') && [_.get(converData, 'receiverSign')]}
                        readOnly={!docuentaryConfig}
                    />
                </CustomInput>}

                {!_.get(docuentaryConfig, 'viewer.checkedSshowForm') ? null : <CustomInput inlineLabel label={'Người xem'} error={error.viewer}>
                    <MultiAPISearch
                        disabled={!PUT}
                        API={API_USERS}
                        onSelectedItemObjectsChange={(e) => handleChange('viewer', e)}
                        selectedItems={Array.isArray(_.get(converData, 'viewer')) && converData.viewer.map(e => e._id)}
                        selectedDatas={_.get(converData, 'viewer')}
                    />
                </CustomInput>}

                {!_.get(docuentaryConfig, 'content.checkedSshowForm') ? null : <CustomInput inlineLabel label={'Nội dung'} error={error.content}>
                    <TextInput disabled={!docuentaryConfig} value={_.get(converData, 'content')} style={styles.input} onChangeText={(e) => handleChange('content', e)} multiline={true} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </CustomInput>}

                {isUpdate &&
                    <>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-end', marginLeft: 20 }}>



                            <View>
                                <Button onPress={() => setShowFile(e => !e ? true : false)} transparent iconView light={!showFile}>
                                    <Icon type="FontAwesome" name="file-text" />
                                </Button>

                            </View>

                            <Button style={{ backgroundColor: '#fff' }} onPress={() => newFile()} transparent iconRight>
                                <Icon type="FontAwesome" name="plus" style={{ color: '#ccc' }} />
                            </Button>



                        </View>
                    </>}

            </View>

            {!projectTask.POST ? null : <LoadingButton style={{paddingVertical: 10, backgroundColor:'rgba(46, 149, 46, 1)', marginHorizontal: 20, borderRadius: 20 }} isBusy={saving} block handlePress={handleSubmit}>
                <Icon name="check" type="Feather" style={{color:'white', textAlign:'center',fontSize: 20 }} />
            </LoadingButton>}
            {/* <View style={{ flexDirection: 'row', padding: 10, paddingRight: 20 }}>
                <LoadingButton isBusy={'updating'} handlePress={'handleAdd'} style={{ width: '100%', justifyContent: 'center' }}>
                    <Icon name="check" type="Feather" />
                </LoadingButton>
            </View> */}
        </ScrollView>
        </TouchableWithoutFeedback>
    )
}


const mapStateToProps = createStructuredSelector({
    crmSourceCode: crmSourceCode(),
    icomingdocumentConfig: makeSelectViewConfig(MODULE.INCOMINGDOCUMENT),
    docuentaryConfig: makeSelectViewConfig(MODULE.DOCUMENTARY),
    clientId: makeSelectClientId(),
    projectTask: makeSelectUserRole(MODULE.DOCUMENTARY),
});

function mapDispatchToProps(dispatch) {
    return {
        onUpdateOfficialdispatch: (Officialdispatch) => dispatch(actions.updateOfficialdispatch(Officialdispatch)),
    };

}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(DetailContent);

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
        marginRight: 5,
        padding: 0,
        minHeight: 45
    },
    item: {
        paddingHorizontal: 5,
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
          borderBottomWidth: 1,
          borderColor: 'gray'

      
    }
}