import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { handleSearch, serialize } from '../../utils/common';
import { API_TASK } from '../../configs/Paths';
import theme from 'utils/customTheme';
import _ from 'lodash';

const DATE_FORMAT = 'YYYY-MM-DD';
const MONTH = 'YYYY-MM';

export default DashBoardCalendar = (props) => {
  const { kanbanTaskConfigs } = props;
  const [markedDates, setMarkedDates] = useState({});
  const gotData = useRef([]);

  useEffect(() => {
    getData(moment().startOf('month'));
  }, []);

  const getAllDaysByMonth = (time) => {
    const currentMonth = `${time.format(MONTH)}`;
    const days = time.daysInMonth();
    let day = 0;
    let date = [];
    while (day++ < days) {
      let currentDay = day.toString();
      currentDay = currentDay.length > 1 ? currentDay : `0${currentDay}`;
      date.push(`${currentMonth}-${currentDay}`);
    }
    return date;
  };

  const getCurrentIndex = (i, exist) => (exist.includes(i) ? getCurrentIndex(i + 1, exist) : i);

  const sortPeriods = (periods, total) => {
    let index = 0;
    const sort = [];
    while (index++ <= total) {
      sort.push(periods.find((e) => e.index === index) || { color: 'transparent' });
    }
    return sort;
  };

  const getColor = (code) => {
    const found = kanbanTaskConfigs.find((e) => e.code.toString() === code);
    return found ? found.color : 'gray';
  };

  const arrToMultiPeriod = (arr, time) => {
    if (!Array.isArray(arr)) return;

    let index;
    let maxIndex;
    const startTime = time.clone().startOf('month');
    // const endTime = time.clone().endOf('month');
    let data = arr.map((e) => {
      const startDate = moment(e.startDate);
      const endDate = moment(e.endDate);
      return {
        _id: e._id,
        startDate,
        endDate,
        startDateFormat: startDate.format(DATE_FORMAT),
        endDateFormat: endDate.format(DATE_FORMAT),
        kanbanStatus: e.kanbanStatus,
      };
    });

    //add index to data has startDate before firstday of month
    index = 1;
    data = data.map((e) => (e.startDate.isBefore(startTime) ? { ...e, index: index++ } : { ...e }));

    const marked = {};
    const date = getAllDaysByMonth(time);
    date.forEach((day, i) => {
      index = 1;
      maxIndex = 0;
      const dataHasIndex = data.filter((e) => e.index);
      const usedIndex = dataHasIndex.map((e) => e.index);
      const remove = [];

      let periods = data
        .filter((e) => e.startDateFormat === day)
        .map((item) => {
          const endingDay = item.endDateFormat === day;
          index = getCurrentIndex(index, usedIndex);
          maxIndex = index;
          if (endingDay) remove.push(item._id);
          data = data.map((e) => (e._id === item._id ? { ...e, index } : { ...e }));
          return { startingDay: true, endingDay, color: getColor(item.kanbanStatus), index: index++ };
        })
        .concat(
          dataHasIndex.map((item) => {
            const endingDay = item.endDateFormat === day;
            if (endingDay) remove.push(item._id);
            maxIndex = maxIndex > item.index ? maxIndex : item.index;
            return { startingDay: false, endingDay, color: getColor(item.kanbanStatus), index: item.index };
          }),
        );

      if (maxIndex) periods = sortPeriods(periods, maxIndex);
      marked[day] = { periods };

      // loại bỏ dữ liệu không còn sử dụng
      data = data.filter((e) => !remove.find((_id) => _id === e._id));
    });

    setMarkedDates((e) => ({ ...e, ...marked }));
  };

  const getData = async (time) => {
    // if (gotData.current.find((e) => e.isSame(time))) return;
    // gotData.current.push(time);

    const startTime = time.clone().startOf('month').toISOString();
    const endTime = time.clone().endOf('month').toISOString();
    const query = {
      filter: {
        startDate: {
          $gte: startTime,
          $lte: endTime,
        },
      },
    };

    const url = `${await API_TASK()}?${serialize(query)}`;
    handleSearch(url, (arr) => arrToMultiPeriod(arr, time));
  };

  const onVisibleMonthsChange = (e) => {
    getData(moment(e[0].dateString, DATE_FORMAT).startOf('month'));
  };
  return (
    <Calendar
      hideExtraDays
      markingType="multi-period"
      markedDates={markedDates}
      onVisibleMonthsChange={onVisibleMonthsChange}
      style={styles.view}
      theme={styles.calender}
    />
  );
};

const styles = {
  view: {
    marginTop: 5,
    borderRadius: 15,
    paddingBottom: 5,
  },
  markColor: {
    color: theme.dateRangePickerColor,
    textColor: theme.dateRangePickerTextColor,
  },
  calender: {
    todayTextColor: '#000',
    arrowColor: theme.dateRangePickerArrowColor,
  },
};
