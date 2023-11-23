import React, { useState, useEffect, memo } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome'
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
import IconEn from 'react-native-vector-icons/Entypo';
import CollapseView from '../../../components/CustomView/CollapseView';
import { API_APPROVE_GROUP, CLIENT_ID } from '../../../configs/Paths';
import { update } from '../../../api/tasks';
import RenderHTML from "react-native-render-html";
import { DeviceEventEmitter, Dimensions, ScrollView, useWindowDimensions, Text, View, TextInput,  } from 'react-native';
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
      <ScrollView keyboardShouldPersistTaps="handled"  style={{flex: 1,  backgroundColor:'#ddd',}}>
        <View style={{
            backgroundColor: '#f2f2f2',
            flex: 1,
            margin: 5,
            shadowColor: '#000',
            shadowOffset: {
              width: -2,
              height: 5,
            },
            shadowOpacity: 0.36,
            shadowRadius: 6.68,
            elevation: 11,
          }} transparent>
          <View bordered style={{ backgroundColor: '#f2f2f2', flex: 1 }} cardBody>
            <View style={{ flex: 1, backgroundColor: 'white' }}>
              <ImageInput source={avatar || (projectDetail.avatar ? { uri: projectDetail.avatar } : null)} onSave={setAvatar} />

              <CollapseView >
                {/* <View>
                  <Text >{'Mã công việc'}</Text>
                  <TextInput onChangeText={e => handleChange('code', e)} value={data.code} style={{ textAlign: 'right', marginRight: 5 }} disabled />
                </View> */}
                {!_.get(taskConfig, 'customer.checkedShowForm') ? null : <View inlineLabel style={styles.view}  error={error.name}>
                  <Text >{'Tên công việc:'}</Text>
                  <TextInput disabled={!taskRole.PUT} multiline={true} onChangeText={e => handleChange('name', e)} value={data.name} placeholder="Tối thiểu 5 kí tự" style={{ textAlign: 'right', marginRight: 5, paddingTop: 10 }} />
                  <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </View>}





                {!_.get(taskConfig, 'customer.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.customer}>
                  <Text >{convertLabel(_.get(taskConfig, 'customer.title')) || 'Khách hàng'}:</Text>
                  <SingleAPISearch
                    API={API_CUSTOMER}
                    selectedItems={_.get(data, 'customer')}
                    onSelectedItemObjectsChange={(value) => handleChange('customer', _.get(value, '[0]'))}
                    filterOr={['name', 'customerCif', 'phoneNumber']}
                    selectedDatas={options.customer}
                    readOnly={!taskRole.PUT}
                  />
                </View>}

                {!_.get(taskConfig, 'startDate.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.startDate}>
                  <Text >{convertLabel(_.get(taskConfig, 'startDate.title')) || 'Ngày bắt đầu'}:</Text>
                  <CustomDateTimePicker
                    mode="datetime"
                    onSave={(e) => handleChange('startDate', e)}
                    value={moment(data.startDate).format(DATETIME_FORMAT)}
                  />
                </View>}

                {!_.get(taskConfig, 'endDate.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view}  error={error.endDate}>
                  <Text >{convertLabel(_.get(taskConfig, 'endDate.title')) || 'Ngày kết thúc'}:</Text>
                  <CustomDateTimePicker
                    mode="datetime"
                    onSave={(e) => handleChange('endDate', e)}
                    value={moment(data.endDate).format(DATETIME_FORMAT)}
                  />
                </View>}

                {!_.get(taskConfig, 'taskStatus.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.taskStatus}>
                  <Text >{convertLabel(_.get(taskConfig, 'taskStatus.title')) || 'Tiến độ'}:</Text>
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
                </View>}

                {!_.get(taskConfig, 'priority.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.priority}>
                  <Text >{convertLabel(_.get(taskConfig, 'priority.title')) || 'Độ ưu tiên'}:</Text>
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
                </View>}


                {!_.get(taskConfig, 'description.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.description}>
                  <Text >{convertLabel(_.get(taskConfig, 'description.title')) || 'Mô tả'}:</Text>
                  <TextInput disabled={!taskRole.PUT} onChangeText={e => handleChange('description', e)} value={data.description} style={{ textAlign: 'right', marginRight: 5, flex: 1 }} />
                  <IconEn active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </View>}

                {/* {!_.get(taskConfig, 'organizationUnit.checkedShowForm') ? null : <View inlineLabel style={styles.view} error={error.organizatiSonUnit}>
                  <Text >{convertLabel(_.get(taskConfig, 'organizationUnit.title')) || 'Đơn vị chủ trì'}:</Text>
                  <SingleAPISearch
                    onSelectedItemsChange={(value) => handleChange('organizationUnit', _.get(value, '[0]'))}
                    selectedItems={data.organizationUnit ? [data.organizationUnit] : []}
                    // onRemoveSelectedItem={() => setCustomer(null)}
                    API={API_ORIGANIZATION}
                    selectedDatas={options.organizationUnit}
                    filterOr={['name', 'customerCif', 'phoneNumber']}
                  // customDislayKey={['name', 'customerCif', 'phoneNumber']}
                  />
                </View>} */}

                {!_.get(taskConfig, 'description.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.createdBy}>
                  <Text >{convertLabel(_.get(taskConfig, 'createdBy.title')) || 'Người tạo'}:</Text>
                  <TextInput disabled={!taskRole.PUT} onChangeText={e => handleChange('description', e)} value={projectDetail.createdBy && projectDetail.createdBy.name} style={{ textAlign: 'right', marginRight: 5, flex: 1 }} />
                  <IconEn active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </View>}
              </CollapseView>
              {renderHtml === '<p></p>' ? null : <CollapseView hide title='Mô tả chi tiết'>
                {/* <View inlineLabel style={styles.view} >
                  <Text >Mô tả chi tiết</Text>
                  <TextInput onChangeText={e => handleChange('desHtml', e)} value={data.desHtml} style={{ textAlign: 'right', marginRight: 5 }} />
                  <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </View> */}

                <ScrollView style={{ flex: 1, }}>

                  {/* <RenderHTML contentWidth={width} source={{ html }} /> */}
                  <RenderHTML contentWidth={width} source={{ html: renderHtml }} />

                </ScrollView>
              </CollapseView>}
              <CollapseView hide title='Người tham gia'>
                {!_.get(taskConfig, 'taskManager.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.taskManager}>
                  <Text >{convertLabel(_.get(taskConfig, 'taskManager.title') || 'Quản lý')}:</Text>
                  <MultiAPISearch
                    API={API_USERS}
                    selectedItems={Array.isArray(data.taskManager) ? data.taskManager : []}
                    onSelectedItemsChange={value => handleChange('taskManager', value)}
                    // onRemove={() => setTaskManager(null)}
                    filterOr={['name', 'code', 'phoneNumber']}
                    selectedDatas={options.taskManager}
                  />
                </View>}

                {!_.get(taskConfig, 'viewable.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.viewable}>
                  <Text >{convertLabel(_.get(taskConfig, 'viewable.title')) || 'Người được xem'}:</Text>
                  <MultiAPISearch
                    API={API_USERS}
                    selectedItems={Array.isArray(data.viewable) ? data.viewable : []}
                    onSelectedItemsChange={(value) => handleChange('viewable', value)}
                    // onRemove={() => setViewable(null)}
                    filterOr={['name', 'code', 'phoneNumber']}
                    selectedDatas={options.viewable}
                  />
                </View>}

                {!_.get(taskConfig, 'join.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.join}>
                  <Text >{convertLabel(_.get(taskConfig, 'join.title') || 'Người tham gia')}:</Text>
                  <MultiAPISearch
                    API={API_USERS}
                    selectedItems={Array.isArray(data.join) ? data.join : []}
                    onSelectedItemsChange={value => handleChange('join', value)}
                    filterOr={['name', 'code', 'phoneNumber']}
                    selectedDatas={options.join}
                  />
                </View>
                }

                {!_.get(taskConfig, 'inCharge.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.inCharge}>
                  <Text >{convertLabel(_.get(taskConfig, 'inCharge.title')) || 'Người phụ trách'}:</Text>
                  <MultiAPISearch
                    API={API_USERS}
                    selectedItems={Array.isArray(data.inCharge) ? data.inCharge : []}
                    onSelectedItemsChange={(value) => handleChange('inCharge', value)}
                    filterOr={['name', 'code', 'phoneNumber']}
                    selectedDatas={options.inCharge}
                  />
                </View>}

                {!_.get(taskConfig, 'support.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.support}>

                  <Text >{convertLabel(_.get(taskConfig, 'support.title') || 'Người hỗ trợ')}:</Text>
                  <MultiAPISearch
                    API={API_USERS}
                    selectedItems={Array.isArray(data.support) ? data.support : []}
                    onSelectedItemsChange={value => handleChange('support', value)}
                    filterOr={['name', 'code', 'phoneNumber']}
                    selectedDatas={options.support}
                  />
                </View>
                }

                {!_.get(taskConfig, 'approved.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.approved}>
                  <Text >{convertLabel(_.get(taskConfig, 'approved.title') || 'Nhóm phê duyệt')}:</Text>
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
                </View>
                }

                {!_.get(taskConfig, 'approvedProgress.checkedShowForm') ? null : taskRole && <View inlineLabel style={styles.view} error={error.approvedProgress}>
                  <Text >{convertLabel(_.get(taskConfig, 'approvedProgress.title') || 'Người phê duyệt tiến độ')}:</Text>
                  <SingleAPISearch
                    API={API_USERS}
                    onSelectedItemObjectsChange={value => handleChange('approvedProgress', _.get(value, '[0]'))}
                    selectedItems={data.approvedProgress ? [data.approvedProgress._id] : []}
                    onRemove={() => setApprovedProgress(null)}
                    filterOr={['name']}
                    selectedDatas={options.approvedProgress}
                    readOnly={!taskRole.PUT}
                  />
                </View>}



              </CollapseView>

              <CollapseView title='Bình luận'>
                <CommentView project={projectDetail} code="Task" />
              </CollapseView>


            </View>
          </View>
          {taskRole &&
            <LoadingButton block style={{ margin: 2, marginTop: 0, borderRadius: 5,  backgroundColor: 'rgba(46, 149, 46, 1)', paddingVertical: 10 ,marginTop: 10}} isBusy={isBusy} handlePress={handleSubmit}>
              <Icon name="check" type="Feather" style={{color:'white', fontSize: 20, textAlign:'center'}} />
            </LoadingButton>
          }
        </View>
      </ScrollView>
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


const styles ={
  view: {paddingVertical: 5, borderBottomWidth: 1, borderColor: '#aaa', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal: 5 }
}