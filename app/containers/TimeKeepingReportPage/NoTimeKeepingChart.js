import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import DateRangePicker from '../../components/DateRangePicker';
import Icon from 'react-native-vector-icons/AntDesign'
import BarChart from '../../components/CustomChart/BarChart';
import moment from 'moment';
import {
  View, Text
} from 'react-native';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal from '../App/selectors';
import { getAbsentReport } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectNoTimeKeepingChart from './selectors';
import styles from './styles';

const NoTimeKeepingChart = (props) => {
  useInjectReducer({ key: 'timeKeepingReportPage', reducer });
  useInjectSaga({ key: 'timeKeepingReportPage', saga });

  const { navigation, timeKeepingReportPage, getAbsentReport } = props;
  const { absentReportData } = timeKeepingReportPage;

  const [query, setQuery] = useState({});

  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    updateQuery(query);
  }, []);

  useEffect(() => {
    getAbsentReport(query);
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
    <View>
      <BackHeader
        title="Báo cáo không chấm công"
        navigation={navigation}
         rightStyle={{ flex: 0.3 }}
        rightHeader={
          <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff' , marginHorizontal:10,fontSize:20  }} />
        }
      />
      <View style={styles.content}>{absentReportData && <BarChart data={absentReportData} />}</View>

      <DateRangePicker
        initialRange={[startDate.toDate(), endDate.toDate()]}
        handleCancel={() => setShowDatePicker(false)}
        onSetDateRange={handleSetDateRange}
        showDatePicker={showDatePicker}
      />
    </View>
  );
};


const mapStateToProps = createStructuredSelector({
  timeKeepingReportPage: makeSelectNoTimeKeepingChart(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    getAbsentReport: (query) => dispatch(getAbsentReport(query)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(NoTimeKeepingChart);
