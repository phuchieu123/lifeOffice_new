import React, { useState } from 'react';
import moment from 'moment';
import DateRangePicker from 'components/DateRangePicker';

const DateRangeModal = (props) => {
  const { open, onChange, onClose, startDate, endDate } = props;

  const onSetDateRange = (start, end) => {
    onClose();
    onChange(start, end);
  };

  return (
    <>
      {startDate && endDate && open && (
        <DateRangePicker
          initialRange={[startDate, endDate]}
          handleCancel={onClose}
          onSetDateRange={onSetDateRange}
          showDatePicker={open ? true : false}
        />
      )}
    </>
  );
};

export default DateRangeModal;
