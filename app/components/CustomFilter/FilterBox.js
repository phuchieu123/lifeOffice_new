import React, { useEffect, useState } from 'react';
import { View, List, ListItem, Text, Icon, Button, Body, Right } from 'native-base';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Modal from 'react-native-modal';
import { makeSelectKanbanTaskConfigs, makeSelectDepartmentsByLevel } from '../../containers/App/selectors';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import { API_USERS } from '../../configs/Paths';
import DepartmentSelect from '../CustomMultiSelect/DepartmentSelect';
import Search from '../CustomMultiSelect/Search';
import _, { isEqual } from 'lodash'
import { BackHandler } from 'react-native';
import { DateRangePicker } from '../DateRangePicker';
import LoadingButton from '../LoadingButton';
import moment from 'moment';
import DateTimePicker from '../CustomDateTimePicker/DateTimePicker';

const DATE = 'YYYY-MM-DD'
const DATE_FORMAT = 'DD/MM/YYYY'

const FilterBox = (props) => {
    const {
        enableDayPicker, day = moment().format(DATE_FORMAT),   //
        enableDatePicker, startDate, endDate,   //
        enableFilterOrg, organizationUnitId,    //
        enableFilterEmp, employeeId,            //
        enableEmployee, personnelId,            //
        enableTaskConfig, kanbanId,             //
        onSave,                                 //
        departments, kanbanTaskConfigs,         // 
        loading,                                //
    } = props;

    const [dayState, setDayState] = useState(day);
    const [start, setStart] = useState(startDate);
    const [end, setEnd] = useState(endDate);
    const [selectedOrg, setSelectedOrg] = useState(organizationUnitId ? [organizationUnitId] : []);
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [personnelAll, setPersonnelAll] = useState([]);
    const [kanbanStatus, setKanbanStatus] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [employeeFilter, setEmployeeFilter] = useState();
    const onChangeDay = date => {
        setDayState(moment(date).format(DATE_FORMAT))
    }

    const onSetDateRange = (s, e) => {
        setShowDatePicker(false)
        setStart(s)
        setEnd(e)
    }

    const handleChangeOrg = (org) => {
        const result = org.map(e => e._id)
        setSelectedOrg(result)
    };

    const handleChangeEmployee = (emp) => {
        setSelectedEmp(emp.map(e => e._id));
        setEmployeesOption((e) => ([...e, ...emp]));
    };


    const handleChangePersonnel = (emp) => {
        setPersonnelAll(emp.map(e => e._id));
        setEmployeesPersonnel((e) => [...e, ...emp]);
    };

    const handleSave = () => {
        onSave && onSave({
            day: dayState,
            startDate: start,
            endDate: end,
            organizationUnitId: selectedOrg.length ? selectedOrg[0] : null,
            // employeeId: selectedEmp.length ? selectedEmp[0] : null,
            // personnel: personnelAll.length ? personnelAll[0] : null,
            // kanbanStatus: kanbanStatus.length ? kanbanStatus[0] : null,
            // inCharge: selectedEmp.length ? selectedEmp[0] : null
        });

    };

    return (
        <View>


            {enableDayPicker &&
                <ListItem style={{ height: 55 }}>
                    <DateTimePicker
                        mode="date"
                        onSave={onChangeDay}
                        value={dayState}
                    />
                </ListItem>
            }

            {/* {enableDatePicker &&
                <ListItem onPress={() => setShowDatePicker(true)} style={{ height: 55 }}>
                    <Text style={{ position: 'absolute', right: 28 }}>
                        {`${start ? moment(start, DATE).format(DATE_FORMAT) : '   '} - ${end ? moment(end, DATE).format(DATE_FORMAT) : ''}   `}
                        <Icon type="FontAwesome" name="caret-down" color="red" style={{ fontSize: 16, color: '#000' }} />
                    </Text>
                </ListItem>} */}

            {enableDatePicker && <View>

                <ListItem onPress={() => setShowDatePicker(true)}>
                    <Body style={{ alignItems: "flex-end", flex: 1 }}>
                        <Text>{`${start ? moment(start, DATE).format(DATE_FORMAT) : '   '} - ${end ? moment(end, DATE).format(DATE_FORMAT) : '   '} `}
                            <Icon type="FontAwesome" name="caret-down" color="red" style={{ fontSize: 16, color: '#000' }} />
                        </Text>
                    </Body>
                </ListItem>
            </View>}

            {enableFilterOrg && <ListItem >
                <DepartmentSelect
                    single
                    handleSelectObjectItems={handleChangeOrg}
                    selectedItems={selectedOrg}
                    onRemoveSelectedItem={() => setSelectedOrg([])}
                    emptyText='Tất cả phòng ban'
                    buttonStyles={{ height: 'auto' }}
                />
            </ListItem>}

            <View padder style={{ flexDirection: 'row' }}>
                <LoadingButton isBusy={loading} block onPress={handleSave} style={{ borderRadius: 10, flex: 1 }}>
                    {/* <Icon name="check" type="Feather" /> */}
                    <Text>Xem báo cáo</Text>
                </LoadingButton>
            </View>

            {showDatePicker &&
                <DateRangePicker
                    initialRange={[start, end]}
                    handleCancel={() => setShowDatePicker(false)}
                    onSetDateRange={onSetDateRange}
                    showDatePicker={showDatePicker}
                />
            }
        </View >
    );
};

const mapStateToProps = createStructuredSelector({
    kanbanTaskConfigs: makeSelectKanbanTaskConfigs(),
    departments: makeSelectDepartmentsByLevel(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(FilterBox);
