import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import { API_USERS } from '../../configs/Paths';
import moment from 'moment';
import { Body, Button, Icon, List, ListItem, Text, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectDepartmentsByLevel, makeSelectKanbanTaskConfigs } from '../../containers/App/selectors';
import DepartmentSelect from '../CustomMultiSelect/DepartmentSelect';
import Search from '../CustomMultiSelect/Search';
import { DateRangePicker } from '../DateRangePicker';

const DATE = 'YYYY-MM-DD'
const DATE_FORMAT = 'DD/MM/YYYY'

const FilterModal = (props) => {
    const {
        isVisible,                              //
        enableDatePicker, startDate, endDate,   //
        enableFilterOrg, organizationUnitId,    //
        enableFilterEmp, employeeId,            //
        enableEmployee, personnelId,              //
        enableTaskConfig, kanbanId,             //
        onClose, onSave,                        //
        departments, kanbanTaskConfigs,         // 
    } = props;

    const [start, setStart] = useState([]);
    const [end, setEnd] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [personnelAll, setPersonnelAll] = useState([]);
    const [kanbanStatus, setKanbanStatus] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [employeeFilter, setEmployeeFilter] = useState();

    const [employeesOption, setEmployeesOption] = useState([]);
    const [employeesPersonnel, setEmployeesPersonnel] = useState([])

    useEffect(() => {
        if (isVisible) {
            setStart(startDate)
            setEnd(endDate)
            setSelectedOrg(selectedOrg)
            setSelectedEmp(employeeId ? [employeeId] : []);
            setPersonnelAll(personnelId ? [personnelId] : []);
            organizationUnitId && setEmployeeFilter({ 'organizationUnit.organizationUnitId': organizationUnitId });
            setKanbanStatus(kanbanId ? [`${kanbanId}`] : [])
        }
    }, [isVisible, organizationUnitId, startDate, endDate, employeeId, personnelId, kanbanId, employeeId]);

    const onSetDateRange = (s, e) => {
        setShowDatePicker(false)
        setStart(s)
        setEnd(e)
    }

    const handleChangeOrg = (org) => {
        const result = org.map(e => e._id)
        setSelectedOrg(result)

        const newFilter = {}
        if (org.length) newFilter['organizationUnit.organizationUnitId'] = org[0]._id
        setEmployeeFilter(newFilter);

        if (org.length) setSelectedEmp([])
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
        onClose();
        onSave({
            organizationUnitId: selectedOrg.length ? selectedOrg[0] : null,
            employeeId: selectedEmp.length ? selectedEmp[0] : null,
            personnel: personnelAll.length ? personnelAll[0] : null,
            startDate: start ? start : moment().startOf("weeks").format(DATE_FORMAT),
            endDate: end ? end : moment().endOf("weeks").format(DATE_FORMAT),
            kanbanStatus: kanbanStatus.length ? kanbanStatus[0] : null,
            inCharge: selectedEmp.length ? selectedEmp[0] : null
        });

    };

    return (
        <Modal isVisible={isVisible} style={{ height: 'auto', borderRadius: 10 }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
                <List>
                    {enableDatePicker && <View>
                        <ListItem itemHeader itemDivider style={{ borderRadius: 10 }}>
                            <Text>Thời gian</Text>
                        </ListItem>
                        <ListItem onPress={() => setShowDatePicker(true)}>
                            <Body style={{ alignItems: "flex-end", flex: 1 }}>
                                <Text>{`${start ? moment(start, DATE).format(DATE_FORMAT) : moment().startOf("weeks").format(DATE_FORMAT)} - ${end ? moment(end, DATE).format(DATE_FORMAT) : moment().endOf("weeks").format(DATE_FORMAT)} `}
                                    <Icon type="FontAwesome" name="caret-down" color="red" style={{ fontSize: 16, color: '#000' }} />
                                </Text>
                            </Body>
                        </ListItem>
                    </View>}
                    {enableFilterOrg && <View>
                        <ListItem itemHeader itemDivider style={{ borderTopLeftRadius: enableDatePicker ? 0 : 10, borderTopRightRadius: enableDatePicker ? 0 : 10 }}>
                            <Text>Phòng ban/đơn vị</Text>
                        </ListItem>
                        <ListItem>
                            <DepartmentSelect
                                single
                                handleSelectObjectItems={handleChangeOrg}
                                selectedItems={selectedOrg}
                                onRemoveSelectedItem={() => setSelectedOrg([])}
                                emptyText='Tất cả'
                                buttonStyles={{ height: 'auto' }}
                            />
                        </ListItem>
                    </View>}

                    {enableFilterEmp &&
                        <View>
                            <ListItem itemHeader itemDivider>
                                <Text>Người phụ trách</Text>
                            </ListItem>
                            <ListItem>
                                <SingleAPISearch
                                    API={API_USERS}
                                    selectedItems={selectedEmp}
                                    onSelectedItemObjectsChange={handleChangeEmployee}
                                    onRemove={() => setSelectedEmp([])}
                                    filterOr={['name', 'code']}
                                    filter={employeeFilter}
                                    selectedDatas={employeesOption}
                                    emptyText='Tất cả'
                                    buttonStyles={{ height: 'auto' }}
                                />
                            </ListItem>
                        </View>
                    }
                    {enableEmployee &&
                        <View>
                            <ListItem itemHeader itemDivider>
                                <Text>Nhân viên</Text>
                            </ListItem>
                            <ListItem>
                                <SingleAPISearch
                                    API={API_USERS}
                                    selectedItems={personnelAll}
                                    onSelectedItemObjectsChange={handleChangePersonnel}
                                    onRemove={() => setPersonnelAll([])}
                                    filterOr={['name', 'code']}
                                    filter={employeeFilter}
                                    selectedDatas={employeesPersonnel}
                                    emptyText='Tất cả'
                                    buttonStyles={{ height: 'auto' }}
                                />
                            </ListItem>
                        </View>
                    }
                    {enableTaskConfig && <View>
                        <ListItem itemHeader itemDivider>
                            <Text>Trạng thái công việc</Text>
                        </ListItem>
                        <ListItem>
                            <Search
                                single
                                items={kanbanTaskConfigs}
                                uniqueKey="type"
                                handleSelectItems={setKanbanStatus}
                                selectedItems={kanbanStatus}
                                onRemoveSelectedItem={() => setKanbanStatus([])}
                                emptyText='Tất cả'
                                buttonStyles={{ height: 'auto' }}
                            />
                        </ListItem>
                    </View>}

                </List>
                <View padder style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Button block onPress={handleSave} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
                        <Icon name="check" type="Feather" />
                    </Button>
                    <Button block onPress={onClose} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
                        <Icon name="close" type="AntDesign" />
                    </Button>
                </View>
            </View>


            {showDatePicker &&
                <DateRangePicker
                    initialRange={[start, end]}
                    handleCancel={() => setShowDatePicker(false)}
                    onSetDateRange={onSetDateRange}
                    showDatePicker={showDatePicker}
                />
            }
        </Modal >
    );
};

const mapStateToProps = createStructuredSelector({
    kanbanTaskConfigs: makeSelectKanbanTaskConfigs(),
    departments: makeSelectDepartmentsByLevel(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(FilterModal);
