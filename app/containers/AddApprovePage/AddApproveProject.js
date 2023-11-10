import React, { memo } from 'react';
import { compose } from 'redux';
import { API_TASK_PROJECT } from '../../configs/Paths';
import { MODULE } from '../../utils/constants';
import ApproveTemplate from './components/ApproveTemplate';

export function AddApproveProject(props) {

  const { navigation, route } = props;

  return <ApproveTemplate
    route={route}
    navigation={navigation}
    title="Tạo phê duyệt"
    code={MODULE.TASK}
    api={API_TASK_PROJECT}
    label="Công việc/Dự án"
  />
}


export default compose(memo)(AddApproveProject);
