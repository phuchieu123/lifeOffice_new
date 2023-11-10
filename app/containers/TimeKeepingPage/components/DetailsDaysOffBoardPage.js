import React, { useState, useCallback, useEffect } from "react";
import { Container, Card, CardItem, Icon, Form, Label, Item, Input } from 'native-base';
import { View, DeviceEventEmitter } from 'react-native';
import BackHeader from "../../../components/Header/BackHeader";
import LoadingButton from "../../../components/LoadingButton";
import SingleAPISearch from '../../../components/CustomMultiSelect/SingleAPISearch';
import DepartmentSelect from "../../../components/CustomMultiSelect/DepartmentSelect";
import DateTimePicker from "../../../components/CustomDateTimePicker/DateTimePicker";
import moment from "moment";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { hrmSourceCode } from "../../App/selectors";
import { compose } from 'redux';
import { API_PERSONNEL, API_TAKE_LEAVE } from "../../../configs/Paths";
import ToastCustom from "../../../components/ToastCustom";
import _ from 'lodash'
import Search from "../../../components/CustomMultiSelect/Search";
import { gotDayOffBoard, getData, getByIdHrm } from "../../../api/hrmEmployee";
import { MODULE } from "../../../utils/constants";

const DetailsDaysOffBoardPage = (props) => {
    const { navigation, formulas, route } = props;
    const { params } = route
    const { item } = params
    const id = _.get(item, '_id')

    const [localData, setLocalData] = useState([]);
    const [localNewData, setLocalNewData] = useState([]);
    const [hrmOption, setHrmOption] = useState([]);
    const [show, setShow] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState([]);
    const [updating, setUpdating] = useState();

    useEffect(() => {
        if (id) {
            getData(id).then(async res => {
                if (res) {
                    if (res.hrmEmployeeId) {
                        const hrm = await getByIdHrm(res.hrmEmployeeId)
                        if (hrm) {
                            res.hrmEmployeeId = hrm
                            setHrmOption([hrm])
                        }
                    }
                    setLocalData(res)
                } else navigation.goBack()

            })
        }
    }, [])

    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value

        setLocalData({ ...localData, ...newData });
        setLocalNewData({ ...localNewData, ...newData });
    }

    const handleAdd = async () => {
        setUpdating(true);
        if (id) {
            try {
                let body = {
                    fromDate: `${moment(localData.fromDate).format('YYYY-MM-DD HH:mm')}`,
                    toDate: `${moment(localData.toDate).format('YYYY-MM-DD HH:mm')}`,
                    hrmEmployeeId: Array.isArray(localData.hrmEmployee) ? localData.hrmEmployee[0] : localData.hrmEmployee,
                    hrmEmployee: Array.isArray(localData.hrmEmployee) ? localData.hrmEmployee[0] : localData.hrmEmployee,
                    organizationUnitId: localData.organizationUnitId,
                    type: localNewData.title ? formulas['S19'].filter(type => (type.value === localNewData.title.toString()))[0] : localData.type,
                    reason: localData.reason,
                }

                const res = await gotDayOffBoard(id, body)
                console.log('# res', res)
                if (res) {
                    ToastCustom({ text: 'Cập nhật thành công', type: 'success' });
                    navigation.goBack()
                    DeviceEventEmitter.emit('onUpdateDaysOff')
                } else {
                    ToastCustom({ text: 'Cập nhật thất bại, xin vui lòng kiểm tra lại tên phòng ban và nhân viên', type: 'danger' });
                }

            } catch (err) {
                ToastCustom({ text: 'Cập nhật thất bại, xin vui lòng kiểm tra lại tiêu đề', type: 'danger' });
                console.log('err', err)
            }
        }
        setUpdating(false);

    }

    const showPicker = useCallback((value) => setShow(value), []);

    const handleChangeOrg = (org) => {
        const result = org.map(e => e._id)
        setLocalData({ ...localData, organizationUnitId: result.length ? result[0] : '' })
    };

    return (
        <Container>
            <View>
                <BackHeader
                    navigation={navigation}
                    title="Cập nhật nghỉ phép"
                    rightHeader={
                        <Icon
                            style={{ color: 'white' }}
                            name="checklist"
                            type="Octicons"
                            onPress={
                                () => navigation.navigate('AddApproveDaysOffBoardPage', {
                                    code: MODULE.TAKE_LEAVE,
                                    api: API_TAKE_LEAVE
                                })
                            }
                        />
                    }
                />
            </View>
            <Card>
                <CardItem>
                    <Form style={{ flex: 1, backgroundColor: '#fff' }}>
                        <Item inlineLabel>
                            <Label>Phòng ban:</Label>
                            <DepartmentSelect
                                single
                                handleSelectObjectItems={handleChangeOrg}
                                selectedItems={localData.organizationUnitId ? [localData.organizationUnitId] : []}
                                onRemoveSelectedItem={() => setSelectedOrg([])}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>Nhân viên:</Label>
                            <SingleAPISearch
                                API={API_PERSONNEL}
                                selectedItems={localData.hrmEmployee ? [localData.hrmEmployee._id] : []}
                                onSelectedItemObjectsChange={(e) => handleChange('hrmEmployee', e)}
                                onRemove={() => handleChange('hrmEmployee', null)}
                                selectedDatas={hrmOption}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>Thời gian bắt đầu:</Label>
                            <DateTimePicker
                                mode="datetime"
                                onSave={(e) => handleChange('fromDate', e)}
                                value={localData.fromDate && moment(localData.fromDate).format('DD/MM/YYYY HH:mm')}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>Thời gian kết thức:</Label>
                            <DateTimePicker
                                mode="datetime"
                                onSave={(e) => handleChange('toDate', e)}
                                value={localData.toDate && moment(localData.toDate).format('DD/MM/YYYY HH:mm')}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>Tiêu đề:</Label>
                            <Search
                                single
                                handleSelectItems={(item) => handleChange('title', item)}
                                onRemoveSelectedItem={() => handleChange('title', null)}
                                selectedItems={localNewData.title ? [localNewData.title] : []}
                                uniqueKey="value"
                                displayKey="title"
                                items={formulas['S19']}
                                emptyText={localData.type && localData.type.title}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>Lý do:</Label>
                            <Input value={localData.reason} onChangeText={e => handleChange('reason', e)} style={{ textAlign: 'right', marginRight: 5, paddingTop: 10 }} multiline={true} />
                            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                        </Item>
                    </Form>
                </CardItem>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <LoadingButton isBusy={updating} handlePress={handleAdd} style={{ width: '100%', justifyContent: 'center' }}>
                        <Icon name="check" type="Feather" />
                    </LoadingButton>
                </View>
            </Card>
        </Container>
    );
}

function CreateNewToProps(dispatch) {
    return {
        saveWorkingSchedule: (data) => dispatch(actions.addWorkingScheduleSchedule(data)),

    };
}

const mapStateToProps = createStructuredSelector({
    formulas: hrmSourceCode(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(DetailsDaysOffBoardPage);
