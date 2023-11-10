import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Text, View, ScrollView, TextInput, DeviceEventEmitter } from 'react-native';
import { compose } from 'redux';
import moment from 'moment';
import { API_CUSTOMER, API_USERS } from '../../../configs/Paths';
import { Header, Container, Card, CardItem, Item, Icon, Form, Label, Input, Button, Textarea, Right, Tabs, TabHeading, Tab } from 'native-base';
import LoadingButton from '../../../components/LoadingButton';
import SingleAPISearch from '../../../components/CustomMultiSelect/SingleAPISearch';
import MultiAPISearch from '../../../components/CustomMultiSelect/MultiAPISearch';
import { convertLabel } from '../../../utils/common';
import ToastCustom from '../../../components/ToastCustom';
import _ from 'lodash';
import DateTimePicker from '../../../components/CustomDateTimePicker/DateTimePicker';
import LoadingLayout from '../../../components/LoadingLayout';
import { MODULE } from '../../../utils/constants';
import { makeSelectUserRole, makeSelectViewConfig, makeSelectProfile } from '../../../containers/App/selectors'
import { validateForm } from '../../../utils/validate';
import { add, update } from '../../../api/metting';
import { goBack, navigate } from '../../../RootNavigation';
import { DATE_FORMAT } from '../../../utils/constants';

