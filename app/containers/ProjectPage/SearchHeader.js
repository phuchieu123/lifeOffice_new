import React, { useEffect, useState, memo, useCallback, useRef } from 'react';
import {
    Content,
    Right,
    Icon,
    Button,
    View,
    List,
    ListItem,
    Text,
    CheckBox,
    Header,
    Item,
    Input,
    Spinner,
} from 'native-base';
import DateRangePicker from '../../components/DateRangePicker';
import moment from 'moment';
import Modal from 'react-native-modal';
import { API_USERS, API_ORIGANIZATION } from '../../configs/Paths';

import CustomMultiSelect from '../../components/CustomMultiSelect';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import { filter } from 'lodash';
import lodash from 'lodash';
const DATE_FORMAT = 'YYYY-MM-DD';

const SearchHeader = (props) => {
    const {
        query,
        setQuery,
        setIsSearching,
        orgsOption,
        handleAddProject,
        localKanbanStatus,
        handleFilterLoad,
        params,

    } = props;
    const [check, setCheck] = useState(false)
    const [localQuery, setLocalQuery] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    // const [localKanbanStatus, setLocalKanbanStatus] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState([]);
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [employeesOption, setEmployeesOption] = useState([]);

    const [employeeFilter, setEmployeeFilter] = useState();
    const [employeeFilterData, setEmployeeFilterData] = useState([]);

    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const data = useRef([]);
    const open = useRef();
    const [items, setItems] = useState([]);
    useEffect(() => {
        if (!query) return;
        const {
            filter: { startDate: start, endDate: end },
        } = query;
        setLocalQuery(query)
        if (params) { setKanbanStatus(params && params.kanbanStatus ? [params.kanbanStatus] : []) }
        else { setKanbanStatus(query.filter.kanbanStatus ? [query.filter.kanbanStatus] : []) }
        setSelectedOrg(query.filter.organizationUnitId ? [query.filter.organizationUnitId] : []);
        setSelectedEmp(query.filter.responsibilityPerson ? [query.filter.responsibilityPerson] : []);
        setStartDate(moment(start, DATE_FORMAT));
        setEndDate(moment(end, DATE_FORMAT).startOf('day'));

    }, [query]);

    const handleChangeOrg = (val) => {
        setSelectedOrg(val);
        setEmployeeFilter({ 'organizationUnit.organizationUnitId': val[0] });
        setSelectedEmp();
    };

    const handleOpenFilterModal = () => {
        setOpenFilterModal(true);
    };

    const handleCloseFilterModal = async () => {
        setOpenFilterModal(false);
        setLocalQuery(query);
        setKanbanStatus(localQuery.filter.kanbanStatus ? [localQuery.filter.kanbanStatus] : []);
        setSelectedOrg(localQuery.filter.organizationUnitId ? [localQuery.filter.organizationUnitId] : []);
        setSelectedEmp(localQuery.filter.responsibilityPerson ? [localQuery.filter.responsibilityPerson] : []);
        setEmployeesOption(data.current);
        setEmployeeFilter();
    };

    const handleChangeEmployee = (emp) => {
        setSelectedEmp(emp.map(e => e._id));
        setEmployeesOption(emp);
        data.current = employeesOption
    };

    const [kanbanStatus, setKanbanStatus] = useState([]);

    const handleChangeKanbanStatus = (type) => {
        setKanbanStatus(type);

    };

    const mergeArray = (a, b, key) => lodash.values(lodash.merge(lodash.keyBy(a, key), lodash.keyBy(b, key)));
    useEffect(() => {
        if (!employeesOption) return;
        data.current = mergeArray(data.current, employeesOption, '_id')
        if (!open.current) setItems(data.current);
    }, [employeesOption]);

    const handleFilter = async () => {
        setOpenFilterModal(false);
        setTimeout(() => {
            const newQuery = { ...localQuery };

            delete newQuery.filter.organizationUnitId;
            delete newQuery.filter.responsibilityPerson;

            if (selectedOrg && selectedOrg[0]) {
                newQuery.filter.organizationUnitId = selectedOrg[0];
            }
            if (selectedEmp && selectedEmp[0]) {
                newQuery.filter.responsibilityPerson = selectedEmp[0];
            }

            if (kanbanStatus && kanbanStatus[0]) {
                newQuery.filter.kanbanStatus = kanbanStatus[0];
            }

            setQuery(newQuery);
            handleFilterLoad(query)
        }, 500);
    };

    const handleSetDateRange = useCallback(
        (start, end) => {
            setShowDatePicker(false);
            let newQuery = { ...localQuery };
            newQuery.filter.startDate = `${moment(start).format(DATE_FORMAT)}`;
            newQuery.filter.endDate = `${moment(end).format(DATE_FORMAT)}`;

            setQuery(newQuery);
        },
        [localQuery],
    );

    return (
        <Right>
            <Button transparent onPress={() => setIsSearching(true)}>
                <Icon name="search" type="FontAwesome" />
            </Button>
            <Button transparent>
                <Icon type="FontAwesome" name="filter" onPress={handleOpenFilterModal} />
            </Button>
            <Button transparent onPress={handleAddProject}>
                <Icon type="FontAwesome" name="plus-circle" />
            </Button>
            <Button transparent onPress={() => setShowDatePicker(true)}>
                <Icon name="calendar" type="AntDesign" />
            </Button>
            <Modal isVisible={openFilterModal} style={{ height: 'auto' }}>
                <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
                    <List>
                        <ListItem itemHeader itemDivider style={{ borderRadius: 10 }}>
                            <Text>Phòng ban</Text>
                        </ListItem>
                        <ListItem>
                            <CustomMultiSelect
                                single
                                items={orgsOption}
                                handleSelectItems={handleChangeOrg}
                                selectedItems={selectedOrg}
                                onRemoveSelectedItem={() => setSelectedOrg([])}
                            />
                        </ListItem>
                        <ListItem itemHeader itemDivider>
                            <Text>Nhân viên phụ trách</Text>
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
                            // onSelectedItemObjectsChange={setEmployeeFilterData}
                            />
                        </ListItem>

                        <ListItem itemHeader itemDivider>
                            <Text>Trạng thái công việc</Text>
                        </ListItem>
                        <ListItem>
                            <CustomMultiSelect
                                single
                                items={localKanbanStatus}
                                uniqueKey="type"
                                handleSelectItems={handleChangeKanbanStatus}
                                selectedItems={kanbanStatus}
                                onRemoveSelectedItem={() => setKanbanStatus([])}
                            />
                        </ListItem>

                    </List>
                    <View padder style={{ flexDirection: 'row', marginTop: 40 }}>
                        <Button block onPress={handleFilter} style={{ flex: 1, borderRadius: 10 }}>
                            <Icon name="check" type="Feather" />
                        </Button>
                        <Button block onPress={handleCloseFilterModal} style={{ flex: 1, borderRadius: 10 }} warning>
                            <Icon name="close" type="AntDesign" />
                        </Button>
                    </View>
                </View>
            </Modal>
            {showDatePicker && startDate && endDate && (
                <DateRangePicker
                    initialRange={[startDate.toDate(), endDate.toDate()]}
                    handleCancel={() => setShowDatePicker(false)}
                    onSetDateRange={handleSetDateRange}
                    showDatePicker={showDatePicker}
                />
            )}
        </Right>
    );
};

export default SearchHeader;
