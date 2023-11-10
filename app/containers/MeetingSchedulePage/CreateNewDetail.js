import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { View, ScrollView } from 'react-native';
import { compose } from 'redux';
import moment from 'moment';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { API_CUSTOMER, API_USERS, API_TASK_TASKS, MEETING_DEPARTENT } from '../../configs/Paths';
import { getProfile } from '../../utils/authen';
import { Container, Item, Icon, Form, Label, Input, Textarea } from 'native-base';
import LoadingButton from '../../components/LoadingButton';
import { useInput } from '../../utils/useInput';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import * as actions from './actions';
import _ from 'lodash';
import BackHeader from '../../components/Header/BackHeader';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import { makeSelectViewConfig } from '../App/selectors'
import { DATE_FORMAT, MODULE } from '../../utils/constants'

function CreateNewDetail(props) {
    useInjectReducer({ key: 'createNewDetail', reducer });
    useInjectSaga({ key: 'createNewDetail', saga });

    const [localData, setLocalData] = useState({})
    const [error, setError] = useState({});

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

    const { navigation, saveSchedule, calendarConfig } = props;

    const handleAdd = async () => {
        const createBy = await getProfile()
        const body = {
            code: localData.code,
            content: localData.content,
            createBy,
            people: localData.people,
            // content,
            from: '5e0464fd09ea5f2a2c249306',
            date: localData.startDate,
            link: 'Calendar/roomMeeting-calendar',
            kanbanStatus: '1',
            customers: localData.customers,
            task: localData.task,
            name: localData.name,
            address: localData.address,
            startDate: localData.startDate,
            endDate: localData.endDate,
            prepare: localData.prepare,
            roomMeeting: localData.roomMeeting[0],
            organizer: localData.organizer,
            prepareMeeting: localData.prepareMeeting,
            documentary: null,
        }
        saveSchedule(body)
    }
    const convert = (string) => {
        return string.charAt().toUpperCase() + string.slice(1).toLowerCase();
    }

    return (
        <Container>
            <BackHeader
                title="Thêm Mới Lịch Họp "
                navigation={navigation}
            />

            <ScrollView >
                <View style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form style={{ flex: 1, backgroundColor: '#fff' }}>
                        <Item inlineLabel >
                            <Label >{convert(_.get(calendarConfig, 'code.title')) || 'Mã cuộc họp'}:</Label>
                            <Input multiline value={localData.code} onChangeText={e => handleChange('code', e)} style={styles.input} />
                            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                        </Item>
                        <Item inlineLabel style={{}}>
                            <Label>Tên Cuộc Họp</Label>
                            <Input multiline value={localData.name} onChangeText={e => handleChange('name', e)} style={styles.input} />
                            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                        </Item>

                        <Item inlineLabel>
                            <Label>Thời gian bắt đầu:</Label>
                            <DateTimePicker
                                mode="datetime"
                                onSave={(e) => handleChange('startDate', e)}
                                value={localData.startDate && moment(localData.startDate).format(DATE_FORMAT.DATE_TIME)}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>Thời gian kết thúc:</Label>
                            <DateTimePicker
                                mode="datetime"
                                onSave={(e) => handleChange('endDate', e)}
                                value={localData.endDate && moment(localData.endDate).format(DATE_FORMAT.DATE_TIME)}
                            />
                        </Item>

                        <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Label>Phòng Họp</Label>

                            <SingleAPISearch
                                Single
                                API={MEETING_DEPARTENT}
                                onSelectedItemsChange={(value) => handleChange('roomMeeting', value)}
                                selectedItems={_.get(localData, 'roomMeeting[0]')}
                            />
                        </Item>
                        <Item inlineLabel style={{}}>
                            <Label >Địa Điểm Họp</Label>
                            <Input multiline value={localData.address} onChangeText={e => handleChange('address', e)} style={styles.input} />
                            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                        </Item>

                        <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Label>Công Việc Dự Án:</Label>
                            <SingleAPISearch
                                query={{ filter: { isProject: true } }}
                                API={API_TASK_TASKS}
                                onSelectedItemObjectsChange={(value) => handleChange('task', value)}
                                selectedItems={_.get(localData, 'task[0]._id')}
                            />
                        </Item>
                        <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Label>Người Chuẩn Bị:</Label>
                            <MultiAPISearch
                                API={API_USERS}
                                onSelectedItemObjectsChange={(e) => handleChange('prepare', e)}
                                selectedItems={_.get(localData._id, 'prepare[]._id')}

                            />

                        </Item>
                        <Item inlineLabel style={{}}>
                            <Label >Chuẩn bị cuộc họp</Label>
                            <Input multiline value={localData.prepareMeeting} onChangeText={e => handleChange('prepareMeeting', e)} style={styles.input} />
                            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                        </Item>

                        <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Label>Khách hàng:</Label>
                            <MultiAPISearch
                                API={API_CUSTOMER}
                                onSelectedItemObjectsChange={(e) => handleChange('customers', e)}
                                selectedItems={_.get(localData, 'customers._id')}
                            />
                        </Item>
                        <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Label>Người tham gia:</Label>
                            <MultiAPISearch
                                API={API_USERS}
                                onSelectedItemObjectsChange={(e) => handleChange('people', e)}
                                selectedItems={_.get(localData, 'people._id')}
                            />
                        </Item>
                        <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Label>Người Tổ Chức:</Label>
                            <SingleAPISearch
                                API={API_USERS}
                                onSelectedItemsChange={(value) => handleChange('organizer', value)}
                                selectedItems={localData.organizer}
                            />

                        </Item>
                        <Item inlineLabel style={{}} underline={false}>
                            <Label style={{ marginTop: 10 }}>Nội Dung:</Label>
                        </Item>
                        <View style={{ marginHorizontal: 15 }} >
                            <Textarea
                                rowSpan={5}
                                bordered
                                onChangeText={(val) => handleChange('content', val)}
                                style={{ width: '100%', alignSelf: 'center' }} />
                        </View>
                    </Form>
                </View>
                <View style={{ flexDirection: 'row', margin: 10 }}>
                    <LoadingButton handlePress={handleAdd} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }}>
                        <Icon name="check" type="Feather" style={{ marginLeft: '48%' }} />
                    </LoadingButton>
                </View>
            </ScrollView >
        </Container >
    );

}
const mapStateToProps = createStructuredSelector({
    calendarConfig: makeSelectViewConfig(MODULE.CALENDAR)
});

function CreateNewToProps(dispatch) {
    return {
        saveSchedule: (data) => dispatch(actions.addScheduleMettingSchedule(data)),

    };
}

const withConnect = connect(mapStateToProps, CreateNewToProps);

export default compose(withConnect)(CreateNewDetail);
const styles = {
    input: {
        textAlign: 'right',
        marginRight: 5,
        minHeight: 42
    }
}


