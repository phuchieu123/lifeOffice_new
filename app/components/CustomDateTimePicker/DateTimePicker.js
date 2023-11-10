import React, { useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TouchableOpacity } from 'react-native';
import { Icon, Input, Text, View } from 'native-base';
import moment from 'moment'
import CustomDateTimePicker from './'
import { DATE_FORMAT } from '../../utils/constants';

const DateTimePicker = (props) => {
  const { onSave, mode = 'date', value, style = {}, textStyle = {}, disabled } = props;

  const [date, setDate] = useState()
  const [text, setText] = useState('')
  const [show, setShow] = useState()

  useEffect(() => {
    if (value) {
      switch (mode) {
        case 'time':
          {
            const newDate = new Date(moment(value, DATE_FORMAT.TIME).format(DATE_FORMAT.DATETIME_FORMAT))
            setDate(newDate)
            setText(value)
          }
          break;
        case 'date':
          {
            const newDate = new Date(moment(value, DATE_FORMAT.DATE).format(DATE_FORMAT.DATETIME_FORMAT))
            setDate(newDate)
            setText(value)
          }
          break;
        case 'datetime':
          {
            const newDate = new Date(moment(value, DATE_FORMAT.DATE_TIME).format(DATE_FORMAT.DATETIME_FORMAT))
            setDate(newDate)
            setText(value)
          }
          break;
      }
    } else setText('Lựa chọn')
  }, [value])

  const onShow = () => {
    !disabled && setShow(true)
  }

  const onConfirm = (date) => {
    setShow(false);
    onSave(date);
  }

  const onCancel = () => {
    setShow(false);
  }

  return <>
    <TouchableOpacity onPress={onShow} style={{ ...styles.view, ...style }} >
      <Text style={{ ...styles.text, ...textStyle }} disabled={true}>
        <Text style={{ color: date ? 'black' : 'gray' }}>{text}{`  `}</Text>
        <Icon name="calendar" type="FontAwesome" style={{ fontSize: 15 }} />
      </Text>
    </TouchableOpacity>

    {show && <CustomDateTimePicker
      date={date}
      mode={mode}
      isVisible={show}
      onConfirm={onConfirm}
      onCancel={onCancel}
      disabled={disabled}
    />}
  </>
};

export default DateTimePicker;

const styles = {
  view: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    textAlign: 'right',
    marginRight: 8,
  },
  text: {
    alignSelf: 'flex-end',
  }
}
