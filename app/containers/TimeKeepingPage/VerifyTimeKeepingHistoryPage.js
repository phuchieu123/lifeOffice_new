import React, { memo, useEffect, useState } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import moment from 'moment';
import {
  Button,
  Container,
  Icon,
  Text,
  View,
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import { verifyTimekeeping } from '../../api/timekeeping';
import BackHeader from '../../components/Header/BackHeader';
import ListPage from '../../components/ListPage';
import { API_TIMEKEEPING } from '../../configs/Paths';
import { makeSelectProfile } from '../App/selectors';
import ProfileModal from '../CameraTimeKeepingPage/ProfileModal';
import { getTimeKeepingHistory } from './actions';
import HistoryCardControl from './components/HistoryCardControl';
import reducer from './reducer';
import saga from './saga';
import makeSelectTimeKeepingPage from './selectors';

const TimeKeepingHistoryPage = (props) => {
  useInjectReducer({ key: 'timeKeepingPage', reducer });
  useInjectSaga({ key: 'timeKeepingPage', saga });

  const { navigation, profile } = props;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [item, setItem] = useState({});
  const [modal, setModal] = useState(false);
  const [query, setQuery] = useState({})
  // { hrmEmployeeId: profile.hrmEmployeeId }
  useEffect(() => {

  }, [])

  const onVerify = () => {
    const data = {
      hrmEmployeeId: item.hrmEmployeeId,
      tableId: item._id,
    }
    verifyTimekeeping(data)
  }

  return (
    <Container>
      <BackHeader
        title="Lịch sử chấm công"
        navigation={navigation}
        rightHeader={
          <>
            <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff', marginHorizontal: 10 }} />
          </>
        }
      />

      <ListPage
        api={API_TIMEKEEPING}
        // params={`/${profile._id}`}
        query={query}
        formatResponse={({ data }) => {
          return data.data.filter(e => e)
        }}
        itemComponent={({ item }) => {
          const { date, timekeepingData } = item
          return <>
            <Button transparent style={{ marginBottom: 5, height: 'auto', padding: 5, width: '100%', flexDirection: 'row', borderRadius: 5 }}>
              <View
                style={{
                  flex: 1,
                  borderRadius: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                }}
              >
                <Text style={{ fontSize: 18 }}>Tháng {moment(date).format('MM/YYYY')}</Text>
              </View>
              <Button
                style={{ margin: 5, height: 45, flexDirection: 'row', borderRadius: 5 }}
                onPress={() => onVerify(item)}
              >
                <Text>Xác nhận</Text>
              </Button>
            </Button >
            {timekeepingData.map(data => {
              return <HistoryCardControl item={data} tableId={item._id} />
            })}
          </>
        }}
      />

      <ProfileModal
        onPress={() => setModal(false)}
        employee={item}
        isVisible={modal}
      />
    </Container >
  );
};


const mapStateToProps = createStructuredSelector({
  timeKeepingPage: makeSelectTimeKeepingPage(),
  profile: makeSelectProfile(),
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
