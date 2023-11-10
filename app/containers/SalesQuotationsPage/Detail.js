import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Text, View, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';
import { compose } from 'redux';
import moment from 'moment';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectSalesQuotationsPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import CustomHeader from '../../components/Header';
import RightHeader from '../../components/CustomFilter/RightHeader';
import FabLayout from '../../components/CustomFab/FabLayout';
import ListPage from '../../components/ListPage';
import { API_CUSTOMER, API_USERS, API_TASK_CONFIG, API_TASK_TASKS, MEETING_DEPARTENT } from '../../configs/Paths';
import { getProfile } from '../../utils/authen';
import { Header, Container, Card, CardItem, Item, Icon, Form, Label, Input, Button, Textarea } from 'native-base';
import Modal from 'react-native-modal';
import LoadingButton from '../../components/LoadingButton';
import { TouchableWithoutFeedback } from 'react-native';
import { useInput } from '../../utils/useInput';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import CustomInput from '../../components/CustomInput';
import CustomDateTimePicker from '../../components/CustomDateTimePicker';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import { handleSearch } from '../../utils/common';
import ToastCustom from '../../components/ToastCustom';
import * as actions from './actions';
import _ from 'lodash';
import BackHeader from '../../components/Header/BackHeader';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import LoadingLayout from '../../components/LoadingLayout';
import { DATE_FORMAT } from '../../utils/constants';
const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

