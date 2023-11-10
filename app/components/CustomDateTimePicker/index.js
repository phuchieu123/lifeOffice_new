import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Platform } from 'react-native';

const CustomDateTimePicker = (props) => {
  const { date, isVisible, onConfirm, onCancel, mode = 'date', disabled } = props;
  if (Platform.OS === 'android') {
    return (
      <DateTimePickerModal
        date={date}
        mode={mode}
        isVisible={isVisible}
        onConfirm={onConfirm}
        onCancel={onCancel}
        cancelTextIOS="Hủy"
        confirmTextIOS="Chọn"
        disabled={disabled}
      />
    );
  } else {
    return (
      <DateTimePickerModal
        date={date}
        mode={mode}
        isVisible={isVisible}
        onConfirm={onConfirm}
        onCancel={onCancel}
        cancelTextIOS="Hủy"
        display="inline"
        confirmTextIOS="Chọn"
        disabled={disabled}
      />
    );
  }
};

export default CustomDateTimePicker;
