/**
 *
 * LoadingButton
 *
 */

import React from 'react';
// import styled from 'styled-components';

import { Button, Spinner } from 'native-base';

function LoadingButton(props) {
  const { handlePress, onPress, isBusy, children } = props;
  return (
    <Button {...props} onPress={handlePress || onPress} disabled={isBusy} style={{ justifyContent: 'center', marginHorizontal: 5, marginBottom: 4, borderRadius: 10, ...(props.style || {}) }}>
      {isBusy && <Spinner color="#aaa" />}
      {!isBusy && children}

    </Button>

  );

}

export default LoadingButton;
