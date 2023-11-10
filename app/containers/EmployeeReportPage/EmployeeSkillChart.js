import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import DateRangePicker from '../../components/DateRangePicker';

import PieChart from '../../components/CustomChart/PieChart';
import moment from 'moment';
import {
  Container,
  Content,
  Icon
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal from '../App/selectors';
import { getEmployeeReportSkill } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectEmployeeSkillChart from './selectors';
import styles from './styles';

const EmployeeSkillChart = (props) => {
  useInjectReducer({ key: 'timeKeepingReportPage', reducer });
  useInjectSaga({ key: 'timeKeepingReportPage', saga });

  const { navigation, timeKeepingReportPage, getEmployeeReportSkill } = props;
  const { employeeReportSkillData } = timeKeepingReportPage;
  const [query, setQuery] = useState({});

  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    updateQuery(query);
  }, []);

  useEffect(() => {
    getEmployeeReportSkill(query);
  }, [query]);

  const updateQuery = () => {
    const newQuery = {
      ...query,
      filter: {
        createdAt: {
          $gte: `${startDate.format()}`,
          $lte: `${endDate.endOf('day').format()}`,
        },
      },
    };
    setQuery(newQuery);
  };

  const handleSetDateRange = (start, end) => {
    setShowDatePicker(false);
    setStartDate(moment(start));
    setEndDate(moment(end));
    updateQuery();
  };

  return (
    <Container>
      <BackHeader
        title="Báo cáo trình độ chuyên môn"
        navigation={navigation}
        rightStyle={{ flex: 0.3 }}
        rightHeader={
          <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff', marginHorizontal: 10 }} />
        }
      />
      <Content style={styles.content}>{employeeReportSkillData && <PieChart data={employeeReportSkillData} />}</Content>

      <DateRangePicker
        initialRange={[startDate.toDate(), endDate.toDate()]}
        handleCancel={() => setShowDatePicker(false)}
        onSetDateRange={handleSetDateRange}
        showDatePicker={showDatePicker}
      />
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  timeKeepingReportPage: makeSelectEmployeeSkillChart(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    getEmployeeReportSkill: (query) => dispatch(getEmployeeReportSkill(query)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(EmployeeSkillChart);