export function SalesQuotationsDatailPage(props) {
    useInjectReducer({ key: 'SalesQuotationsPage', reducer });
    useInjectSaga({ key: 'SalesQuotationsPage', saga });

    const { navigation, mapMeeting, meetingDetailPage, updateSchedule, route, onClean, saveSchedule, } = props;
    const { meeting, isLoading, updating, updateSuccess } = meetingDetailPage
    const { params } = route
    const { onSuccess } = params || {}

    const [localData, setLocalData] = useState({})
    const isUpdate = _.has(params, 'item._id')

    useEffect(() => {
        if (isUpdate) {
            mapMeeting(params['item._id'])
        }

        return () => {
            onClean()
        }
    }, [params])

    useEffect(() => {
        if (updateSuccess) {
            navigation.goBack()
            onSuccess && onSuccess()
        }
    }, [updateSuccess])

    useEffect(() => {
        if (meeting) {
            const { organizer } = meeting
            const newData = { ...meeting }

            // if (_.has(organizer, 'organizer.employeeId')) newData.organizer._id = newData.organizer.employeeId

            setLocalData(newData)
        } else setLocalData({})
    }, [meeting])

    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value
        if (key === 'roomMetting') newData['address'] = value.address
        setLocalData({ ...localData, ...newData });
    };

    const handleAdd = async () => {
        let body = {
            ...localData,
            address: localData.address,
            code: localData.code,
            content: localData.content || '',
            customers: localData.customers,
            name: localData.name,
            organizer: localData.organizer,
            people: localData.people,
            prepare: localData.prepare,
            prepareMeeting: localData.prepareMeeting || '',
            roomMetting: localData.roomMetting,
            task: localData.task,
            timeStart: localData.timeStart,
            timeEnd: localData.timeEnd
        }

        if (isUpdate) {
            updateSchedule(body)
        }
        else {
            getProfile().then(profile => {
                body = {
                    ...body,
                    date: moment().toISOString(),
                    kanbanStatus: '1',
                    link: 'Calendar/meeting-calendar',
                    typeCalendar: 1,
                    createdBy: {
                        employeeId: profile.employeeId || profile._id,
                        name: profile.name
                    },
                    from: '5e0464fd09ea5f2a2c249306'
                }
                saveSchedule(body)
            })

        }
    };

    return (
        <Container>
            <BackHeader
                title={isUpdate ? "Chi tiết lịch họp" : 'Thêm mới lịch họp'}
                navigation={navigation}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
            <LoadingLayout isLoading={isLoading}>
                <ScrollView>
                    <View style={{ display: 'flex', justifyContent: 'center' }}>
                        <Form style={{ flex: 1, backgroundColor: '#fff' }}>
                            <Item inlineLabel style={{}}>
                                <Label>Tên Cuộc Họp</Label>
                                <Input value={localData.name} onChangeText={e => handleChange('name', e)} style={styles.input} />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                            </Item>
                            <Item inlineLabel style={{}}>
                                <Label >Mã Cuộc Họp</Label>
                                <Input value={localData.code} onChangeText={e => handleChange('code', e)} style={styles.input} />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                            </Item>
                            <Item inlineLabel>
                                <Label>Thời gian bắt đầu: </Label>
                                <DateTimePicker
                                    mode="datetime"
                                    onSave={(e) => handleChange('timeStart', e)}
                                    value={localData.timeStart && moment(localData.timeStart).format(DATE_FORMAT.DATE_TIME)}
                                />
                            </Item>

                            <Item inlineLabel>
                                <Label>Thời gian kết thúc: </Label>
                                <DateTimePicker
                                    mode="datetime"
                                    onSave={(e) => handleChange('timeEnd', e)}
                                    value={localData.timeEnd && moment(localData.timeEnd).format(DATE_FORMAT.DATE_TIME)}
                                />
                            </Item>

                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Label>Phòng Họp</Label>

                                <SingleAPISearch
                                    Single
                                    API={MEETING_DEPARTENT}
                                    onSelectedItemObjectsChange={(value) => handleChange('roomMetting', value.length ? value[0] : null)}
                                    selectedItems={_.get(localData, 'roomMetting._id')}
                                    selectedDatas={_.get(meeting, 'roomMetting') && [_.get(meeting, 'roomMetting')]}
                                />
                            </Item>
                            <Item inlineLabel style={{}}>
                                <Label >Địa Điểm Họp</Label>
                                <Input multiline value={localData.address} onChangeText={e => handleChange('address', e)} style={styles.input} />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                            </Item>

                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Label>Công Việc Dự Án: </Label>
                                <SingleAPISearch
                                    query={{ filter: { isProject: true } }}
                                    API={API_TASK_TASKS}
                                    onSelectedItemObjectsChange={(value) => handleChange('task', value.length ? value[0] : null)}
                                    selectedItems={_.get(localData, 'task._id')}
                                    selectedDatas={_.get(meeting, 'task') && [_.get(meeting, 'task')]}
                                />
                            </Item>
                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Label>Người Chuẩn Bị: </Label>
                                <MultiAPISearch
                                    API={API_USERS}
                                    onSelectedItemObjectsChange={(e) => handleChange('prepare', e)}
                                    selectedItems={Array.isArray(_.get(localData, 'prepare')) && localData.prepare.map(e => e._id)}
                                    selectedDatas={_.get(meeting, 'prepare')}
                                />

                            </Item>
                            <Item inlineLabel style={{}}>
                                <Label >Chuẩn bị cuộc họp</Label>
                                <Input multiline value={localData.prepareMeeting} onChangeText={e => handleChange('prepareMeeting', e)} style={styles.input} />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                            </Item>

                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Label>Khách hàng: </Label>
                                <MultiAPISearch
                                    API={API_CUSTOMER}
                                    onSelectedItemObjectsChange={(e) => handleChange('customers', e)}
                                    selectedItems={Array.isArray(_.get(localData, 'customers')) && localData.customers.map(e => e._id)}
                                    selectedDatas={_.get(meeting, 'customers')}
                                />
                            </Item>
                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Label>Người tham gia: </Label>
                                <MultiAPISearch
                                    uniqueKey="employeeId"
                                    API={API_USERS}
                                    onSelectedItemObjectsChange={(e) => handleChange('people', e)}
                                    selectedItems={Array.isArray(_.get(localData, 'people')) && localData.people.map(e => e.employeeId)}
                                    selectedDatas={_.get(meeting, 'people')}
                                    customData={arr => arr.map(e => ({ ...e, employeeId: e.employeeId || e._id }))}
                                />
                            </Item>
                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Label>Người Tổ Chức: </Label>
                                <SingleAPISearch
                                    uniqueKey="employeeId"
                                    API={API_USERS}
                                    onSelectedItemObjectsChange={(value) => handleChange('organizer', value.length ? value[0] : null)}
                                    selectedItems={_.get(localData, 'organizer[0].employeeId')}
                                    selectedDatas={_.get(meeting, 'organizer') && [_.get(meeting, 'organizer')]}
                                    customData={arr => arr.map(e => ({ ...e, employeeId: e.employeeId || e._id }))}
                                />

                            </Item>
                            <Item inlineLabel style={{}} underline={false}>
                                <Label style={{ marginTop: 10 }}>Nội Dung: </Label>
                            </Item>
                            <View style={{ marginHorizontal: 15 }} >
                                <Textarea
                                    rowSpan={5}
                                    bordered
                                    value={_.get(localData, 'content')}
                                    onChangeText={(val) => handleChange('content', val)}
                                    style={{ width: '100%', alignSelf: 'center' }} />
                            </View>
                        </Form>
                    </View>
                    <View style={{ flexDirection: 'row', padding: 10, paddingRight: 20 }}>
                        <LoadingButton isBusy={updating} handlePress={handleAdd} style={{ width: '100%', justifyContent: 'center' }}>
                            <Icon name="check" type="Feather" />
                        </LoadingButton>
                    </View>
                </ScrollView >
            </LoadingLayout>
            </KeyboardAvoidingView>
        </Container >
    );

}

const mapStateToProps = createStructuredSelector({
    meetingDetailPage: makeSelectSalesQuotationsPage()
});

function mapDispatchToProps(dispatch) {
    return {
        mapMeeting: (props) => dispatch(actions.getSalesQuotations(props)),
        saveSchedule: (data) => dispatch(actions.addSalesQuotations(data)),
        updateSchedule: data => dispatch(actions.updateSalesQuotations(data)),
        onClean: () => dispatch(actions.onClean()),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SalesQuotationsDatailPage);

const styles = {
    view: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 2
    },
    icon: {
        fontSize: 18,
        opacity: 0.4,
        marginTop: 1,
        marginRight: 4
    },
    input: {
        textAlign: 'right',
        marginRight: 5,
        minHeight: 42
    }
}

