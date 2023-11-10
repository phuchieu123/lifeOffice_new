import { useState } from 'react';

export const useInput = (initialValue, checkValid) => {
  const [value, setValue] = useState(initialValue);
  const [valid, setValid] = useState(true);
  return {
    value,
    setValue: input => setValue(input),
    valid,
    setValid,
    reset: () => setValue(''),
    bind: {
      value,
      onChangeText: text => {
        if (checkValid) {
          setValid(checkValid(value));
        } else {
          if (text == null || text === '') {
            setValid(false);
          } else {
            setValid(true);
          }
        }
        setValue(text);
      },
    },
  };
};
