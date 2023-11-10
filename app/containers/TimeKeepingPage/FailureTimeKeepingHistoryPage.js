import React, { memo, useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import moment from 'moment';
import {
  Container,
  Text,
  View
} from 'native-base';
import theme from '../../utils/customTheme';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import DateRangePicker from '../../components/DateRangePicker';
import BackHeader from '../../components/Header/BackHeader';
import ListPage from '../../components/ListPage';
import { API_CHECK_IN_FAIL } from '../../configs/Paths';
import { getProfile } from '../../utils/authen';
import { DATE_FORMAT } from '../../utils/constants';
import makeSelectGlobal from '../App/selectors';
import ProfileModal from '../CameraTimeKeepingPage/ProfileModal';
import { getTimeKeepingHistory } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectTimeKeepingPage from './selectors';

const FailureTimeKeepingHistoryPage = (props) => {
  useInjectReducer({ key: 'timeKeepingPage', reducer });
  useInjectSaga({ key: 'timeKeepingPage', saga });

  const { navigation, timeKeepingPage, onGetTimeKeepingHistory } = props;
  const { timeKeepingHistoryData } = timeKeepingPage;

  const [startDate, setStartDate] = useState(moment().startOf('month'));
  const [endDate, setEndDate] = useState(moment().endOf('day'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [employee, setEmployee] = useState({});
  const [modal, setModal] = useState(false);

  const [query, setQuery] = useState();
  const [api, setApi] = useState();

  useEffect(() => {
    getProfile().then(async profile => {
      const url = await API_CHECK_IN_FAIL()
      setApi(`${url}/${profile.hrmEmployeeId}`)
      setQuery({
        // filter: {
        //   hrmEmployeeId: profile.hrmEmployeeId,
        // }
      })
    })
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
    const newData = {
      ...e.data,
      date: e.date,
    }

    setEmployee(newData)
    setModal(true)
  }

  return (
    <Container>
      <BackHeader
        title="Lịch sử thất bại"
        navigation={navigation}
        rightHeader={
          <>
            {/* <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff', marginHorizontal: 10 }} /> */}
          </>
        }
      />
      {/* <View style={styles.content}> */}
      <Container style={{ padding: 10 }}>
        <ListPage
          query={query}
          api={api}
          itemComponent={({ item }) => {
            const { data } = item
            return <TouchableOpacity style={{ backgroundColor: theme.brandDanger, padding: 10, color: '#fff', border: 20, borderRadius: 10, marginBottom: 10 }} onPress={() => onPress(item)}>
              {/* <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>{data.type === 'IN' ? 'Chấm công vào' : 'Chấm công ra'}</Text> */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff' }}>Loại chấm công:</Text>
                <Text style={{ color: '#fff' }}>{data.type === 'IN' ? 'Chấm công vào' : 'Chấm công ra'}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff' }}>Thời gian:</Text>
                <Text style={{ color: '#fff' }}>{moment(data.date).format(DATE_FORMAT.DATE_TIME)}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#fff' }}>Lý do:</Text>
                <Text style={{ color: '#fff' }}>{data.message}</Text>
              </View>
            </TouchableOpacity>
          }}
        />
      </Container>
      {/* <FlatList
          data={timeKeepingHistoryData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <HistoryList item={item} onPress={onPress} />}
        /> */}
      {/* </View> */}

      <DateRangePicker
        initialRange={[startDate.toDate(), endDate.toDate()]}
        handleCancel={() => setShowDatePicker(false)}
        onSetDateRange={handleSetDateRange}
        showDatePicker={showDatePicker}
      />

      <ProfileModal
        onPress={() => setModal(false)}
        employee={employee}
        isVisible={modal}
      />
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

export default compose(withConnect, memo)(FailureTimeKeepingHistoryPage);

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
