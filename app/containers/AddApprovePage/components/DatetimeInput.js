/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * AddApproveSalaryAdvance
 *
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Text, Item, Label, View } from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native';

export default DatetimeInput = (props) => {
  const { onValueChange } = props;

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  useEffect(() => {
    onValueChange(date);
  }, [date]);

  const onChange = (event, selectedValue) => {
    setShow(Platform.OS === 'ios');
    if (mode == 'date') {
      const currentDate = selectedValue || new Date();
      setDate(currentDate);
    }
  };

  const formatDate = () => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Text>{formatDate()}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date}
          // minimumDate={Date.parse(new Date())}
          display="default"
          mode={mode}
          onChange={onChange}
        />
      )}
    </View>
  );
};
