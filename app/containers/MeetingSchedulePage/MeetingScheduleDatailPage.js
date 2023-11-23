import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStructuredSelector } from 'reselect';
import { Text, View, ScrollView, TextInput, DeviceEventEmitter, BackHandler } from 'react-native';
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
import Icon from 'react-native-vector-icons/Entypo';
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
import BackHeader from '../../components/Header/BackHeader';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import LoadingLayout from '../../components/LoadingLayout';
import FileView from '../../components/FileView';
import { makeSelectUserRole, makeSelectViewConfig } from '../App/selectors'
import { DATE_FORMAT, MODULE, REQUEST_METHOD } from '../../utils/constants'
import { addFile } from '../../api/fileSystem';
import DocumentPicker from 'react-native-document-picker'
import RenderRecordModal from './RenderRecordModal';
import { validateForm } from '../../utils/validate';
const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

const Tab = createMaterialTopTabNavigator();

export function MeetingScheduleDatailPage(props) {
    useInjectReducer({ key: 'meetingSchedulePage', reducer });
    useInjectSaga({ key: 'meetingSchedulePage', saga });

    const { navigation, mapMeeting, meetingDetailPage, updateSchedule, route, onClean, saveSchedule, calendarConfig, calender } = props;
    const { PUT } = calender;

    const { meeting, isLoading, updating, updateSuccess } = meetingDetailPage
    const { params } = route
    const { onSuccess } = params || {}
    const [error, setError] = useState({});
    const [localData, setLocalData] = useState({})
    const [showFile, setShowFile] = useState()
    const [reload, setReload] = useState(0)
    const handleReload = () => setReload(reload + 1)
    const [isVisible, setIsVisible] = useState(false)
    const isUpdate = _.has(params, 'item._id')
    const [openFilterModal, setOpenFilterModal] = useState(false);

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
            setLocalData({ ...meeting })
        } else setLocalData({})
    }, [meeting])


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

    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value
        if (key === 'roomMetting') newData['address'] = value.address
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
        let updateList = 'name, address,code,content,customers,organizer,people,prepare,prepareMeeting,roomMetting,task,timeStart,timeEnd '
            .replace(/ /g, '').split(',').reduce((a, v) => ({ ...a, [v]: v }), {})
        const { isValid, errorList, firstMessage } = checkedRequireForm(calendarConfig, localData, updateList)


        let valid = isValid
        let msg = firstMessage
        let err = errorList

        if (!err.timeStart && !err.timeEnd) {
            const isValidDate = moment(localData.timeStart).isBefore(localData.timeEnd)
            if (!isValidDate) {
                valid = valid && isValidDate;
                ToastCustom({ text: 'Thời gian bắt đầu phải trước thời gian kết thúc', type: 'danger' })
                err.timeStart = true
                err.timeEnd = true
            }
        }
        if (!valid && msg) ToastCustom({ text: msg, type: 'danger' })
        setError(err)
        return valid;
    };

    const handleAdd = async () => {
        if (checkValid()) {
            let body = {
                ...localData,
                address: localData.address,
                code: localData.code,
                content: localData.content || '',
                customers: localData.customers || [],
                name: localData.name,
                organizer: localData.organizer,
                people: localData.people || [],
                prepare: localData.prepare,
                prepareMeeting: localData.prepareMeeting || '',
                roomMetting: localData.roomMetting,
                task: localData.task,
                timeStart: localData.timeStart,
                timeEnd: localData.timeEnd
            }
            if (isUpdate) {
                updateSchedule({ ...body, id: _.get(params, 'item._id') })
            }
            else {
                getProfile().then(profile => {
                    let bodyWorKing = {
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
                    saveSchedule(bodyWorKing)
                })
            }
        }


    };


    const defaultBody = {
        method: REQUEST_METHOD.POST,
        body: {
            action: "read",
            data: [],
            path: "/",
            showHiddenItems: false,
        },
    }
    const [body, setBody] = useState(defaultBody)
    const handleAddFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })
            await addFile({ folder: "users", path: body.body.path, file: res[0], code: 'Calendar', mid: localData._id, fname: 'root' })
            ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
            DeviceEventEmitter.emit('handleAddFile')
            handleReload()
        } catch (err) {
            ToastCustom({ text: 'Thêm mới không thành công', type: 'danger' })
            console.log('err', err)
        }
    }
    const convert = (string) => {
        return string.charAt().toUpperCase() + string.slice(1).toLowerCase();
    }
    // const newFile = async () => {
    //     try {
    //         const res = await DocumentPicker.pick({
    //             type: [DocumentPicker.types.allFiles],
    //         })
    //         await addFile({ folder, clientId, path: body.body.path, file: res[0] })
    //         handleReload()
    //         ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
    //     } catch (err) {
    //         ToastCustom({ text: 'Thêm mới không thành công', type: 'danger' })
    //     }
    // }

    return (
        <View style={{flex: 1}}>
            <BackHeader
                title={isUpdate ? localData.name : 'Thêm mới lịch họp'}
                navigation={navigation}
            />

        <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: 'rgba(46, 149, 46, 1)', // Màu nền của toàn bộ thanh tab
            borderTopWidth: 0.5,
            borderTopColor:'#aaa',
          },
          activeTintColor: 'white', // Màu chữ của tab đang được chọn
          inactiveTintColor: 'white', // Màu chữ của tab không được chọn
          indicatorStyle: {
            backgroundColor: 'white', // Màu của thanh dưới chữ khi tab được chọn
          },
        }}
        >

                <Tab.Screen
                    
                    name="Chi Tiết"
            
                    component={() =>{return(
                        <LoadingLayout isLoading={isLoading}>
                        <ScrollView>
                            <View style={{ justifyContent: 'center', marginHorizontal: 20 }}>
                                <View style={{ flex: 1, backgroundColor: '#fff' }}>
                                    {!_.get(calendarConfig, 'name.checkedShowForm') ? null : <View inlineLabel style={styles.view} error={error.name}>
                                        <Text style={{flex: 1}}  >{convert(_.get(calendarConfig, 'name.title')) || 'Tên cuộc họp'}:</Text>
                                        <TextInput disabled={!PUT} value={localData.name} onChangeText={e => handleChange('name', e.replace('  ', ' '))} style={styles.input} />
                                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, marginRight: 5 }} />
                                    </View>}

                                    {!_.get(calendarConfig, 'code.checkedShowForm') ? null : <View inlineLabel style={styles.view} error={error.code} >
                                        <Text  style={{flex: 1}}>{convert(_.get(calendarConfig, 'code.title')) || 'Mã cuộc họp'}:</Text>
                                        <TextInput disabled={!PUT} value={localData.code} onChangeText={e => handleChange('code', e.replace('  ', ' '))} style={styles.input} />
                                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, marginRight: 5 }} />
                                    </View>}

                                    {!_.get(calendarConfig, 'timeStart.checkedShowForm') ? null : <View inlineLabel style={styles.view} error={error.timeStart}>
                                        <Text >{convert(_.get(calendarConfig, 'timeStart.title')) || 'Thời gian bắt đầu'}:</Text>
                                        <DateTimePicker
                                            disabled={!PUT}
                                            mode="datetime"
                                            onSave={(e) => handleChange('timeStart', e)}
                                            value={localData.timeStart && moment(localData.timeStart).format(DATE_FORMAT.DATE_TIME)}
                                        />
                                    </View>}

                                    {!_.get(calendarConfig, 'timeEnd.checkedShowForm') ? null : <View inlineLabel style={styles.view} error={error.timeEnd}>
                                        <Text >{convert(_.get(calendarConfig, 'timeEnd.title')) || 'Thời gian kết thúc'}:</Text>
                                        <DateTimePicker
                                            disabled={!PUT}
                                            mode="datetime"
                                            onSave={(e) => handleChange('timeEnd', e)}
                                            value={localData.timeEnd && moment(localData.timeEnd).format(DATE_FORMAT.DATE_TIME)}
                                        />
                                    </View>}

                                    {!_.get(calendarConfig, 'roomMetting.checkedShowForm') ? null : <View inlineLabel style={styles.view}  error={error.roomMetting}>
                                        <Text >{convert(_.get(calendarConfig, 'roomMetting.title')) || 'Phòng họp'}:</Text>

                                        <SingleAPISearch
                                            Single
                                            disabled={!PUT}
                                            API={MEETING_DEPARTENT}
                                            onSelectedItemObjectsChange={(value) => handleChange('roomMetting', value.length ? value[0] : null)}
                                            selectedItems={_.get(localData, 'roomMetting._id')}
                                            selectedDatas={_.get(meeting, 'roomMetting') && [_.get(meeting, 'roomMetting')]}
                                            onRemove={(e) => handleChange('roomMetting', null)}
                                        />
                                    </View>}

                                    {!_.get(calendarConfig, 'address.checkedShowForm') ? null : <View inlineLabel style={styles.view} error={error.address}>
                                        <Text >{convert(_.get(calendarConfig, 'address.title')) || 'Địa điểm họp'}:</Text>

                                        <TextInput multiline disabled={!PUT} value={localData.address} onChangeText={e => handleChange('address', e)} style={styles.input} />
                                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, marginRight: 5 }} />
                                    </View>}

                                    {!_.get(calendarConfig, 'task.checkedShowForm') ? null : <View inlineLabel style={styles.view} error={error.task}>
                                        <Text >{convert(_.get(calendarConfig, 'task.title')) || 'Công việc dự án'}:</Text>
                                        <SingleAPISearch
                                            disabled={!PUT}
                                            query={{ filter: { isProject: true } }}
                                            API={API_TASK_TASKS}
                                            onSelectedItemObjectsChange={(value) => handleChange('task', value.length ? value[0] : null)}
                                            selectedItems={_.get(localData, 'task._id')}
                                            selectedDatas={_.get(meeting, 'task') && [_.get(meeting, 'task')]}
                                            onRemove={(e) => handleChange('task', null)}
                                        />
                                    </View>}

                                    {!_.get(calendarConfig, 'prepare.checkedShowForm') ? null : <View inlineLabel style={styles.view}  error={error.prepare}>
                                        <Text >{convert(_.get(calendarConfig, 'prepare.title')) || 'Người chuẩn bị'}:</Text>
                                        <MultiAPISearch
                                            disabled={!PUT}
                                            API={API_USERS}
                                            onSelectedItemObjectsChange={(e) => handleChange('prepare', e)}
                                            selectedItems={Array.isArray(_.get(localData, 'prepare')) && localData.prepare.map(e => e._id)}
                                            selectedDatas={_.get(meeting, 'prepare')}
                                            onRemove={(e) => handleChange('prepare', [])}
                                        />

                                    </View>}

                                    {!_.get(calendarConfig, 'prepareMeeting.checkedShowForm') ? null : <View inlineLabel style={styles.view} error={error.prepareMeeting} >
                                        <Text >{convert(_.get(calendarConfig, 'prepareMeeting.title')) || 'Chuẩn bị cuộc họp'}:</Text>
                                        <TextInput multiline disabled={!PUT} value={localData.prepareMeeting} onChangeText={e => handleChange('prepareMeeting', e)} style={styles.input} />
                                        <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, marginRight: 5 }} />
                                    </View>}

                                    {!_.get(calendarConfig, 'customers.checkedShowForm') ? null : <View inlineLabel style={styles.view}  error={error.customers}>
                                        <Text >{convert(_.get(calendarConfig, 'customers.title')) || 'Khách hàng'}:</Text>

                                        <MultiAPISearch
                                            disabled={!PUT}
                                            API={API_CUSTOMER}
                                            onSelectedItemObjectsChange={(e) => handleChange('customers', e)}
                                            selectedItems={Array.isArray(_.get(localData, 'customers')) && localData.customers.map(e => e._id)}
                                            selectedDatas={_.get(meeting, 'customers')}
                                            onRemove={(e) => handleChange('customers', [])}
                                        />
                                    </View>}

                                    {!_.get(calendarConfig, 'people.checkedShowForm') ? null : <View inlineLabel style={styles.view} error={error.people}>
                                        <Text >{convert(_.get(calendarConfig, 'people.title')) || 'Người tham gia'}:</Text>

                                        <MultiAPISearch
                                            disabled={!PUT}
                                            uniqueKey="employeeId"
                                            API={API_USERS}
                                            onSelectedItemObjectsChange={(e) => handleChange('people', e)}
                                            selectedItems={Array.isArray(_.get(localData, 'people')) && localData.people.map(e => e._id)}
                                            // selectedDatas={_.get(meeting, 'people')}
                                            customData={arr => arr.map(e => ({ ...e, employeeId: e.employeeId || e._id }))}
                                            onRemove={(e) => handleChange('people', [])}
                                        />

                                    </View>}

                                    {!_.get(_.get(calendarConfig, 'organizer.name'), 'checkedShowForm') ? null : <View inlineLabel style={styles.view} error={error.organizer}>
                                        <Text >{convert(_.get(calendarConfig, 'organizer.name').title) || 'Người tổ chức'}:</Text>
                                        <SingleAPISearch
                                            disabled={!PUT}
                                            uniqueKey="employeeId"
                                            API={API_USERS}
                                            onSelectedItemObjectsChange={(value) => handleChange('organizer', value.length ? value[0] : null)}
                                            selectedItems={_.get(localData, 'organizer.employeeId')}
                                            selectedDatas={_.get(meeting, 'organizer') && [_.get(meeting, 'organizer')]}
                                            customData={arr => arr.map(e => ({ ...e, employeeId: e.employeeId || e._id }))}
                                            onRemove={(e) => handleChange('organizer', null)}
                                        />
                                    </View>}

                                    <View inlineLabel style={styles.view}  underline={false}>
                                        <Text style={{ marginTop: 10 }}>Nội Dung: </Text>
                                    </View>
                                    <View style={{ marginHorizontal: 15 }} >
                                        <TextInput
                                            disabled={!PUT}
                                            rowSpan={5}
                                            bordered
                                            value={_.get(localData, 'content')}
                                            onChangeText={(val) => handleChange('content', val)}
                                            style={{ width: '100%', alignSelf: 'center', }} />
                                        {/* <Icon name='keyboard-voice' type='MaterialIcons' style={{ position: 'absolute', top: '40%', right: '5%' }} onPress={() => setIsVisible(true)} /> */}
                                    </View>

                                    <RenderRecordModal isVisible={isVisible} onClose={() => setIsVisible(false)} localData={localData._id} />
                                </View>
                            </View>


                            {!calender.POST ? null : <View style={{ flexDirection: 'row', margin: 10,  backgroundColor:'rgba(46, 149, 46, 1)', paddingHorizontal: 10, borderRadius: 10 }}>
                                <LoadingButton isBusy={updating} handlePress={handleAdd} style={{ width: '100%', justifyContent: 'center' }}>
                                    <Icon style={{color:'white', fontSize: 20, textAlign:'center'}} name="check" type="Feather" />
                                </LoadingButton>
                            </View>}
                        </ScrollView>
                    </LoadingLayout>
                    )}}
                    />
                    
               
                <Tab.Screen
                    
                    name="Tài Liệu"
                    component={() =>{return(
                        <View style={{flex: 1}}>
                            
                            <FileView id={localData._id} code={'Calendar'} visible={true} reload={reload} />
                             <FabLayout style={{ position: 'absolute',
        bottom: 10,
        right: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,}} onPress={() => isLoading ? "" : handleAddFile()}>
                            <Icon type="Entypo" name="plus" style={{ color: '#fff', }} />
                              </FabLayout>
                        </View>
                    )}}
                   
                    />

                   
               
            </Tab.Navigator>




        </View>
    );

}

const mapStateToProps = createStructuredSelector({
    meetingDetailPage: makeSelectMeetingSchedulePage(),
    calendarConfig: makeSelectViewConfig(MODULE.CALENDAR),
    calender: makeSelectUserRole(MODULE.CALENDAR),
});

function mapDispatchToProps(dispatch) {
    return {
        mapMeeting: (props) => dispatch(actions.getMeetingSchelude(props)),
        saveSchedule: (data) => dispatch(actions.addScheduleMettingSchedule(data)),
        updateSchedule: data => dispatch(actions.updateScheduleMettingSchedule(data)),
        onClean: () => dispatch(actions.onClean()),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MeetingScheduleDatailPage);

const styles = {
    view: {
        flexDirection: 'row',
        marginBottom: 2,
        alignItems: 'center',
        justifyContent:'space-between',
        paddingVertical: 10,
        borderBottomWidth: 0.7,
        borderBottomColor: 'gray'
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

