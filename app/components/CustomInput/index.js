/**
 *
 * CommentInput
 *
 */

import { Item, Label } from 'native-base';
import React, { memo } from 'react';
// import styled from 'styled-components';

function CustomInput(props) {
  const { label, children, error } = props;

  return (
    <Item inlineLabel error={error}>
      <Label>{label}</Label>
      {children}
    </Item>
  );
}

export default memo(CustomInput);
