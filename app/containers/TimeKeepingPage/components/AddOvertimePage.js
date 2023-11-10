import React, { useState, useCallback, useEffect } from "react";
import { Container, Card, CardItem, Icon, Form, Label, Item, Input, Body } from 'native-base';
import { View, DeviceEventEmitter, TouchableOpacity, Text } from 'react-native';
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
import { API_PERSONNEL } from "../../../configs/Paths";
import ToastCustom from "../../../components/ToastCustom";
import _ from 'lodash'
import Search from "../../../components/CustomMultiSelect/Search";
import { getOvertime, updateOvertime, getByIdOvertime, getByIdHrm } from "../../../api/hrmEmployee";
import styles from "../../../components/CustomMultiSelect/styles";
import CustomMonthYearPicker from "../../../components/CustomMonthYearPicker";

const AddOvertimePage = (props) => {
    const { navigation, route } = props;
    const { params } = route;
    const { item } = params || {};
    const id = _.get(item, '_id');

    const [localData, setLocalData] = useState({});
    const [hrmOption, setHrmOption] = useState([]);
    const [updating, setUpdating] = useState();

    useEffect(() => {
        if (id) {
            getByIdOvertime(id).then(async res => {
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
        
    }

    const handleAdd = async () => {
        setUpdating(true);
        try {
            let body = {
                month: localData.month ? localData.month : moment(new Date()).format("MM"),
                year: localData.year ? localData.year : moment(new Date()).format("YYYY"),
                hrmEmployeeId: Array.isArray(localData.hrmEmployeeId) ? localData.hrmEmployeeId[0] : localData.hrmEmployeeId,
                organizationUnitId: localData.organizationUnit,
                timeStart: localData.timeStart,
                timeEnd: localData.timeEnd,
                reason: localData.reason,
            }
            if (id) {
                const result = await updateOvertime(id, body)
                if (result) {
                    ToastCustom({ text: 'Cập nhật thành công', type: 'success' });
                    navigation.goBack()
                    DeviceEventEmitter.emit('updateProjectSuccess')
                } else {
                    ToastCustom({ text: `Cập nhật thất bại: ${result.message}`, type: 'danger' });
                }
            }
            else {
                const result = await getOvertime(body)
                if (result.status === 1) {
                    ToastCustom({ text: 'Thêm mới thành công', type: 'success' });
                    navigation.goBack()
                    DeviceEventEmitter.emit('addProjectSuccess')
                } else {
                    ToastCustom({ text: `Thêm mới thất bại: ${result.message}`, type: 'danger' });
                }
            }
        } catch (err) {
            ToastCustom({ text: 'Thêm mới thất bại', type: 'danger' });
            console.log('err', err)
        }
        setUpdating(false);
    }

    const showPicker = useCallback((value) => setShow(value), []);

    const handleChangeOrg = (org) => {
        const result = org.map(e => e._id)
        setLocalData({ ...localData, organizationUnit: result.length ? result[0] : '' })
    };

    return (
        <Container>
            <View>
                <BackHeader navigation={navigation} title={id ? "Thông tin thời gian OT" : "Thêm mới thời gian OT"} />
            </View>
            <Card>
                <CardItem>
                    <Form style={{ flex: 1, backgroundColor: '#fff' }}>
                        <Item inlineLabel>
                            <Label>Phòng ban:</Label>
                            <DepartmentSelect
                                single
                                handleSelectObjectItems={handleChangeOrg}
                                selectedItems={localData.organizationUnit ? [localData.organizationUnit] : []}
                                onRemoveSelectedItem={() => handleChange('organizationUnit', null)}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>Nhân viên:</Label>
                            <SingleAPISearch
                                API={API_PERSONNEL}
                                selectedItems={localData.hrmEmployeeId ? [localData.hrmEmployeeId._id] : []}
                                onSelectedItemObjectsChange={(e) => handleChange('hrmEmployeeId', e)}
                                onRemove={() => handleChange('hrmEmployeeId', null)}
                                selectedDatas={hrmOption}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>Thời gian bắt đầu:</Label>
                            <DateTimePicker
                                mode="time"
                                onSave={(e) => setLocalData({...localData, timeStart: moment(e).format("HH:mm")})}
                                value={localData.timeStart}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>Thời gian kết thúc:</Label>
                            <DateTimePicker
                                mode="time"
                                onSave={(e) => setLocalData({...localData, timeEnd: moment(e).format("HH:mm")})}
                                value={localData.timeEnd}
                            />
                        </Item>

                        <Item inlineLabel style={styles.item}>
                            <Label>Tháng/Năm:</Label>
                            <CustomMonthYearPicker value={item ? new Date(item.year, (item.month - 1), 1, 0, 0, 0) : new Date()} onChange={(year, month) => setLocalData({ ...localData, year: year, month: month })} />
                        </Item>

                        <Item inlineLabel>
                            <Label>Ghi chú:</Label>
                            <Input value={localData.reason} onChangeText={e => handleChange('reason', e)} style={{ textAlign: 'right', marginRight: 5, paddingTop: 10 }} multiline={true} />
                            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                        </Item>
                    </Form>
                </CardItem>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <LoadingButton isBusy={updating} handlePress={handleAdd} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }}>
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

export default compose(withConnect)(AddOvertimePage);
