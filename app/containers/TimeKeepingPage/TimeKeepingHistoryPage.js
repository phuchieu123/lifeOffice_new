import React, { memo, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import _ from 'lodash';
import moment from 'moment';
import {
  Container,
  Icon,
  View
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import CustomMonthYearPicker from '../../components/CustomMonthYearPicker';
import DateRangePicker from '../../components/DateRangePicker';
import BackHeader from '../../components/Header/BackHeader';
import LoadingLayout from '../../components/LoadingLayout';
import { autoLogout } from '../../utils/autoLogout';
import makeSelectGlobal from '../App/selectors';
import ProfileModal from '../CameraTimeKeepingPage/ProfileModal';
import { getTimeKeepingHistory } from './actions';
import HistoryList from './components/HistoryList';
import reducer from './reducer';
import saga from './saga';
import makeSelectTimeKeepingPage from './selectors';


const DATE_FORMAT = 'YYYY-MM-DD';

const TimeKeepingHistoryPage = (props) => {
  useInjectReducer({ key: 'timeKeepingPage', reducer });
  useInjectSaga({ key: 'timeKeepingPage', saga });

  const { navigation, timeKeepingPage, onGetTimeKeepingHistory, open, onClose, onChange } = props;
  const { timeKeepingHistoryData } = timeKeepingPage;
  const [enable, setEnable] = useState(false)
  const [startDate, setStartDate] = useState(moment().startOf('month'));
  const [endDate, setEndDate] = useState(moment().endOf('day'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [item, setItem] = useState({});
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);


  const [query, setQuery] = useState({
    startDate: moment().startOf('month').format(DATE_FORMAT),
    endDate: moment().endOf('day').format(DATE_FORMAT),
    month: moment().month() + 1,
    year: moment().year(),
  });

  useEffect(() => {
    onGetTimeKeepingHistory(query);
  }, [query]);

  useEffect(() => {
    navigation.addListener(
      'focus', () => {
        autoLogout()
      }
    );
  }, []);

  const handleSetDateRange = (start, end) => {
    setShowDatePicker(false);
    const newQuery = {
      startDate: start,
      endDate: end,
    }
    setQuery(newQuery)
  };

  const onPress = e => {
    setItem({ ...e, type: _.has(e, 'in') ? 'IN' : 'OUT' })
    setModal(true)
  }


  return (
    <Container>
      <BackHeader
        title="Lịch sử chấm công"
        navigation={navigation}
        rightHeader={
          <>
            <Icon name="history" type="MaterialCommunityIcons" onPress={() => navigation.navigate('FailureTimeKeepingHistoryPage')} style={{ color: '#fff', marginHorizontal: 10 }} />
            <Icon
              name="calendar"
              type="AntDesign"
              // onPress={() => setShowDatePicker(true)}
              onPress={() => setEnable(true)}
              style={{ color: '#fff', marginHorizontal: 10 }}
            />
          </>
        }
      />

      <View style={timeKeepingHistoryData ? { backgroundColor: '#cfd0d0' } : {}}>
        {console.log('timeKeepingHistoryData', timeKeepingHistoryData)}
        {timeKeepingHistoryData && timeKeepingHistoryData[0] && timeKeepingHistoryData[0].timekeepingData ?
          <FlatList
            style={{ marginBottom: 60 }}
            data={timeKeepingHistoryData[0].timekeepingData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => <HistoryList item={item} onPress={onPress} />}
          />
          : <View><LoadingLayout isLoading={loading} style={{marginTop: 60}} /></View>}
      </View>

      <DateRangePicker
        initialRange={[startDate.toDate(), endDate.toDate()]}
        handleCancel={() => setShowDatePicker(false)}
        onSetDateRange={handleSetDateRange}
        showDatePicker={showDatePicker}
      />

      <ProfileModal
        onPress={() => setModal(false)}
        employee={item}
        isVisible={modal}
      />

      <CustomMonthYearPicker open={enable} onClose={() => setEnable(false)} onChange={(year, month) => setQuery({ ...query, year: year, month: month })} />

    </Container>
  );
};


const mapStateToProps = createStructuredSelector({
  timeKeepingPage: makeSelectTimeKeepingPage(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetTimeKeepingHistory: (query) => dispatch(getTimeKeepingHistory(query)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TimeKeepingHistoryPage);

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  button: {
    height: 80,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#6495ED',
    borderRadius: 15,
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  white: {},
  left: {
    flex: 0.25,
  },
  right: {
    flex: 0.25,
  },
  name: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  detail: {
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 32,
  },
  date: {
    marginBottom: 15,
  },
  right: {
    top: 1,
    flex: 0.4,
  },
  start: {
    width: '100%',
    backgroundColor: '#66ff33',
    textAlign: 'center',
    borderRadius: 10,
    margin: 2,
    fontSize: 14,
  },
  end: {
    width: '100%',
    backgroundColor: '#ff6666',
    textAlign: 'center',
    borderRadius: 10,
    margin: 2,
    fontSize: 14,
  },
});
