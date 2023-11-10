import React, { memo, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import moment from 'moment';
import {
  Body,
  Container,
  ListItem,
  Right,
  Text,
  View
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import { confirmSalary } from '../../api/timekeeping';
import BackHeader from '../../components/Header/BackHeader';
import LoadingButton from '../../components/LoadingButton';
import ToastCustom from "../../components/ToastCustom";
import { API_ATTRIBUTE_LISTATTRIBUTE } from '../../configs/Paths';
import { getProfile } from '../../utils/authen';
import { handleSearch } from '../../utils/common';
import makeSelectGlobal from '../App/selectors';
import { getTimeKeepingBoard, getTimeKeepingPaycheck } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectTimeKeepingBoardPage from './selectors';

const TimeKeepingBoardPage = (props) => {
  useInjectReducer({ key: 'timeKeepingPage', reducer });
  useInjectSaga({ key: 'timeKeepingPage', saga });

  const { navigation, timeKeepingPage, getTimeKeepingBoard, route, getTimeKeepinPaycheck } = props;
  const { params } = route;
  const { timeKeepingData } = params
  const { payCheck } = timeKeepingPage

  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [query, setQuery] = useState({});

  const [localState, setLocaState] = useState([]);
  const [formulaAttribute, setFormulaAttribute] = useState()
  const [title, setTitle] = useState();
  const [profile, setProfile] = useState();
  const [confirmed, setConfirmed] = useState();

  useEffect(() => {
    getListAttribute()
    // updateQuery(query);
  }, []);

  // useEffect(() => {
  //   getTimeKeepingBoard(query);
  // }, [query]);

  useEffect(() => {
    if (params) {
      // const { timeKeepingData } = params
      getProfile().then(profile => {
        const { hrmEmployeeId } = profile
        setProfile(profile)
        const { month, year } = timeKeepingData
        setTitle(`Chi tiết chấm công tháng ${month} - ${year}`)
        getTimeKeepinPaycheck({ hrmEmployeeId, month, year })
      })
      // hrmEmployeeId=60f52a52b9ea06552a1f0bac&month=7&year=2021
    }
  }, [params]);

  useEffect(() => {
    if (Array.isArray(formulaAttribute)) {
      if (Array.isArray(payCheck) && payCheck.length) {
        const { dataSource, confirmed } = payCheck[0]
        let newData = formulaAttribute.map(({ code, name }) => {
          return { code, name, value: dataSource[code] }
        })
        newData = newData.filter(e => e.value !== undefined)
        setLocaState(newData)
        setConfirmed(confirmed)
      }
    }
  }, [payCheck, formulaAttribute]);

  // const updateQuery = () => {
  //   const newQuery = {
  //     ...query,
  //     filter: {
  //       createdAt: {
  //         $gte: `${startDate.format()}`,
  //         $lte: `${endDate.endOf('day').format()}`,
  //       },
  //     },
  //   };
  //   setQuery(newQuery);
  // };

  // const handleSetDateRange = (start, end) => {
  //   setShowDatePicker(false);
  //   setStartDate(moment(start));
  //   setEndDate(moment(end));
  //   updateQuery();
  // };

  const getListAttribute = async () => {
    const url = `${await API_ATTRIBUTE_LISTATTRIBUTE()}`;
    handleSearch(url, setFormulaAttribute)
  }

  const onConfirm = async () => {
    try {
      const body = {
        month: timeKeepingData.month,
        year: timeKeepingData.year,
        hrmEmployeeId: profile.hrmEmployeeId,
        confirmed: true
      }
      const res = await confirmSalary(body)

      if (res.status === 1) {
        ToastCustom({ text: res.message, type: 'success' });
        navigation.goBack()
        // DeviceEventEmitter.emit("updateTimeKeepingTable")
      } else {
        ToastCustom({ text: res.message, type: 'danger' });
      }

    } catch (err) {
      ToastCustom({ text: err, type: 'danger' });
      console.log('err', err)
    }
  }

  return (
    <Container>
      <BackHeader
        title={title}
        navigation={navigation}
      // rightHeader={
      //   <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff' }} />
      // }
      />
      {localState.length !== 0 ? <FlatList
        data={localState}
        keyExtractor={item => item.code}
        renderItem={({ item }) => {
          return <ListItem>
            <Body>
              <Text >{item.name}</Text>
            </Body>
            <Right >
              <Text>{item.value}</Text>
            </Right>
          </ListItem>
        }}
      /> : <Text style={{ textAlign: 'center', marginTop: 10 }} >Không có dữ liệu</Text>}

      {localState.length !== 0 ? <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        {confirmed ? <LoadingButton style={{ flex: 1, borderRadius: 10, marginLeft: 5}} handlePress={() => navigation.goBack()}>
          <Body style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, alignSelf: 'center', color: '#fff',}}>
              Đã xác nhận
            </Text>
          </Body>
        </LoadingButton> : <LoadingButton style={{ flex: 1, borderRadius: 10, marginLeft: 5}} handlePress={() => onConfirm()}>
          <Body style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, alignSelf: 'center', color: '#fff',}}>
              Xác nhận bảng công
            </Text>
          </Body>
        </LoadingButton>}
      </View> : null}
      {/* <ListItem>
            <Body>
              <Text style={styles.label}>Ngày công thực tế</Text>
            </Body>
            <Right style={styles.right}>
              <Text style={styles.textRight}>1 Ngày</Text>
              <Icon style={styles.icon} name="chevron-right" type="Entypo" />
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text style={styles.label}>Giờ công thực tế</Text>
            </Body>
            <Right style={styles.right}>
              <Text style={styles.textRight}>1 Ngày</Text>
              <Icon style={styles.icon} name="chevron-right" type="Entypo" />
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text style={styles.label}>Số làm dư giờ</Text>
            </Body>
            <Right style={styles.right}>
              <Text style={styles.textRight}>0 giờ 0 phút</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text style={styles.label}>Số giờ làm thêm</Text>
            </Body>
            <Right style={styles.right}>
              <Text style={styles.textRight}>0 giờ 0 phút</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text style={styles.label}>Giờ công tiêu chuẩn</Text>
            </Body>
            <Right style={styles.right}>
              <Text style={styles.textRight}>202 giờ</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text style={styles.label}>Giờ công làm tăng ca</Text>
            </Body>
            <Right style={styles.right}>
              <Text style={styles.textRight}>0 ngày</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text style={styles.label}>Số ngày nghỉ tiêu chuẩn</Text>
            </Body>
            <Right style={styles.right}>
              <Text style={styles.textRight}>0 ngày</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text style={styles.label}>Số ngày nghỉ tiêu chuẩn (thử việc)</Text>
            </Body>
            <Right style={styles.right}>
              <Text style={styles.textRight}>0 ngày</Text>
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text style={styles.label}>Số ngày nghỉ không lương (chính thức)</Text>
            </Body>
            <Right style={styles.right}>
              <Text style={styles.textRight}>0 ngày</Text>
            </Right>
          </ListItem> */}

      {/* <DateRangePicker
        initialRange={[startDate.toDate(), endDate.toDate()]}
        handleCancel={() => setShowDatePicker(false)}
        onSetDateRange={handleSetDateRange}
        showDatePicker={showDatePicker}
      /> */}
    </Container>
  );
};


const mapStateToProps = createStructuredSelector({
  timeKeepingPage: makeSelectTimeKeepingBoardPage(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    getTimeKeepingBoard: (query) => dispatch(getTimeKeepingBoard(query)),
    getTimeKeepinPaycheck: (query) => dispatch(getTimeKeepingPaycheck(query)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TimeKeepingBoardPage);

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
  },
  right: {
    justifyContent: 'flex-end',
    flex: 0.3,
    flexDirection: 'row',
  },
  textRight: {
    fontSize: 14,
  },
  detail: {
    alignSelf: 'flex-start',
    color: '#fff',
  },
});
