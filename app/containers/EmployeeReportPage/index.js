import React, { memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  Body,
  Container,
  Content,
  Icon,
  List,
  ListItem,
  Text
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal from '../App/selectors';
import reducer from './reducer';
import saga from './saga';
import makeSelectEmployeeReportPage from './selectors';

const EmployeeReportPage = (props) => {
  useInjectReducer({ key: 'employeeReportPage', reducer });
  useInjectSaga({ key: 'employeeReportPage', saga });

  const { navigation } = props;

  return (
    <Container>
      <BackHeader title="Báo cáo nhân sự" navigation={navigation} />
      <Content style={styles.content}>
        <List>
          <ListItem onPress={() => navigation.navigate('EmployeeAgeChart')}>
            <Body>
              <Text>Báo cáo theo độ tuổi</Text>
            </Body>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </ListItem>
          <ListItem onPress={() => navigation.navigate('SeniorityReport')}>
            <Body>
              <Text>Báo cáo theo thâm niên</Text>
            </Body>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </ListItem>
          {/* <ListItem onPress={() => navigation.navigate('EmployeeContractChart')}>
            <Body>
              <Text>Báo cáo theo hợp đồng</Text>
            </Body>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </ListItem> */}

          <ListItem onPress={() => navigation.navigate('EmployeeWordChart')}>
            <Body>
              <Text>Báo cáo theo ngày làm việc</Text>
            </Body>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </ListItem>
          <ListItem onPress={() => navigation.navigate('EmployeePositionChart')}>
            <Body>
              <Text>Báo cáo theo chức vụ</Text>
            </Body>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </ListItem>
          <ListItem onPress={() => navigation.navigate('EmployeeSituationChart')}>
            <Body>
              <Text>Báo cáo tình hình nhân sự</Text>
            </Body>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </ListItem>



          {/* <ListItem onPress={() => navigation.navigate('RecCostReport')}>
            <Body>
              <Text>Báo cáo chi phí tuyển dụng</Text>
            </Body>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </ListItem>
          <ListItem onPress={() => navigation.navigate('OrgReport')}>
            <Body>
              <Text>Báo cáo theo phòng ban</Text>
            </Body>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </ListItem> */}
          {/* <ListItem onPress={() => navigation.navigate('EmployeeBirthChart')}>
            <Body>
              <Text>Ngày sinh</Text>
            </Body>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </ListItem>
          <ListItem onPress={() => navigation.navigate('EmployeeGenderChart')}>
            <Body>
              <Text>Giới tính</Text>
            </Body>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </ListItem>
          <ListItem onPress={() => navigation.navigate('EmployeeSkillChart')}>
            <Body>
              <Text>Trình độ chuyên môn</Text>
            </Body>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </ListItem>
          <ListItem onPress={() => navigation.navigate('EmployeeSeniorityChart')}>
            <Body>
              <Text>Báo cáo thống kê theo thâm niên</Text>
            </Body>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </ListItem>
          </ListItem> */}
          {/* <ListItem onPress={() => navigation.navigate('FillterDepartment')}>
            <Body>
              <Text>Theo phòng ban</Text>
            </Body>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </ListItem> */}
        </List>
      </Content>
    </Container>
  );
};


const mapStateToProps = createStructuredSelector({
  employeeReportPage: makeSelectEmployeeReportPage(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(EmployeeReportPage);

const styles = {
  backgroundColor: '#fff',
  icon: {
    opacity: 0.2
  }
}