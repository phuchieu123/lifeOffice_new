import { Button, Icon, ListItem, Text, View } from 'native-base';
import React, { memo, useEffect, useState } from 'react';
import { CalendarList } from 'react-native-calendars';
// import Modal from 'react-native-modal';
import moment from 'moment';
import { Dimensions, Modal, Platform } from 'react-native';
import theme from '../../utils/customTheme';
// import ToastCustom from '../ToastCustom';
import { FixToast, ToastCustom } from '../ToastCustom/FixToast';

const XDate = require('xdate');
const DATE = 'DD/MM/YYYY';
const DATE_FORMAT = 'yyyy-MM-dd';
const DATE_FORMAT_2 = 'YYYY-MM-DD';

const screenWitdh = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export function DateRangePicker(props) {
  const [isFromDatePicked, setIsFromDatePicked] = useState(false);
  const [isToDatePicked, setIsToDatePicked] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [fromDate, setFromDate] = useState({});
  const [toDate, setToDate] = useState({});

  const { initialRange, onSetDateRange, handleCancel, showDatePicker } = props;

  useEffect(() => {
    setupInitialRange();
  }, []);

  const onDayPress = (day) => {
    if (isFromDatePicked && isToDatePicked) {
      setIsFromDatePicked(false);
      setIsToDatePicked(false);
      setFromDate(null);
      setToDate(null);
      setMarkedDates({});
    }
    else if (!isFromDatePicked) {
      setupStartMarker(day);
    } else if (!isToDatePicked) {
      let markedDates = { ...markedDates };

      let from, to
      if (moment(day.dateString, DATE_FORMAT_2).isBefore(moment(fromDate, DATE_FORMAT_2))) {
        from = day.dateString
        to = fromDate
      }
      else {
        from = fromDate
        to = day.dateString
      }

      let [mMarkedDates, range] = setupMarkedDates(from, to, markedDates);
      setMarkedDates(mMarkedDates);
      setFromDate(from)
      setToDate(to);
    }
  };

  const setupStartMarker = (day) => {
    const markedDates = {
      [day.dateString]: {
        ...styles.markColor,
        startingDay: true,
      },
    };
    setIsFromDatePicked(true);
    setIsToDatePicked(false);
    setFromDate(day.dateString);
    setToDate(null);
    setMarkedDates(markedDates);
  };

  const setupMarkedDates = (fromDate, toDate, markedDates) => {
    let mFromDate = new XDate(fromDate);

    let mToDate = new XDate(toDate);
    let range = mFromDate.diffDays(mToDate);

    if (range >= 0) {
      if (range === 0) {
        markedDates = { [toDate]: { ...styles.markColor } };
      } else {
        markedDates[mFromDate.toString(DATE_FORMAT)] = {
          ...styles.markColor,
          startingDay: true,
        };
        for (let i = 1; i <= range; i++) {
          let tempDate = mFromDate.addDays(1).toString(DATE_FORMAT);
          if (i < range) {
            markedDates[tempDate] = { ...styles.markColor };
          } else {
            markedDates[tempDate] = {
              ...styles.markColor,
              endingDay: true,
            };
          }
        }
      }
    }

    setIsFromDatePicked(true);
    setIsToDatePicked(true);
    return [markedDates, range];
  };

  const setupInitialRange = () => {
    if (!initialRange) {
      return;
    }
    let [fromDate, toDate] = initialRange;
    let markedDates = {};
    fromDate && setFromDate(fromDate);
    toDate && setToDate(toDate);
    fromDate && toDate && setMarkedDates(setupMarkedDates(fromDate, toDate, markedDates)[0]);
  };

  const handleSetDateRange = () => {
    if (fromDate && toDate) {
      onSetDateRange(fromDate, toDate);
    } else {
      ToastCustom({ text: 'Mời chọn ngày bắt đầu và kết thúc', type: 'danger' });
    }
  };

  const handleResetDateRange = () => {
    setupInitialRange();
    handleCancel();
  };

  return (
    <Modal visible={showDatePicker} style={styles.modal}>
      <FixToast ref={c => { if (c) FixToast.toastInstance = c; }} />

      <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 20 : 0 }}>
        <ListItem itemHeader itemDivider style={styles.header}>
          <Text>
            {`${moment(fromDate, DATE_FORMAT_2).isValid() ? moment(fromDate, DATE_FORMAT_2).format(DATE) : ''} - ${moment(toDate, DATE_FORMAT_2).isValid() ? moment(toDate, DATE_FORMAT_2).format(DATE) : ''}`}
          </Text>
        </ListItem>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <CalendarList
              {...props}
              markingType={'period'}
              current={fromDate}
              markedDates={markedDates}
              onDayPress={onDayPress}
              theme={styles.calender}
            />
          </View>
          <View style={{ flexDirection: 'row', backgroundColor: '#fff', marginTop: 10 }}>
            <Button block onPress={handleSetDateRange} full style={{ flex: 1, borderRadius: 10, marginRight: 5, marginLeft: 5, marginBottom: 20 }}>
              <Icon name="check" type="Feather" />
            </Button>
            <Button block onPress={handleResetDateRange} full style={{ flex: 1, borderRadius: 10, marginRight: 5, marginBottom: 20 }} warning>
              <Icon name="close" type="AntDesign" />
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default memo(DateRangePicker);

const styles = {
  btnCancel: { flex: 1 },
  btnSc: { flex: 1 },
  centeredView: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingTop: 50,
    // paddingBottom: 20,
  },
  header: {
    justifyContent: 'center',
  },
  modal: {
    // height: '100%',
    // width: '100%',
  },
  modalView: {
    // flex: 1,
    // margin: 20,
    backgroundColor: 'white',
    // borderRadius: 15,
    // paddingTop: 20,
    // paddingLeft: 25,
    // paddingRight: 25,
    shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // elevation: 5,
    width: '100%',
    height: '86.5%',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  markColor: {
    color: theme.dateRangePickerColor,
    textColor: theme.dateRangePickerTextColor,
  },
  calender: {
    'stylesheet.day.period': {
      base: {
        overflow: 'hidden',
        height: 34,
        alignItems: 'center',
        width: 38,
      },
    },
    arrowColor: theme.dateRangePickerArrowColor,
  },
};
