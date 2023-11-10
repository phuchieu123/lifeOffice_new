import moment from 'moment';
import { Container, Content, Icon } from 'native-base';
import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import DateRangePicker from '../../components/DateRangePicker';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal from '../App/selectors';
import { getTimeKeepingReport } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectTimeKeepingChart from './selectors';
import styles from './styles';

import BarChart from '../../components/CustomChart/BarChart';
const TimeKeepingChart = (props) => {
  useInjectReducer({ key: 'timeKeepingReportPage', reducer });
  useInjectSaga({ key: 'timeKeepingReportPage', saga });

  const { navigation, timeKeepingReportPage, getTimeKeepingReport } = props;
  const { timeKeepingReportData } = timeKeepingReportPage;

  const [query, setQuery] = useState({});

  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    updateQuery(query);
  }, []);

  useEffect(() => {
    getTimeKeepingReport(query);
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
        title="Biểu đồ chấm công"
        navigation={navigation}
         rightStyle={{ flex: 0.3 }}
        rightHeader={
          <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff' , marginHorizontal:10 }} />
        }
      />
      <Content style={styles.content}>{timeKeepingReportData && <BarChart data={timeKeepingReportData} />}</Content>

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
  timeKeepingReportPage: makeSelectTimeKeepingChart(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    getTimeKeepingReport: (query) => dispatch(getTimeKeepingReport(query)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TimeKeepingChart);
