import React, { useEffect, useState, useCallback } from 'react';
import { FlatList } from 'react-native';

import {
  Item,
  Input,
  Button,
  Text,
  Container,
  View,
  Icon,
  Footer,
  FooterTab,
  List,
  Tabs,
  Tab,
} from 'native-base';
import Modal from 'react-native-modal';
import ListCustom from './ListCustom';
import { API_USERS, API_ORIGANIZATION } from 'configs/Paths';
import { handleSearch } from 'utils/common';

export default FilterModal = (props) => {
  const { open, handleFilter, handleClose } = props;
  const [departments, setDepartments] = useState([]);
  const [departmentsOption, setDepartmentsOption] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeesOption, setEmployeesOption] = useState([]);
  const [employeeFilter, setEmployeeFilter] = useState([]);
  const [originEmp, setOriginEmp] = useState([]);

  useEffect(() => {
    handleSearchEmployees();
    handleSearchDepartments();
  }, []);


  useEffect(() => {
    if (open) {
      setDepartments(props.departments);
      setEmployees(props.employees);
    }
  }, [props.departments, props.employees, open]);

  const handleChangeTab = useCallback(
    ({ from, i, ref }) => {
      if (i === 1) {
        setEmployeeFilter(
          departments.length === 0
            ? employeesOption
            : employeesOption.filter(
              (e) => e.organizationUnit && departments.includes(e.organizationUnit.organizationUnitId),
            ),
        );
      }
    },
    [employeesOption, departments],
  );


  const handleSave = () => {
    const employeesTemp =
      departments.length === 0
        ? employees
        : employeesOption
          .filter(
            (e) =>
              employees.includes(e._id) &&
              e.organizationUnit &&
              departments.includes(e.organizationUnit.organizationUnitId),
          )
          .map((e) => e._id);

    handleFilter({ departments, employees: employeesTemp });
    handleClose();
  };
  const padStart = (n, str) => {
    let newStr = str;
    for (let i = 0; i < n; i += 1) {
      newStr = '    ' + newStr;
    }
    return newStr;
  };
  const formatOrgs = (orgs, output, level, newMap) => {
    orgs.forEach((o) => {
      output.push({
        _id: o._id,
        name: padStart(level, o.name),
        path: o.path,
      });
      if (o.child && o.child.length) {
        formatOrgs(o.child, output, level + 1);
      }
    });
  };

  // API
  const handleSearchEmployees = async () => {
    const url = `${await API_USERS()}`;
    // handleSearch(url, setEmployeesOption);
    handleSearch(url, (data) => {
      const output = [];
      formatOrgs(data, output, 0)
      setEmployeesOption(output);
      setOriginEmp(output);
    });

  };

  const handleSearchDepartments = async () => {
    const url = `${await API_ORIGANIZATION()}`;
    // handleSearch(url, setDepartmentsOption);
    handleSearch(url, (data) => {
      const output = [];
      formatOrgs(data, output, 0)
      setDepartmentsOption(output);
      //  originEmp = output

    });
  };

  let newData;
  const onSearchText = async (e) => {
    
    newData = originEmp.filter((item) => {

      return (item.name).includes(e);
    })


    setEmployeesOption(newData);
  }

  const onChangeDepartment = (e) => {
    setDepartments(e)
    // let newData= originEmp.filter((item)=>{
    //   return item._id===e
    // })
    // setDepartmentsOption(newData);
   
  }

  return (
    <Modal isVisible={open}>
      <Container>
        <Tabs onChangeTab={handleChangeTab}>
          <Tab heading="Phòng ban">
            {/* <CustomMultiSelect
              single
              item={departmentsOption}
              handleSelectItems={(item) => {
                setEmployeesOption(item[0])
              }}
              selectedItems={employeesOption ? [employeesOption] : []}
              onRemoveSelectedItem={() => setEmployeesOption(null)
              }

            /> */}



            <View style={{ backgroundColor: '#fff', marginLeft: 0, textAlign: 'right' }}>
              <List selected>
                <FlatList
                  data={departmentsOption}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) =>
                    <ListCustom
                      single
                      item={item}
                      list={departments}
                      setList={onChangeDepartment} />}
                />

              </List>
            </View>

          </Tab>
          <Tab heading="Nhân viên">
            <Item regular>
              <Input placeholder="Tìm kiếm..." onChangeText={onSearchText} />
            </Item>

            <List selected>
              {/* {employeeFilter.map((item) => (
                <ListCustom key={item._id} item={item} list={employees} setList={setEmployees} />
              ))} */}
              <FlatList
                data={employeesOption}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) =>
                  <ListCustom item={item}
                    list={employees}
                    setList={setEmployees} />}
              />

              {/* <ListPage
                  query={{}}
                  api={async () => `${await API_USERS()}`}
                  itemComponent={({ item }) => (

                    <ListItem style={{ border: '1px black solid' , backgroundColor:'red' }}>
                      
                      <Body>
                        <Text style={{ color: 'red' , backgroundColor:'red' }}>{item.name}</Text>
                      </Body> 
                    </ListItem>
                  )}

                /> */}








            </List>
          </Tab>
        </Tabs>


        <Footer transparent>
          <FooterTab>
            <Button block onPress={handleSave} style={{ flex: 1 }}>
              <Icon name="save" type="Entypo" style={{ color: 'white' }} />
            </Button>
          </FooterTab>

          <FooterTab>
            <Button block onPress={handleClose} full style={{ flex: 1 }} warning>
              <Text style={{ color: 'white' }}>Hủy</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </Modal>
  );
};

