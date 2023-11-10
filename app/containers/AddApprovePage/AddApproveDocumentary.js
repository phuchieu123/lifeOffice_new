import React from 'react';
import { API_DOCUMENTARY } from '../../configs/Paths';
import { MODULE } from '../../utils/constants';
import ApproveTemplate from './components/ApproveTemplate';

export function AddApprovePrice(props) {
  const { navigation, route } = props;

  return <ApproveTemplate
    route={route}
    navigation={navigation}
    title="Công văn"
    code={MODULE.DOCUMENTARY}
    api={API_DOCUMENTARY}
    label="Công văn"
  />
}
export default AddApprovePrice
