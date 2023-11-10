import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import DateRangePicker from '../../components/DateRangePicker';

import BarChart from '../../components/CustomChart/BarChart';
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
import { getTimeKeepingLateEarly } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectLateEarlyChart from './selectors';
import styles from './styles';

const LateEarlyChart = (props) => {
  useInjectReducer({ key: 'timeKeepingReportPage', reducer });
  useInjectSaga({ key: 'timeKeepingReportPage', saga });

  const { navigation, timeKeepingReportPage, getTimeKeepingLateEarly } = props;
  // const { timeKeepingLateEarlyData } = timeKeepingReportPage;

  const [query, setQuery] = useState({});

  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const data1 = [3, 2, 3, 5].map((value) => ({ value }));
  const data2 = [2, 1, 2, 4].map((value) => ({ value }));
  const xData = ['22/3', '23/3', '24/3', '25/3'].map((value) => ({ value }));
  const yData = [1, 2, 3, 4, 5];
  const barData = [
    {
      data: data1,
      svg: {
        fill: 'green',
      },
    },
    {
      data: data2,
      svg: {
        fill: 'orange',
      },
    },
  ];
  const legendData = [
    {
      title: 'Vào ca muộn',
      color: 'green',
    },
    {
      title: 'Ra ca sớm',
      color: 'orange',
    },
  ];

  const timeKeepingLateEarlyData = { xData, yData, barData, legendData }

  useEffect(() => {
    updateQuery(query);
  }, []);

  useEffect(() => {
    getTimeKeepingLateEarly(query);
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
        title="Biểu đồ chấm công trễ sớm"
        navigation={navigation}
        rightStyle={{ flex: 0.3 }}
        rightHeader={
          <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff', marginHorizontal: 10 }} />
        }
      />
      <Content style={styles.content}>
        {timeKeepingLateEarlyData && <BarChart data={timeKeepingLateEarlyData} />}
      </Content>

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
  timeKeepingReportPage: makeSelectLateEarlyChart(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    getTimeKeepingLateEarly: (query) => dispatch(getTimeKeepingLateEarly(query)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(LateEarlyChart);
