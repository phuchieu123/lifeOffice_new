import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Text, View, ScrollView, TextInput } from 'react-native';
import { compose } from 'redux';
import moment from 'moment';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectMeetingSchedulePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import CustomHeader from '../../components/Header';
import RightHeader from '../../components/CustomFilter/RightHeader';
import FabLayout from '../../components/CustomFab/FabLayout';
import ListPage from '../../components/ListPage';
import { MEETING_SCHEDULE, API_CUSTOMER, API_USERS, API_TASK_CONFIG, API_TASK_TASKS, MEETING_DEPARTENT } from '../../configs/Paths';
import { getProfile } from '../../utils/authen';
import { Header, Container, Card, CardItem, Item, Icon, Form, Label, Input, Button } from 'native-base';
import Modal from 'react-native-modal';
import LoadingButton from '../../components/LoadingButton';
import { TouchableWithoutFeedback } from 'react-native';
import { useInput } from '../../utils/useInput';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import CustomInput from '../../components/CustomInput';
import CustomDateTimePicker from '../../components/CustomDateTimePicker';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import { checkedRequireForm, handleSearch } from '../../utils/common';
import ToastCustom from '../../components/ToastCustom';
import * as actions from './actions';
import _ from 'lodash';
import { MODULE } from '../../utils/constants';
import { makeSelectViewConfig } from '../App/selectors';
import { validateForm } from '../../utils/validate';

const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

