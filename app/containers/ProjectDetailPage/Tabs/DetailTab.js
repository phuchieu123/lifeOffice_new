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
import { DeviceEventEmitter, Dimensions, ScrollView, useWindowDimensions } from 'react-native';
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
      <Content>
        <Card transparent>
          <CardItem bordered style={{ backgroundColor: '#f2f2f2', flex: 1 }} cardBody>
            <Form style={{ flex: 1, backgroundColor: 'white' }}>
              <ImageInput source={avatar || (projectDetail.avatar ? { uri: projectDetail.avatar } : null)} onSave={setAvatar} />

              <CollapseView >
                {/* <Item>
                  <Label >{'Mã công việc'}</Label>
                  <Input onChangeText={e => handleChange('code', e)} value={data.code} style={{ textAlign: 'right', marginRight: 5 }} disabled />
                </Item> */}
                {!_.get(taskConfig, 'customer.checkedShowForm') ? null : <Item inlineLabel error={error.name}>
                  <Label >{'Tên công việc:'}</Label>
                  <Input disabled={!taskRole.PUT} multiline={true} onChangeText={e => handleChange('name', e)} value={data.name} placeholder="Tối thiểu 5 kí tự" style={{ textAlign: 'right', marginRight: 5, paddingTop: 10 }} />
                  <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </Item>}





                {!_.get(taskConfig, 'customer.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.customer}>
                  <Label >{convertLabel(_.get(taskConfig, 'customer.title')) || 'Khách hàng'}:</Label>
                  <SingleAPISearch
                    API={API_CUSTOMER}
                    selectedItems={_.get(data, 'customer')}
                    onSelectedItemObjectsChange={(value) => handleChange('customer', _.get(value, '[0]'))}
                    filterOr={['name', 'customerCif', 'phoneNumber']}
                    selectedDatas={options.customer}
                    readOnly={!taskRole.PUT}
                  />
                </Item>}

                {!_.get(taskConfig, 'startDate.checkedShowForm') ? null : taskRole && <Item inlineLabel style={{ height: 42 }} error={error.startDate}>
                  <Label >{convertLabel(_.get(taskConfig, 'startDate.title')) || 'Ngày bắt đầu'}:</Label>
                  <CustomDateTimePicker
                    mode="datetime"
                    onSave={(e) => handleChange('startDate', e)}
                    value={moment(data.startDate).format(DATETIME_FORMAT)}
                  />
                </Item>}

                {!_.get(taskConfig, 'endDate.checkedShowForm') ? null : taskRole && <Item inlineLabel style={{ height: 42 }} error={error.endDate}>
                  <Label >{convertLabel(_.get(taskConfig, 'endDate.title')) || 'Ngày kết thúc'}:</Label>
                  <CustomDateTimePicker
                    mode="datetime"
                    onSave={(e) => handleChange('endDate', e)}
                    value={moment(data.endDate).format(DATETIME_FORMAT)}
                  />
                </Item>}

                {!_.get(taskConfig, 'taskStatus.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.taskStatus}>
                  <Label >{convertLabel(_.get(taskConfig, 'taskStatus.title')) || 'Tiến độ'}:</Label>
                  <CustomMultiSelect
                    disabled={!taskRole.PUT}
                    uniqueKey="value"
                    single
                    displayKey="text"
                    items={taskStatusData}
                    handleSelectItems={(value) => handleChange('taskStatus', value[0])}
                    canRemove={false}
                    selectedItems={data.taskStatus ? [data.taskStatus] : []}
                  />
                </Item>}

                {!_.get(taskConfig, 'priority.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.priority}>
                  <Label >{convertLabel(_.get(taskConfig, 'priority.title')) || 'Độ ưu tiên'}:</Label>
                  <CustomMultiSelect
                    uniqueKey="value"
                    displayKey="text"
                    single
                    items={priorityData}
                    handleSelectItems={(value) => handleChange('priority', value[0])}
                    selectedItems={data.priority ? [data.priority] : []}
                    canRemove={false}
                    disabled={!taskRole.PUT}
                  />
                </Item>}


                {!_.get(taskConfig, 'description.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.description}>
                  <Label >{convertLabel(_.get(taskConfig, 'description.title')) || 'Mô tả'}:</Label>
                  <Input disabled={!taskRole.PUT} onChangeText={e => handleChange('description', e)} value={data.description} style={{ textAlign: 'right', marginRight: 5 }} />
                  <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </Item>}

                {/* {!_.get(taskConfig, 'organizationUnit.checkedShowForm') ? null : <Item inlineLabel error={error.organizationUnit}>
                  <Label >{convertLabel(_.get(taskConfig, 'organizationUnit.title')) || 'Đơn vị chủ trì'}:</Label>
                  <SingleAPISearch
                    onSelectedItemsChange={(value) => handleChange('organizationUnit', _.get(value, '[0]'))}
                    selectedItems={data.organizationUnit ? [data.organizationUnit] : []}
                    // onRemoveSelectedItem={() => setCustomer(null)}
                    API={API_ORIGANIZATION}
                    selectedDatas={options.organizationUnit}
                    filterOr={['name', 'customerCif', 'phoneNumber']}
                  // customDislayKey={['name', 'customerCif', 'phoneNumber']}
                  />
                </Item>} */}

                {!_.get(taskConfig, 'description.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.createdBy}>
                  <Label >{convertLabel(_.get(taskConfig, 'createdBy.title')) || 'Người tạo'}:</Label>
                  <Input disabled={!taskRole.PUT} onChangeText={e => handleChange('description', e)} value={projectDetail.createdBy && projectDetail.createdBy.name} style={{ textAlign: 'right', marginRight: 5 }} />
                  <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </Item>}
              </CollapseView>
              {renderHtml === '<p></p>' ? null : <CollapseView hide title='Mô tả chi tiết'>
                {/* <Item inlineLabel >
                  <Label >Mô tả chi tiết</Label>
                  <Input onChangeText={e => handleChange('desHtml', e)} value={data.desHtml} style={{ textAlign: 'right', marginRight: 5 }} />
                  <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </Item> */}

                <ScrollView style={{ flex: 1, }}>

                  {/* <RenderHTML contentWidth={width} source={{ html }} /> */}
                  <RenderHTML contentWidth={width} source={{ html: renderHtml }} />

                </ScrollView>
              </CollapseView>}
              <CollapseView hide title='Người tham gia'>
                {!_.get(taskConfig, 'taskManager.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.taskManager}>
                  <Label >{convertLabel(_.get(taskConfig, 'taskManager.title') || 'Quản lý')}:</Label>
                  <MultiAPISearch
                    API={API_USERS}
                    selectedItems={Array.isArray(data.taskManager) ? data.taskManager : []}
                    onSelectedItemsChange={value => handleChange('taskManager', value)}
                    // onRemove={() => setTaskManager(null)}
                    filterOr={['name', 'code', 'phoneNumber']}
                    selectedDatas={options.taskManager}
                  />
                </Item>}

                {!_.get(taskConfig, 'viewable.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.viewable}>
                  <Label >{convertLabel(_.get(taskConfig, 'viewable.title')) || 'Người được xem'}:</Label>
                  <MultiAPISearch
                    API={API_USERS}
                    selectedItems={Array.isArray(data.viewable) ? data.viewable : []}
                    onSelectedItemsChange={(value) => handleChange('viewable', value)}
                    // onRemove={() => setViewable(null)}
                    filterOr={['name', 'code', 'phoneNumber']}
                    selectedDatas={options.viewable}
                  />
                </Item>}

                {!_.get(taskConfig, 'join.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.join}>
                  <Label >{convertLabel(_.get(taskConfig, 'join.title') || 'Người tham gia')}:</Label>
                  <MultiAPISearch
                    API={API_USERS}
                    selectedItems={Array.isArray(data.join) ? data.join : []}
                    onSelectedItemsChange={value => handleChange('join', value)}
                    filterOr={['name', 'code', 'phoneNumber']}
                    selectedDatas={options.join}
                  />
                </Item>
                }

                {!_.get(taskConfig, 'inCharge.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.inCharge}>
                  <Label >{convertLabel(_.get(taskConfig, 'inCharge.title')) || 'Người phụ trách'}:</Label>
                  <MultiAPISearch
                    API={API_USERS}
                    selectedItems={Array.isArray(data.inCharge) ? data.inCharge : []}
                    onSelectedItemsChange={(value) => handleChange('inCharge', value)}
                    filterOr={['name', 'code', 'phoneNumber']}
                    selectedDatas={options.inCharge}
                  />
                </Item>}

                {!_.get(taskConfig, 'support.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.support}>

                  <Label >{convertLabel(_.get(taskConfig, 'support.title') || 'Người hỗ trợ')}:</Label>
                  <MultiAPISearch
                    API={API_USERS}
                    selectedItems={Array.isArray(data.support) ? data.support : []}
                    onSelectedItemsChange={value => handleChange('support', value)}
                    filterOr={['name', 'code', 'phoneNumber']}
                    selectedDatas={options.support}
                  />
                </Item>
                }

                {!_.get(taskConfig, 'approved.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.approved}>
                  <Label >{convertLabel(_.get(taskConfig, 'approved.title') || 'Nhóm phê duyệt')}:</Label>
                  <SingleAPISearch
                    query={{
                      filter: {
                        clientId: client,
                      }
                    }}
                    API={API_APPROVE_GROUP}
                    selectedItems={Array.isArray(data.approved) ? data.approved : []}
                    onSelectedItemObjectsChange={value => handleChange('approved', value)}
                    filterOr={['name']}
                    selectedDatas={options.approved}
                    readOnly={!taskRole.PUT}
                  />
                </Item>
                }

                {!_.get(taskConfig, 'approvedProgress.checkedShowForm') ? null : taskRole && <Item inlineLabel error={error.approvedProgress}>
                  <Label >{convertLabel(_.get(taskConfig, 'approvedProgress.title') || 'Người phê duyệt tiến độ')}:</Label>
                  <SingleAPISearch
                    API={API_USERS}
                    onSelectedItemObjectsChange={value => handleChange('approvedProgress', _.get(value, '[0]'))}
                    selectedItems={data.approvedProgress ? [data.approvedProgress._id] : []}
                    onRemove={() => setApprovedProgress(null)}
                    filterOr={['name']}
                    selectedDatas={options.approvedProgress}
                    readOnly={!taskRole.PUT}
                  />
                </Item>}



              </CollapseView>

              <CollapseView title='Bình luận'>
                <CommentView project={projectDetail} code="Task" />
              </CollapseView>


            </Form>
          </CardItem>
          {taskRole &&
            <LoadingButton block style={{ margin: 2, marginTop: 0, borderRadius: 5 }} isBusy={isBusy} handlePress={handleSubmit}>
              <Icon name="check" type="Feather" />
            </LoadingButton>
          }
        </Card>
      </Content>
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
