/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * ApprovedTab
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Text } from 'native-base';
import { useInput } from '../../../utils/useInput';

export function ApprovedTab(props) {
  const { isLoading, projectDetail, onUpdateProject } = props;

  const [avatar, setAvatar] = useState('');
  const [isProject, setIsProject] = useState(true);
  const [parentId, setParentId] = useState(null);
  const [custommerOption, setCustommerOption] = useState([]);
  const [employeesOption, setEmployeesOption] = useState([]);
  const [approverOption, setApproversOption] = useState([]);

  const { value: name, setValue: setName, bind: bindName, valid: validName, setValid: setValidName } = useInput(
    '',
    c => c.length > 4,
  );
  const { value: description, setValue: setDescription, bind: bindDescription } = useInput('');
  const { value: startDate, setValue: setStartDate, valid: validStartDate, setValid: setValidStartDate } = useInput('');
  const { value: endDate, setValue: setEndDate, valid: validEndDate, setValid: setValidEndDate } = useInput('');
  const { value: taskStatus, setValue: setTaskStatus } = useInput('');
  const { value: priority, setValue: setPriority } = useInput([]);
  const { value: customer, setValue: setCustomer } = useInput([]);
  const { value: viewable, setValue: setViewable } = useInput([]);
  const { value: approved, setValue: setApproved } = useInput([]);
  const { value: join, setValue: setJoin } = useInput([]);
  const { value: support, setValue: setSupport } = useInput([]);
  const { value: inCharge, setValue: setInCharge } = useInput([]);


  useEffect(() => {
    setName(projectDetail.name);
    setDescription(projectDetail.description);
    setStartDate(new Date(projectDetail.startDate));
    setEndDate(projectDetail.endDate);
    setTaskStatus(projectDetail.taskStatus);
    setPriority(projectDetail.priority);
    setCustomer(projectDetail.customer ? [projectDetail.customer._id] : []);
    setJoin(projectDetail.join && projectDetail.join.map(c => c._id));
    setViewable(projectDetail.viewable && projectDetail.viewable.map(c => c._id));
    setApproved(projectDetail.approved && projectDetail.approved.map(c => c._id));
    setInCharge(projectDetail.inCharge && projectDetail.inCharge.map(c => c._id));
    setSupport(projectDetail.support && projectDetail.support.map(c => c._id));
  }, []);

  useEffect(() => {}, []);

  return <Text>123</Text>;
}

export default memo(ApprovedTab);
