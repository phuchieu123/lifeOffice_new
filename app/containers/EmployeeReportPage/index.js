import React, { memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import Icon from 'react-native-vector-icons/Entypo';
import {Text, View, TouchableOpacity} from 'react-native';
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
    <View>
      <BackHeader title="Báo cáo nhân sự" navigation={navigation} />
      <View style={styles.content}>
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('EmployeeAgeChart')}>
            <View>
              <Text>Báo cáo theo độ tuổi</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SeniorityReport')}>
            <View>
              <Text>Báo cáo theo thâm niên</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigation.navigate('EmployeeContractChart')}>
            <View>
              <Text>Báo cáo theo hợp đồng</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity> */}

          <TouchableOpacity onPress={() => navigation.navigate('EmployeeWordChart')}>
            <View>
              <Text>Báo cáo theo ngày làm việc</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('EmployeePositionChart')}>
            <View>
              <Text>Báo cáo theo chức vụ</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('EmployeeSituationChart')}>
            <View>
              <Text>Báo cáo tình hình nhân sự</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>



          {/* <TouchableOpacity onPress={() => navigation.navigate('RecCostReport')}>
            <View>
              <Text>Báo cáo chi phí tuyển dụng</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('OrgReport')}>
            <View>
              <Text>Báo cáo theo phòng ban</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => navigation.navigate('EmployeeBirthChart')}>
            <View>
              <Text>Ngày sinh</Text>
            </View>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EmployeeGenderChart')}>
            <View>
              <Text>Giới tính</Text>
            </View>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EmployeeSkillChart')}>
            <View>
              <Text>Trình độ chuyên môn</Text>
            </View>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('EmployeeSeniorityChart')}>
            <View>
              <Text>Báo cáo thống kê theo thâm niên</Text>
            </View>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </View>
          </View> */}
          {/* <TouchableOpacity onPress={() => navigation.navigate('FillterDepartment')}>
            <View>
              <Text>Theo phòng ban</Text>
            </View>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </View> */}
        </View>
      </View>
    </View>
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