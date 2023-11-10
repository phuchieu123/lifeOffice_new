import React, { memo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { navigate } from '../../RootNavigation';

import moment from 'moment';
import {
  Container,
  Icon
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import BackHeader from '../../components/Header/BackHeader';
import { makeSelectProfile } from '../App/selectors';
import { getTimeKeepingDayoffs } from './actions';
import TakeLeaveDay from './components/TakeLeaveDay';
import reducer from './reducer';
import saga from './saga';
import makeSelectDaysOffBoardPage from './selectors';

const DaysOffBoardPage = (props) => {
  useInjectReducer({ key: 'timeKeepingPage', reducer });
  useInjectSaga({ key: 'timeKeepingPage', saga });

  const { navigation, timeKeepingPage, profile } = props;
  const { timeKeepingDayoffsData } = timeKeepingPage;
  const { tableHead, tableTitle, tableData } = timeKeepingDayoffsData;

  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [query, setQuery] = useState({});

  const handleNavigate = (page) => {
    navigation.navigate(page);
  };

  // useEffect(() => {
  //   getTimeKeepingDayoffs(query);
  // }, [query]);

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
        title="Thông tin ngày nghỉ"
        navigation={navigation}
      // rightHeader={
      //   <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff' }} />
      // }
      />
      {/* <TakeLeaveYear hrmEmployeeId={profile.hrmEmployeeId} /> */}
      <TakeLeaveDay profile={profile} navigation={navigation} />

      {/* {timeKeepingDayoffsData && (
          <Table borderStyle={{ borderWidth: 1 }}>
            <Row data={tableHead} flexArr={[2, 1, 1, 1]} style={styles.head} textStyle={styles.text} />
            <TableWrapper style={styles.wrapper}>
              <Col data={tableTitle} style={styles.title} heightArr={[50, 50]} textStyle={styles.text} />
              <Rows data={tableData} flexArr={[1, 1, 1]} style={styles.row} textStyle={styles.text} />
            </TableWrapper>
          </Table>
        )} */}

      {/* <DateRangePicker
        initialRange={[startDate.toDate(), endDate.toDate()]}
        handleCancel={() => setShowDatePicker(false)}
        onSetDateRange={handleSetDateRange}
        showDatePicker={showDatePicker}
      /> */}
      <FabLayout>
        <Icon type="Entypo" name="plus" style={{ color: '#fff' }} onPress={() => navigate('NewDaysOffBoardPage')} />
      </FabLayout>
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  timeKeepingPage: makeSelectDaysOffBoardPage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    getTimeKeepingDayoffs: (query) => dispatch(getTimeKeepingDayoffs(query)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(DaysOffBoardPage);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  wrapper: {
    flexDirection: 'row',
  },
  title: {
    height: 50,
    flex: 2,
    backgroundColor: '#f6f8fa',
  },
  row: {
    height: 50,
  },
  text: {
    textAlign: 'center',
  },
});
