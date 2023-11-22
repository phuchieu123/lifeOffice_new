import React, {memo} from 'react';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {createStructuredSelector} from 'reselect';

import Icon from 'react-native-vector-icons/Entypo';
import {Text, View, TouchableOpacity} from 'react-native';
import {useInjectReducer} from '../../utils/injectReducer';
import {useInjectSaga} from '../../utils/injectSaga';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal from '../App/selectors';
import reducer from './reducer';
import saga from './saga';
import makeSelectEmployeeReportPage from './selectors';

const EmployeeReportPage = props => {
  useInjectReducer({key: 'employeeReportPage', reducer});
  useInjectSaga({key: 'employeeReportPage', saga});

  const {navigation} = props;

  return (
    <View>
      <BackHeader title="Báo cáo nhân sự" navigation={navigation} />
      <View style={styles.content}>
        <View>
          <TouchableOpacity
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#ddd',
              marginTop: 5,
              marginHorizontal: 5,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate('EmployeeAgeChart')}>
            <View>
              <Text style={styles.text}>Báo cáo theo độ tuổi</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#ddd',
              marginTop: 5,
              marginHorizontal: 5,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate('SeniorityReport')}>
            <View>
              <Text style={styles.text}>Báo cáo theo thâm niên</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>
          {/* <TouchableOpacity style={{padding: 10, flexDirection:'row',justifyContent:"space-between", backgroundColor:'#ddd', marginTop: 5, marginHorizontal: 5, borderRadius: 10}} onPress={() => navigation.navigate('EmployeeContractChart')}>
            <View>
              <Text style={styles.text}>Báo cáo theo hợp đồng</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#ddd',
              marginTop: 5,
              marginHorizontal: 5,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate('EmployeeWordChart')}>
            <View>
              <Text style={styles.text}>Báo cáo theo ngày làm việc</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#ddd',
              marginTop: 5,
              marginHorizontal: 5,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate('EmployeePositionChart')}>
            <View>
              <Text style={styles.text}>Báo cáo theo chức vụ</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#ddd',
              marginTop: 5,
              marginHorizontal: 5,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate('EmployeeSituationChart')}>
            <View>
              <Text style={styles.text}>Báo cáo tình hình nhân sự</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>

          {/* <TouchableOpacity style={{padding: 10, flexDirection:'row',justifyContent:"space-between", backgroundColor:'#ddd', marginTop: 5, marginHorizontal: 5, borderRadius: 10}} onPress={() => navigation.navigate('RecCostReport')}>
            <View>
              <Text style={styles.text}>Báo cáo chi phí tuyển dụng</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={{padding: 10, flexDirection:'row',justifyContent:"space-between", backgroundColor:'#ddd', marginTop: 5, marginHorizontal: 5, borderRadius: 10}} onPress={() => navigation.navigate('OrgReport')}>
            <View>
              <Text style={styles.text}>Báo cáo theo phòng ban</Text>
            </View>
            <Icon name="chevron-right" type="Entypo" style={styles.icon} />
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={{padding: 10, flexDirection:'row',justifyContent:"space-between", backgroundColor:'#ddd', marginTop: 5, marginHorizontal: 5, borderRadius: 10}} onPress={() => navigation.navigate('EmployeeBirthChart')}>
            <View>
              <Text style={styles.text}>Ngày sinh</Text>
            </View>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </View>
          <TouchableOpacity style={{padding: 10, flexDirection:'row',justifyContent:"space-between", backgroundColor:'#ddd', marginTop: 5, marginHorizontal: 5, borderRadius: 10}} onPress={() => navigation.navigate('EmployeeGenderChart')}>
            <View>
              <Text style={styles.text}>Giới tính</Text>
            </View>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </View>
          <TouchableOpacity style={{padding: 10, flexDirection:'row',justifyContent:"space-between", backgroundColor:'#ddd', marginTop: 5, marginHorizontal: 5, borderRadius: 10}} onPress={() => navigation.navigate('EmployeeSkillChart')}>
            <View>
              <Text style={styles.text}>Trình độ chuyên môn</Text>
            </View>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </View>
          <TouchableOpacity style={{padding: 10, flexDirection:'row',justifyContent:"space-between", backgroundColor:'#ddd', marginTop: 5, marginHorizontal: 5, borderRadius: 10}} onPress={() => navigation.navigate('EmployeeSeniorityChart')}>
            <View>
              <Text style={styles.text}>Báo cáo thống kê theo thâm niên</Text>
            </View>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </View>
          </View> */}
          {/* <TouchableOpacity style={{padding: 10, flexDirection:'row',justifyContent:"space-between", backgroundColor:'#ddd', marginTop: 5, marginHorizontal: 5, borderRadius: 10}} onPress={() => navigation.navigate('FillterDepartment')}>
            <View>
              <Text style={styles.text}>Theo phòng ban</Text>
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
  icon: {
    color: 'rgba(46, 149, 46, 1)',
    fontSize: 20,
  },
  text: {},
};