function CreateWorkingSchedule(props) {
    useInjectReducer({ key: 'CreateWorkingSchedule', reducer });
    useInjectSaga({ key: 'CreateWorkingSchedule', saga });
    const [localData, setLocalData] = useState({})
    const [error, setError] = useState()
    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value


        setLocalData({ ...localData, ...newData });
    }

    const checkValid = () => {
        let updateList = 'name, customers,startDate,endDate,people,organizer,approved'
            .replace(/ /g, '').split(',').reduce((a, v) => ({ ...a, [v]: v }), {})
        const { isValid, errorList, firstMessage } = validateForm(caledarRoles, localData, updateList)
        let valid = isValid
        let msg = firstMessage
        let err = errorList
        if (!valid && msg) ToastCustom({ text: msg, type: 'danger' })
        setError(err)
        return valid;
    };



    const handleAdd = async () => {
        const createBy = await getProfile();
        if (checkValid) {
            const body = {
                code: localData.code,
                content: localData.content,
                result: localData.result,
                createBy,
                people: localData.people,
                // content,
                from: '5e0464fd09ea5f2a2c249306',
                date: localData.startDate,
                link: 'Calendar/roomMeeting-calendar',
                kanbanStatus: '1',
                customers: localData.customers,
                approved: localData.approved,
                name: localData.name,
                address: "",
                startDate: localData.startDate,
                endDate: localData.endDate,

                organizer: localData.organizer,
            }

            saveWorkingSchedule(body);
        }
    }
    // const { value: customers, setValue: setCustomer } = useInput([]);
    //  const [people, setApproveGroupsOption] = useState([]);
    // const { value: participation, setValue: setParticipation } = useInput([]);
    // const { value: organizer, setValue: setOrganization } = useInput([]);

    const { value: join, setValue: setJoin } = useInput([]);

    const [showStartDate, setShowStartDate] = useState(false);
    const [showEndDate, setShowEndDate] = useState(false);
    const { value: startDate, setValue: setStartDate, valid: validStartDate, setValid: setValidStartDate } = useInput('');
    const { value: endDate, setValue: setEndDate, valid: validEndDate, setValid: setValidEndDate } = useInput('');
    const { navigation, saveSchedule, saveWorkingSchedule, caledarRoles } = props;


    return (
        <Container>
            <CustomHeader
                title="Thêm Mới Lịch Công Tác"
                navigation={navigation}
            />
            <ScrollView >
                <View style={{ display: 'flex', justifyContent: 'center' }}>
                </View>
                <Card >
                    <CardItem >
                        <Form style={{ flex: 1, backgroundColor: '#fff' }}>
                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-evenly' }} error={error.name}>
                                <Label >Tên Cuộc Họp</Label>
                                <Input multiline value={localData.name} onChangeText={e => handleChange('name', e)} style={styles.input} />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                            </Item>
                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Label>Khách hàng:</Label>
                                <MultiAPISearch

                                    API={API_CUSTOMER}
                                    onSelectedItemObjectsChange={(e) => handleChange('customers', e)}
                                    selectedItems={_.get(localData, 'customers._id')}
                                // filterOr={['_id','name']}
                                />
                            </Item>
                            <TouchableWithoutFeedback onPress={() => setShowStartDate(true)}>
                                <Item inlineLabel error={!validStartDate} style={{ textAlign: 'right', marginTop: 10, marginBottom: 10 }}>
                                    <Label>Ngày bắt đầu:</Label>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }}>
                                        <CustomDateTimePicker
                                            mode="datetime"
                                            isVisible={showStartDate}
                                            onConfirm={(date) => {
                                                handleChange('startDate', date);
                                            }}
                                            onCancel={() => {
                                                setShowStartDate(false);
                                            }}
                                        />
                                        <Text style={{ height: 42, textAlignVertical: 'center' }}>
                                            <Text style={{ textAlign: 'right', fontWeight: '600', fontSize: 16 }}>{moment(localData.startDate).format(DATETIME_FORMAT)}</Text>
                                        </Text>
                                        <Icon name="calendar" style={{ fontSize: 20 }} />
                                    </View>
                                </Item>
                            </TouchableWithoutFeedback>

                            <TouchableWithoutFeedback onPress={() => setShowEndDate(true)}>
                                <Item inlineLabel error={!validEndDate} style={{ textAlign: 'right', marginTop: 10, marginBottom: 10 }}>
                                    <Label>Ngày kết thúc:</Label>
                                    <View
                                        style={{
                                            flex: 1,
                                            flexDirection: 'row',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                        }}>
                                        <CustomDateTimePicker
                                            mode="datetime"
                                            isVisible={showEndDate}
                                            onConfirm={(date) => handleChange('endDate', date)}
                                            onCancel={() => setShowEndDate(false)}
                                        />
                                        <Text style={{ height: 42, textAlignVertical: 'center' }}>
                                            <Text style={{ textAlign: 'right', fontWeight: '600', fontSize: 16 }}>{moment(localData.endDate).format(DATETIME_FORMAT)}</Text>
                                        </Text>
                                        <Icon name="calendar" style={{ fontSize: 20 }} />
                                    </View>
                                </Item>
                            </TouchableWithoutFeedback>
                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Label>Người tham gia:</Label>
                                <MultiAPISearch
                                    API={API_USERS}
                                    onSelectedItemObjectsChange={(e) => handleChange('people', e)}
                                    selectedItems={_.get(localData, 'people._id')}

                                />
                            </Item>
                            <TouchableWithoutFeedback >
                                <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Label>Người Tổ Chức:</Label>
                                    <SingleAPISearch
                                        API={API_USERS}
                                        onSelectedItemsChange={(value) => handleChange('organizer', value)}
                                        selectedItems={localData.organizer}
                                    // filterOr={['name',employeeId]}
                                    />

                                </Item>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback >
                                <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Label>Người Phê Duyệt:</Label>
                                    <SingleAPISearch
                                        API={API_USERS}
                                        onSelectedItemsChange={(value) => handleChange('approved', value)}
                                        selectedItems={localData.approved}
                                    // filterOr={['name',employeeId]}
                                    />

                                </Item>
                            </TouchableWithoutFeedback>
                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <Label >Nội Dung</Label>
                                <Input
                                    style={{ textAlign: 'right', height: 42 }}
                                    onChangeText={(val) => handleChange('content', val)}
                                />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                            </Item>
                            <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                <Label >Kết Quả</Label>
                                <Input
                                    style={{ textAlign: 'right', height: 42 }}
                                    onChangeText={(val) => handleChange('result', val)}
                                />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                            </Item>
                        </Form>

                    </CardItem>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <LoadingButton handlePress={handleAdd} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }}>
                            <Icon name="check" type="Feather" style={{ marginLeft: '48%' }} />
                        </LoadingButton>
                    </View>
                </Card>
            </ScrollView>
        </Container>



    );

}
const mapStateToProps = createStructuredSelector({
    caledarRoles: makeSelectViewConfig(MODULE.CALENDAR),
});

function CreateNewToProps(dispatch) {
    return {
        saveWorkingSchedule: (data) => dispatch(actions.addWorkingScheduleSchedule(data)),

    };
}

const withConnect = connect(CreateNewToProps, mapStateToProps);

export default compose(withConnect)(CreateWorkingSchedule);
const styles = {
    input: {
        textAlign: 'right',
        marginRight: 5,
        minHeight: 45
    }
}