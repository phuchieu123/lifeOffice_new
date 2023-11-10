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
import lodash from 'lodash';
import FilterModal from '../ProjectPage/components/FilterModal';
const DATE_FORMAT = 'YYYY-MM-DD';
const SearchHeader = (props) => {
  const { query, setQuery, setIsSearching, originEmps, orgsOption } = props;

  const [localQuery, setLocalQuery] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

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
    setLocalQuery(query);
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

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
    setLocalQuery(query);
    setSelectedOrg(localQuery.filter.organizationUnitId ? [localQuery.filter.organizationUnitId] : []);
    setSelectedEmp(localQuery.filter.responsibilityPerson ? [localQuery.filter.responsibilityPerson] : [])

    setEmployeesOption(data.current);
    setEmployeeFilter();
  };
  const mergeArray = (a, b, key) => lodash.values(lodash.merge(lodash.keyBy(a, key), lodash.keyBy(b, key)));
  useEffect(() => {
    if (!employeesOption) return;
    data.current = mergeArray(data.current, employeesOption, '_id')
    if (!open.current) setItems(data.current);
  }, [employeesOption]);


  const handleChangeEmployee = (emp) => {
    setSelectedEmp(emp.map(e => e._id));
    setEmployeesOption(emp);
    data.current = employeesOption
  };

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
      setQuery(newQuery);
    }, 100);
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
      <Icon name="search" type="FontAwesome" onPress={() => setIsSearching(true)} style={{ color: '#fff', marginHorizontal: 10 }} />
      <Icon name="filter" type="FontAwesome" onPress={handleOpenFilterModal} style={{ color: '#fff', marginHorizontal: 10 }} />
      <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff', marginHorizontal: 10 }} />

      <FilterModal
        isVisible={openFilterModal}
        orgsOption={orgsOption}
        query={query}
        onClose={() => setOpenFilterModal(false)}
        onChange={handleFilter}

      />
      {/* <Modal isVisible={openFilterModal} style={{ height: 'auto' }}>
        <View style={styles.modal}>
          <List>
            <ListItem itemHeader itemDivider>
              <Text>Phòng ban</Text>
            </ListItem>
            <ListItem>
              <CustomMultiSelect
                single
                items={orgsOption}
                handleSelectItems={handleChangeOrg}
                selectedItems={selectedOrg}
                onRemoveSelectedItem={() => {
                  setSelectedOrg([])
                  setSelectedEmp([])
                }}
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
              />
            </ListItem>
          </List>
          <View padder style={{ flexDirection: 'row', marginTop: 40 }}>
            <Button block onPress={handleFilter} style={styles.btnSc}>
              <Icon name="check" type="FontAwesome5" />
            </Button>
            <Button block onPress={handleCloseFilterModal} full style={styles.btnCancel} warning>
              <Text style={{ fontWeight: 'bold', fontSize: 22 }}>X</Text>
            </Button>
          </View>
        </View>
      </Modal> */}
      {
        showDatePicker && startDate && endDate && (
          <DateRangePicker
            initialRange={[startDate.toDate(), endDate.toDate()]}
            handleCancel={() => setShowDatePicker(false)}
            onSetDateRange={handleSetDateRange}
            showDatePicker={showDatePicker}
          />
        )
      }
    </Right >
  );
};

export default SearchHeader;

const styles = {
  btnCancel: { flex: 1, borderTopRightRadius: 3, borderBottomRightRadius: 3, flex: 1 },
  btnSc: { flex: 1, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, flex: 1 },
  modal: { backgroundColor: '#fff' }
}