import React, { useEffect, useState } from 'react';
import { View, List, ListItem } from 'native-base';
import { Text, Icon, Button } from 'native-base';
import { API_USERS } from '../../../configs/Paths';
import CustomMultiSelect from 'components/CustomMultiSelect';
import Modal from 'react-native-modal';
import SingleAPISearch from '../../../components/CustomMultiSelect/SingleAPISearch';

const FilterModal = (props) => {
  const { isVisible, orgsOption, query, onClose, localKanbanStatus, onChange } = props;
  // const [isVisible, setisVisible] = useState(false)
  const [selectedEmp, setSelectedEmp] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState([]);
  const [kanbanStatus, setKanbanStatus] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState();
  const [employeesOption, setEmployeesOption] = useState([]);


  useEffect(() => {
    if (isVisible) {
      const filter = { ...query.filter };
      setSelectedEmp(filter.employeeId ? [filter.employeeId] : []);
      setSelectedOrg(filter.organizationUnit ? [filter.organizationUnit] : []);
      setKanbanStatus(filter.kanbanStatus ? [filter.kanbanStatus] : []);
      if (Array.isArray(filter.organizationUnit) && filter.organizationUnit.length) {
        setEmployeeFilter({ 'organizationUnit.organizationUnitId': filter.organizationUnit });
      }
    }
  }, [isVisible, query.filter]);

  const handleChangeOrg = (val) => {
    setSelectedEmp([]);
    setSelectedOrg(val);
    setEmployeeFilter({ 'organizationUnit.organizationUnitId': val[0] });
  };

  const handleChangeEmployee = (emp) => {
    setSelectedEmp(emp.map(e => e._id));
    setEmployeesOption((e) => [...e, ...emp]);
  };

  // const [selectedType, setSelectedType] = useState([]);
  // const handleChangeType = (type) => {
  //   setSelectedType(type);
  // };
  const handleChange = () => {
    onClose();
    onChange({
      selectedEmp,
      selectedOrg,
      kanbanStatus,
    });
  };

  return (
    <Modal isVisible={isVisible} style={{ height: 'auto' }}>
      <View style={{ borderRadius: 10, backgroundColor: '#fff' }}>
        <List>
          <View >
            <View>
              <ListItem itemHeader itemDivider style={{ borderTopEndRadius: 10, borderTopStartRadius: 10 }}>
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
            </View>

            <View>
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
            </View>

            {/* <View>
          {
            <ListItem itemHeader itemDivider>
              <Text>Trạng thái công việc</Text>
            </ListItem>
            <ListItem>
              <CustomMultiSelect
                single
                items={localKanbanStatus}
                uniqueKey="type"
                handleSelectItems={setKanbanStatus}
                selectedItDems={kanbanStatus}
                onRemoveSelectedItem={() => setKanbanStatus([])}
              />
            </ListItem>
          </View> */}
            {/* <ListItem itemHeader itemDivider>
       <Text>Loại công việc</Text>
     </ListItem>
     <ListItem>
       <CustomMultiSelect
         single
         items={taskTypes}
         handleSelectItems={handleChangeEmployee}
         selectedItems={selectedEmp}
         onRemoveSelectedItem={() => setSelectedEmp([])}
       />
     </ListItem> */}
            {/* <ListItem itemHeader itemDivider>
         <Text>Loại công việc</Text>
       </ListItem>
       <ListItem button onPress={() => handleChangeProjectType(true)}>
         <Radio selected={isProject} />
         <Body>
           <Text>Dự án</Text>
         </Body>
       </ListItem>
       <ListItem button onPress={() => handleChangeProjectType(false)}>
         <Radio selected={!isProject} color="green" />
         <Body>
           <Text>Công việc liên quan</Text>
         </Body>
       </ListItem> */}
            {/* <ListItem itemHeader itemDivider>
       <Text>Trạng thái</Text>
     </ListItem>
     <ListItem button onPress={() => handleChangeTaskStatus('todo')}>
       <CheckBox checked={taskStatus.todo} color="gray" />
       <Body>
         <Text>Chưa thực hiện</Text>
       </Body>
     </ListItem>
     <ListItem button onPress={() => handleChangeTaskStatus('inProcess')}>
       <CheckBox checked={taskStatus.inProcess} onPress={() => handleChangeTaskStatus('inProcess')} />
       <Body>
         <Text>Đang thực hiện</Text>
       </Body>
     </ListItem>
     <ListItem button onPress={() => handleChangeTaskStatus('complete')}>
       <CheckBox
         checked={taskStatus.complete}
         color="green"
         onPress={() => handleChangeTaskStatus('complete')}
       />
       <Body>
         <Text>Đã hoàn thành</Text>
       </Body>
     </ListItem>
     <ListItem button onPress={() => handleChangeTaskStatus('stop')}>
       <CheckBox checked={taskStatus.stop} color="black" onPress={() => handleChangeTaskStatus('stop')} />
       <Body>
         <Text>Đã dừng</Text>
       </Body>
     </ListItem> */}
            <View padder style={{ flexDirection: 'row' }}>
              <Button block onPress={handleChange} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
                <Icon name="check" type="Feather" />
              </Button>
              <Button block onPress={onClose} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
                <Icon name="close" type="AntDesign" />
              </Button>
            </View>
          </View>
        </List>
      </View>
    </Modal>
  );
};

export default FilterModal;
