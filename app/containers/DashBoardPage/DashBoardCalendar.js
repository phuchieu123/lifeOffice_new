import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { handleSearch, serialize } from '../../utils/common';
import { API_TASK } from '../../configs/Paths';
import theme from 'utils/customTheme';
import _ from 'lodash';

const DATE_FORMAT = 'YYYY-MM-DD';
const MONTH = 'YYYY-MM';
const DAY = 'DD';

const SHOW_KANBAN = [1, 2, 5];

export default DashBoardCalendar = (props) => {
  const { kanbanTaskConfigs } = props;
  const [markedDates, setMarkedDates] = useState({});

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

  const arrToMultiPeriod = (arr, time) => {
    if (!Array.isArray(arr)) return;

    let data = [...arr]
    const kanbanData = kanbanTaskConfigs.filter(e => SHOW_KANBAN.includes(e.code))
    data = data.filter(e => kanbanData.find(kanban => `${kanban.code}` === e.kanbanStatus))

    data = data.map((e) => {
      const startDate = moment(e.startDate);
      const endDate = moment(e.endDate);

      return {
        startDay: Number(startDate.format(DAY)),
        endDay: Number(endDate.format(DAY)),
        kanban: kanbanData.find((kanban) => kanban.code.toString() === e.kanbanStatus),
      };
    });

    const marked = {}
    const date = getAllDaysByMonth(time);
    date.forEach(day => {
      marked[day] = {
        dots: kanbanData.map(({ code, type, color }) => {
          const dd = Number(day.slice(-2))
          const found = data.find(item => item.kanban && code === item.kanban.code && dd >= item.startDay && dd <= item.endDay)
          return found ? ({ key: type, color }) : null
        }).filter(item => item)
      }
    })

    setMarkedDates((e) => ({ ...e, ...marked }));
  };

  const getData = async (time) => {
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
      markingType='multi-dot'
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
