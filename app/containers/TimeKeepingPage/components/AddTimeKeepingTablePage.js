import React, { useState, useCallback, useEffect } from "react";
import { Item, Container, Card, CardItem, Icon, Form, Label, Body } from 'native-base';
import { View, Text, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import BackHeader from "../../../components/Header/BackHeader";
import LoadingButton from '../../../components/LoadingButton';
import SingleAPISearch from '../../../components/CustomMultiSelect/SingleAPISearch';
import { API_USERS } from '../../../configs/Paths';
import DepartmentSelect from "../../../components/CustomMultiSelect/DepartmentSelect";
import moment from "moment";
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { hrmSourceCode } from "../../App/selectors";
import { compose } from 'redux';
import { API_SALARY_FORMULA } from "../../../configs/Paths";
import { addHrmTable } from "../../../api/hrmTable";
import ToastCustom from "../../../components/ToastCustom";
import _ from 'lodash';
import styles from "../../../components/CustomMultiSelect/styles";
import CustomMonthYearPicker from "../../../components/CustomMonthYearPicker";

const AddTimeKeepingTablePage = (props) => {

    const { navigation, route, buttonStyles } = props;

    const [selectedEmp, setSelectedEmp] = useState([]);
    const [employeesOption, setEmployeesOption] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState([]);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const { parentId } = _.get(route, 'params', {});
    const [localData, setLocalData] = useState({})

    useEffect(() => {
        if (_.get(route, 'params')) {
            setDataProject(parentId)
        }
    }, [route])

    const handleChangeEmployee = (emp) => {
        setSelectedEmp(emp.map(e => e._id));
        setEmployeesOption((e) => ([...e, ...emp]));
    };

    const handleChangeOrg = (org) => {
        const result = org.map(org => org._id)
        setSelectedOrg(result)
    };

    const handleAdd = async () => {
        try {
            const body = {
                month: localData.month,
                year: localData.year,
                inChargedEmployeeId: selectedEmp[0],
                organizationUnitId: selectedOrg[0],
            }

            const res = await addHrmTable(body)
            if (res.status === 1) {
                ToastCustom({ text: 'Thêm mới thành công', type: 'success' });
                navigation.goBack()
                DeviceEventEmitter.emit('updateTimeKeepingTable')
            } else {
                ToastCustom({ text: 'Thêm mới thất bại', type: 'danger' });
            }

        } catch (err) {
            ToastCustom({ text: 'Thêm mới thất bại', type: 'danger' });
            console.log('err', err)
        }
    }
    const showPicker = useCallback((value) => setShow(value), []);

    const onValueChange = useCallback(
        (event, newDate) => {
            try {
                const selectedDate = newDate || date;
                showPicker(false);
                setDate(selectedDate);
            } catch (error) {
                console.log(error)
            }
        },
        [date, showPicker],
    );

    return (
        <Container>
            <View>
                <BackHeader navigation={navigation} title="Thêm bảng công" />
            </View>
            <Card>
                <CardItem>
                    <Form style={{ flex: 1, backgroundColor: '#fff' }}>
                        <Item inlineLabel style={styles.item}>
                            <Label>Thời gian:</Label>
                            <CustomMonthYearPicker value={date} onChange={(year, month) => setLocalData({ ...localData, year: year, month: month })} />
                        </Item>
                        <Item inlineLabel style={styles.item}>
                            <Label>Phòng ban:</Label>
                            <DepartmentSelect
                                handleSelectObjectItems={handleChangeOrg}
                                selectedItems={selectedOrg}
                                onRemoveSelectedItem={() => setSelectedOrg([])}
                            />
                        </Item>
                        <Item inlineLabel style={styles.item}>
                            <Label>Phụ trách:</Label>
                            <SingleAPISearch
                                API={API_USERS}
                                Label
                                selectedItems={selectedEmp}
                                onSelectedItemObjectsChange={handleChangeEmployee}
                                onRemove={() => setSelectedEmp([])}
                                filterOr={['name', 'code']}
                                selectedDatas={employeesOption}
                            />
                        </Item>
                    </Form>
                </CardItem>
                <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                    <LoadingButton handlePress={handleAdd} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }}>
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

export default compose(withConnect)(AddTimeKeepingTablePage);
