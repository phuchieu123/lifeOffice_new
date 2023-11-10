import React, { memo } from 'react';
import { compose } from 'redux';
import DaysOffBoardApproveTemplate from '../../AddApprovePage/components/DaysOffBoardApproveTemplate';

export function AddApproveDaysOffBoardPage(props) {

  const { navigation, route } = props;
  const { params } = route;

  return <DaysOffBoardApproveTemplate
    route={route}
    navigation={navigation}
    title="Tạo phê duyệt"
    code={params.code}
    api={params.api}
    label="Nhân viên"
  />
}


export default compose(memo)(AddApproveDaysOffBoardPage);
