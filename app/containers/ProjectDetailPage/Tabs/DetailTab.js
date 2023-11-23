import React, { useState, useEffect, memo } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  Content,
  Icon,
  Card,
  CardItem,
  Form,
  Item,
  Input,
  Label,
} from 'native-base';
import { taskStatusData, priorityData, MODULE } from '../../../utils/constants';
import { checkedRequireForm, convertLabel } from '../../../utils/common';
import { API_CUSTOMER, API_USERS } from '../../../configs/Paths';
import CustomMultiSelect from '../../../components/CustomMultiSelect';
import MultiAPISearch from '../../../components/CustomMultiSelect/MultiAPISearch';
import SingleAPISearch from '../../../components/CustomMultiSelect/SingleAPISearch';
import moment from 'moment';
import LoadingLayout from '../../../components/LoadingLayout';
import LoadingButton from '../../../components/LoadingButton';
import CommentView from '../../CommentView';
import ToastCustom from '../../../components/ToastCustom';
import _, { join } from 'lodash';
import ImageInput from '../../../components/CustomInput/ImageInput';
import CustomDateTimePicker from '../../../components/CustomDateTimePicker/DateTimePicker';
import { makeSelectUserRole, makeSelectViewConfig } from '../../App/selectors';

import CollapseView from '../../../components/CustomView/CollapseView';
import { API_APPROVE_GROUP, CLIENT_ID } from '../../../configs/Paths';
import { update } from '../../../api/tasks';
import RenderHTML from "react-native-render-html";
import { DeviceEventEmitter, Dimensions, ScrollView, useWindowDimensions,Text } from 'react-native';
import WebView from 'react-native-webview';
const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

export function DetailTab(props) {
  const { isLoading, projectDetail, taskConfig, navigation, id, taskRole } = props;

  const [avatar, setAvatar] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [renderHtml, setRenderHtml] = useState()
  const [data, setData] = useState({})
  const [error, setError] = useState({});
  const [options, setOptions] = useState({});
  const [client, setClient] = useState();
  const { width } = useWindowDimensions();

  useEffect(() => {
    getClientId()
  }, [])

  async function getClientId() {
    const clientId = await CLIENT_ID();
    setClient(clientId)
  }

  useEffect(() => {
    if (data) {
      setRenderHtml(data.desHtml)
    }
  }, [data])
  useEffect(() => {
    if (projectDetail) {
      const { customer, taskManager, viewable, join, inCharge, support, approved, approvedProgress } = projectDetail
      const newData = {
        ...projectDetail,
        priority: projectDetail.priority || 3,
        customer: _.get(customer, '_id'),
        taskManager: Array.isArray(taskManager) ? taskManager.map(e => e._id) : [],
        viewable: Array.isArray(viewable) ? viewable.map(e => e._id) : [],
        join: Array.isArray(join) ? join.map(e => e._id) : [],
        inCharge: Array.isArray(inCharge) ? inCharge.map(e => e._id) : [],
        support: Array.isArray(support) ? support.map(e => e._id) : [],
        approved: Array.isArray(approved) ? approved.map(e => e._id) : [],
        approvedProgress,
      }

      const newOption = {
        customer: customer && [customer],
        taskManager,
        viewable,
        join,
        inCharge,
        support,
        approved,
        approvedProgress: approvedProgress && [approvedProgress]
      }
      setData(newData)
      setOptions(newOption)
    }
  }, [projectDetail]);
  const handleSubmit = async () => {
    setIsBusy(true)
    try {
      if (checkValid()) {
        const { _id, name, customer, startDate, endDate, inCharge, priority, viewable, description, code, approved, join, desHtml } = data

        let task = {
          _id,
          name: name.trim(),
          description: description && description.trim(),
          startDate,
          endDate,
          customer,
          viewable,
          inCharge,
          priority,
          code,
          category: 1,
          exchangingAgreement: null,
          file: [],
          idContract: null,
          kanbanStatus: 1,
          locationAddress: '',
          parentId: id ? id : '',
          planApproval: 0,
          planerStatus: 1,
          progress: 0,
          updatedBy: null,
          acceptApproval: 0,
          approved: approved ? approved : [],
          businessOpportunities: null,
          category: 1,
          isObligatory: false,
          isProject: false,
          join,
          mettingSchedule: null,
          viewableStr: "importa2",
          desHtml
          // taskStatus,
          // approvedProgress: [],
        };

        // if (Array.isArray(task.support)) task.support = task.support.map((e) => e._id);
        // if (Array.isArray(task.inCharge)) task.inCharge = task.inCharge.map((e) => e._id);
        // if (Array.isArray(task.join)) task.join = task.join.map((e) => e._id);
        // if (Array.isArray(task.taskManager)) task.taskManager = task.taskManager.map((e) => e._id);
        // if (task.template && task.template._id) task.template = task.template._id;

        // delete task.name_en;
        const res = await update(_id, task, avatar);
        if (res.success) {
          // navigation.goBack()
          navigation.goBack()
          ToastCustom({ text: 'Cập nhật thành công', type: 'success' })
          DeviceEventEmitter.emit('addProjectSuccess', { project: res.data })

        }
        else ToastCustom({ text: 'Cập nhật thất bại', type: 'danger' })
      }
    } catch (error) {
      ToastCustom({ text: 'Cập nhật thất bại', type: 'danger' })

    }
    setIsBusy(false)
  };

  const handleChange = (key, value) => {
    let newData = {}
    _.set(newData, key, value)
    setData({ ...data, ...newData });
    if (error[key]) {
      const newErr = { ...error }
      delete newErr[key]
      if (key === 'startDate' || key === 'endDate') {
        delete newErr.startDate
        delete newErr.endDate
      }
      setError(newErr)
    }
  };

  const checkValid = () => {
    let updateList = 'name, customer, startDate, endDate, viewable, inCharge, priority, viewable, description'
      .replace(/ /g, '').split(',').reduce((a, v) => ({ ...a, [v]: v }), {})

    const { isValid, errorList, firstMessage } = checkedRequireForm(taskConfig, data, updateList)

    let valid = isValid
    let msg = firstMessage
    let err = errorList

    const isValidName = data.name && data.name.trim().length >= 5;
    if (!isValidName) {
      valid = valid && isValidName;
      msg = `${taskConfig.name.title} phải có tối thiểu 5 kí tự`
      err.name = true
    }

    if (!err.startDate && !err.endDate) {
      const isValidDate = moment(data.startDate).isBefore(data.endDate)
      valid = valid && isValidDate;
      if (!isValidDate) {
        msg = msg || 'Ngày kết thúc phải sau ngày bắt đầu'
        err.startDate = true
        err.endDate = true
      }
    }

    if (!valid && msg) ToastCustom({ text: msg, type: 'danger' })
    setError(err)
    return valid;
  };
  return (
    <LoadingLayout isLoading={isLoading}>
      <Text>ssssssss</Text>
    </LoadingLayout>
  );
}

const mapStateToProps = createStructuredSelector({
  taskRole: makeSelectUserRole(MODULE.TASK),
  taskConfig: makeSelectViewConfig(MODULE.TASK)
});


function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(DetailTab);
