import React from 'react';
import { API_SALES_QUOTATION } from '../../configs/Paths';
import { MODULE } from '../../utils/constants';
import ApproveTemplate from './components/ApproveTemplate';

export function AddApprovePrice(props) {
  const { navigation, route } = props;

  return <ApproveTemplate
    route={route}
    navigation={navigation}
    title="Báo giá"
    code={MODULE.SALES_QUOTATION}
    api={API_SALES_QUOTATION}
    label="Tên báo giá"
  />
}
export default AddApprovePrice
