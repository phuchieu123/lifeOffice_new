import React from 'react';
import { API_CONTRACT } from '../../configs/Paths';
import { MODULE } from '../../utils/constants';
import ApproveTemplate from './components/ApproveTemplate';

export function AddApprovePrice(props) {
  const { navigation, route } = props;

  return <ApproveTemplate
    route={route}
    navigation={navigation}
    title="Hợp đồng"
    code={MODULE.CONTRACT}
    api={API_CONTRACT}
    label="Tên hợp đồng"
  />
}
export default AddApprovePrice
