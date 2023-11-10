import React, { useState, useCallback } from "react";
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
import { API_PERSONNEL } from "../../../configs/Paths";
import ToastCustom from "../../../components/ToastCustom";
import _ from 'lodash'
import Search from "../../../components/CustomMultiSelect/Search";
import { getDayOffBoard } from "../../../api/hrmEmployee";
import { login } from "../../App/actions";

const NewDaysOffBoardPage = (props) => {

    const { navigation, formulas } = props;
    const [localData, setLocalData] = useState({})
    const [show, setShow] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState([]);
    const [updating, setUpdating] = useState()

    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value

        setLocalData({ ...localData, ...newData });
    }

    const handleAdd = async () => {
        setUpdating(true);
        try {
            let body = {
                fromDate: `${moment(localData.fromDate).format('YYYY-MM-DD HH:mm')}`,
                toDate: `${moment(localData.toDate).format('YYYY-MM-DD HH:mm')}`,
                hrmEmployeeId: localData.employee[0],
                hrmEmployee: localData.employee[0],
                organizationUnitId: selectedOrg.toString(),
                type: formulas['S19'].filter(type => (type.value === localData.title.toString()))[0],
                reason: localData.reason,
            }

            const res = await getDayOffBoard(body)
            console.log('~ res', res)

            if (res.status === 1) {
                ToastCustom({ text: 'Thêm mới thành công', type: 'success' });
                navigation.goBack()
                DeviceEventEmitter.emit('onUpdateDaysOff')
            } else {
                ToastCustom({ text: res.message, type: 'danger' });
            }

        } catch (err) {
            if (!selectedOrg.toString()) {
                ToastCustom({ text: 'Chọn phòng ban', type: 'danger' });
            }

            else if (!localData.employee) {
                ToastCustom({ text: 'Chọn nhân viên', type: 'danger' });
            }

            else if (!localData.startDate) {
                ToastCustom({ text: 'Chọn thời gian nghỉ phép', type: 'danger' });
            }
            else if (!localData.title) {
                ToastCustom({ text: 'Chọn tiêu đề', type: 'danger' });
            }
            else {
                ToastCustom({ text: 'Thêm mới thất bại', type: 'danger' });
            }
            console.log('err', err)
        }
        setUpdating(false);
    }

    const showPicker = useCallback((value) => setShow(value), []);

    const handleChangeOrg = (org) => {
        const result = org.map(org => org._id)
        setSelectedOrg(result)
    };

    return (
        <Container>
            <View>
                <BackHeader navigation={navigation} title="Thêm nghỉ phép" />
            </View>
            <Card>
                <CardItem>
                    <Form style={{ flex: 1, backgroundColor: '#fff' }}>
                        <Item inlineLabel>
                            <Label>Phòng ban:</Label>
                            <DepartmentSelect
                                handleSelectObjectItems={handleChangeOrg}
                                selectedItems={selectedOrg}
                                onRemoveSelectedItem={() => setSelectedOrg([])}
                            />
                        </Item>

                        <Item inlineLabel>
                            <Label>Nhân viên:</Label>
                            <SingleAPISearch
                                API={API_PERSONNEL}
                                selectedItems={localData.employee}
                                onSelectedItemObjectsChange={(e) => handleChange('employee', e)}
                                onRemove={() => handleChange('employee', null)}
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
                            <Label>Thời gian kết thúc:</Label>
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
                                selectedItems={localData.title ? [localData.title] : []}
                                uniqueKey="value"
                                displayKey="title"
                                items={formulas['S19']}
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

export default compose(withConnect)(NewDaysOffBoardPage);