function CalenderForm(props) {
    const { id, meeting, calenderRole, profile, loading, calendarConfigType2 } = props;
    const { PUT } = calenderRole;

    const calendarConfig = calendarConfigType2
    const [localData, setLocalData] = useState({})
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState();
    const [updating, setUpdating] = useState();

    useEffect(() => {
        if (meeting) {
            setLocalData(meeting)
        }
    }, [meeting])
    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value
        if (key === 'roomMetting') newData['address'] = value.address
        setLocalData({ ...localData, ...newData });
        if (error[key]) {
            const newErr = { ...error }
            delete newErr[key]
            if (key === 'timeStart' || key === 'timeEnd') {
                delete newErr.timeStart
                delete newErr.timeEnd
            }
            setError(newErr)
        }
    };


    const onSave = async () => {
        setUpdating(true)

        let updateList = 'content, customers, name, organizer, people, result, timeStart, timeEnd'
            .replace(/ /g, '').split(',').reduce((a, v) => ({ ...a, [v]: v }), {})

        const { isValid, errorList, firstMessage } = validateForm(calendarConfig, localData, updateList)

        if (isValid) {
            let body = {
                ...localData,
                // address: localData.address,
                code: localData.code,
                content: localData.content || '',
                customers: localData.customers,
                name: _.trimStart(localData.name),
                organizer: localData.organizer,
                people: localData.people,
                result: localData.result || '',
                // prepare: localData.prepare,
                // prepareMeeting: localData.prepareMeeting || '',
                // roomMetting: localData.roomMetting,
                // task: localData.task,
                timeStart: localData.timeStart,
                timeEnd: localData.timeEnd,
            }
            if (id) {
                // const res = await update(id, body)
                // if (res) ToastCustom({ text: 'Cập nhật thành công', type: 'success' })
                // else ToastCustom({ text: 'Cập nhật thất bại', type: 'danger' })

                const res = await update(id, body)
                console.log(res, 'res');
                if (res && res.status === 1) {
                    ToastCustom({ text: 'Cập nhật thành công', type: 'success' })
                    // DeviceEventEmitter.emit('addCalendarSuccess')
                    goBack()
                } else ToastCustom({ text: res.message.split("||")[0], type: 'danger' })
            } else {
                body = {
                    ...body,
                    date: moment().toISOString(),
                    kanbanStatus: '1',
                    link: 'Calendar/working-calendar',
                    typeCalendar: 2,
                    createdBy: {
                        employeeId: profile._id,
                        name: profile.name
                    },
                    from: '5e0464fd09ea5f2a2c249306'
                }
                const res = await add(body)
                if (res && res.status === 1) {
                    ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
                    DeviceEventEmitter.emit('addCalendarSuccess')
                    goBack()
                } else ToastCustom({ text: res.message.split("||")[0], type: 'danger' })
            }
        } else {
            setError(errorList)
            ToastCustom({ text: firstMessage, type: 'danger' })
        }
        setUpdating(false)
    }

    return (
        <LoadingLayout isLoading={isLoading || loading}>
            <ScrollView>
                <View style={{ display: 'flex', justifyContent: 'center' }}>
                    <Form style={{ flex: 1, backgroundColor: '#fff' }}>
                        {!_.get(calendarConfig, 'name.checkedShowForm') ? null : <Item inlineLabel style={{}} error={error.name}>
                            <Label>{convertLabel(_.get(calendarConfig, 'name.title'))}</Label>
                            <Input disabled={!PUT} value={localData.name} onChangeText={e => handleChange('name', e.replace('  ', ' '))} style={styles.input} />
                            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                        </Item>}

                        {!_.get(calendarConfig, 'code.checkedShowForm') ? null : <Item inlineLabel style={{}} error={error.code}>
                            <Label>{convertLabel(_.get(calendarConfig, 'code.title'))}</Label>
                            <Input disabled={!PUT} value={localData.code} onChangeText={e => handleChange('code', e.replace('  ', ' '))} style={styles.input} />
                            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                        </Item>}

                        {!_.get(calendarConfig, 'timeStart.checkedShowForm') ? null : <Item inlineLabel error={error.timeStart}>
                            <Label >{convertLabel(_.get(calendarConfig, 'timeStart.title')) || 'Thời gian bắt đầu'}:</Label>
                            <DateTimePicker
                                disabled={!PUT}
                                mode="datetime"
                                onSave={(e) => handleChange('timeStart', e)}
                                value={localData.timeStart && moment(localData.timeStart).format(DATE_FORMAT.DATE_TIME)}
                            />
                        </Item>}

                        {!_.get(calendarConfig, 'timeEnd.checkedShowForm') ? null : <Item inlineLabel error={error.timeEnd}>
                            <Label >{convertLabel(_.get(calendarConfig, 'timeEnd.title')) || 'Thời gian kết thúc'}:</Label>
                            <DateTimePicker
                                disabled={!PUT}
                                mode="datetime"
                                onSave={(e) => handleChange('timeEnd', e)}
                                value={localData.timeEnd && moment(localData.timeEnd).format(DATE_FORMAT.DATE_TIME)}
                            />
                        </Item>}

                        {!_.get(calendarConfig, 'customers.checkedShowForm') ? null : <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }} error={error.customers}>
                            <Label >{convertLabel(_.get(calendarConfig, 'customers.title')) || 'Khách hàng'}:</Label>

                            <MultiAPISearch
                                disabled={!PUT}
                                API={API_CUSTOMER}
                                onSelectedItemObjectsChange={(e) => handleChange('customers', e)}
                                selectedItems={Array.isArray(_.get(localData, 'customers')) && localData.customers.map(e => e._id)}
                                selectedDatas={_.get(meeting, 'customers')}
                                onRemove={(e) => handleChange('customers', [])}
                            />
                        </Item>}
                        {!_.get(calendarConfig, 'people.checkedShowForm') ? null : <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }} error={error.people}>
                            <Label >{convertLabel(_.get(calendarConfig, 'people.title')) || 'Người tham gia'}:</Label>

                            <MultiAPISearch
                                disabled={!PUT}
                                uniqueKey="employeeId"
                                API={API_USERS}
                                onSelectedItemObjectsChange={(e) => handleChange('people', e)}
                                selectedItems={Array.isArray(_.get(localData, 'people')) && localData.people.map(e => e.employeeId)}
                                selectedDatas={_.get(meeting, 'people')}
                                customData={arr => arr.map(e => ({ ...e, employeeId: e.employeeId || e._id }))}
                                onRemove={(e) => handleChange('people', [])}
                            />
                        </Item>}

                        {!_.get(_.get(calendarConfig, 'organizer.name'), 'checkedShowForm') ? null : <Item inlineLabel style={{ display: 'flex', justifyContent: 'space-between' }} error={error.organizer}>
                            <Label >{convertLabel(_.get(calendarConfig, 'organizer.name').title) || 'Người tổ chức'}:</Label>
                            <SingleAPISearch
                                disabled={!PUT}
                                readOnly={!calendarConfig}
                                uniqueKey="employeeId"
                                API={API_USERS}
                                onSelectedItemObjectsChange={(value) => handleChange('organizer', value.length ? value[0] : null)}
                                selectedItems={_.get(localData, 'organizer.employeeId')}
                                selectedDatas={_.get(meeting, 'organizer') && [_.get(meeting, 'organizer')]}
                                customData={arr => arr.map(e => ({ ...e, employeeId: e.employeeId || e._id }))}
                                onRemove={(e) => handleChange('organizer', null)}
                            />
                        </Item>}

                        {!_.get(calendarConfig, 'approved.checkedShowForm') ? null :
                            <Item inlineLabel error={error.approved}>
                                <Label >{convertLabel(_.get(calendarConfig, 'approved.title')) || 'Người phê duyệt'}:</Label>
                                <SingleAPISearch
                                    disabled={!PUT}
                                    API={API_USERS}
                                    onSelectedItemObjectsChange={value => handleChange('approved', _.get(value, '[0]'))}
                                    selectedItems={localData.approved ? [localData.approved._id] : []}
                                    onRemove={() => handleChange('approved', [])}
                                />
                            </Item>}

                        {!_.get(calendarConfig, 'content.checkedShowForm') ? null :
                            <>
                                <View style={{ marginLeft: 14 }} >
                                    <Label style={{ marginTop: 10, color: '#444444' }}>{convertLabel(_.get(calendarConfig, 'content.title'))}</Label>
                                </View>

                                <View style={{ marginHorizontal: 15 }} >
                                    <Textarea
                                        disabled={!PUT}
                                        rowSpan={5}
                                        bordered
                                        value={_.get(localData, 'result')}
                                        onChangeText={(val) => handleChange('result', val)}
                                        style={{ width: '100%', alignSelf: 'center' }} />
                                </View>
                            </>
                        }
                        {!_.get(calendarConfig, 'result.checkedShowForm') ? null :
                            <>
                                <View style={{ marginLeft: 14 }} >
                                    <Label style={{ marginTop: 10, color: '#444444' }}>{convertLabel(_.get(calendarConfig, 'result.title'))}</Label>
                                </View>
                                <View style={{ marginHorizontal: 15 }} >
                                    <Textarea
                                        disabled={!PUT}
                                        rowSpan={5}
                                        bordered
                                        value={_.get(localData, 'content')}
                                        onChangeText={(val) => handleChange('content', val)}
                                        style={{ width: '100%', alignSelf: 'center' }} />
                                </View>
                            </>
                        }
                    </Form>
                </View>
                {!calenderRole.POST ? null : <View style={{ flexDirection: 'row', padding: 10, paddingRight: 20 }}>
                    <LoadingButton isBusy={updating} handlePress={onSave} style={{ width: '100%', justifyContent: 'center' }}>
                        <Icon name="check" type="Feather" />
                    </LoadingButton>
                </View>}
            </ScrollView >
        </LoadingLayout>
    );
}

const mapStateToProps = createStructuredSelector({
    calendarConfigType1: makeSelectViewConfig(MODULE.CALENDAR),
    calendarConfigType2: makeSelectViewConfig(MODULE.CALENDAR, 'listDisplay'),
    calenderRole: makeSelectUserRole(MODULE.CALENDAR),
    profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
    return {
    };

}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CalenderForm);

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