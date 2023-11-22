import React, {Fragment, useState, useEffect, memo} from 'react';
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  DeviceEventEmitter,
  BackHandler,
  Image,
  Text,
  Switch,
  TextInput,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {compose} from 'redux';

import Icon from 'react-native-vector-icons/Feather';

import {useInjectSaga} from '../../utils/injectSaga';
import {useInjectReducer} from '../../utils/injectReducer';

import makeSelectAddProjectPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import BackHeader from '../../components/Header/BackHeader';
import {
  priorityData,
  provincialColumns,
  MODULE,
  DATE_FORMAT,
} from '../../utils/constants';
import {convertLabel} from '../../utils/common';
import {
  APPROVE_URL,
  API_USERS,
  API_CUSTOMER,
  API_SAMPLE_PROCESS,
  API_APPROVE_GROUP,
  API_TASK_CONFIG,
  API_ORIGANIZATION,
  CLIENT_ID,
} from '../../configs/Paths';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import LoadingButton from '../../components/LoadingButton';
import moment from 'moment';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch.js';
import ImageInput from '../../components/CustomInput/ImageInput';
import {makeSelectProfile, makeSelectViewConfig} from '../App/selectors';
import ToastCustom from '../../components/ToastCustom';
import Search from '../../components/CustomMultiSelect/Search';
import _ from 'lodash';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import CollapseView from '../../components/CustomView/CollapseView';
import {add} from '../../api/tasks';
import {validateForm} from '../../utils/validate';
import {autoLogout} from '../../utils/autoLogout';

export function AddProjectPage(props) {
  useInjectReducer({key: 'addProjectPage', reducer});
  useInjectSaga({key: 'addProjectPage', saga});

  const {navigation, taskConfig, profile, route} = props;
  const {project, parentId} = _.get(route, 'params', {});

  const [avatar, setAvatar] = useState();
  const [data, setData] = useState({});
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState();
  const [dataProject, setDataProject] = useState('');

  useEffect(() => {
    setData({
      taskManager: [profile._id],
      inCharge: [profile],
    });
  }, []);

  useEffect(() => {
    if (_.get(route, 'params')) {
      setDataProject(parentId);
    }
  }, [route]);

  useEffect(() => {
    const backHandlerListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => {
      backHandlerListener.remove();
    };
  }, []);

  const handleChange = (key, value) => {
    let newData = {};
    _.set(newData, key, value);
    setData({...data, ...newData});
    if (error[key]) setError({...error, [key]: false});
  };

  const checkValid = () => {
    let updateList =
      'name, template, description, startDate, endDate, priority, customer, viewable, inCharge, taskManager, approved, join, support, approvedProgress, provincial'
        .replace(/ /g, '')
        .split(',')
        .reduce((a, v) => ({...a, [v]: v}), {});
    const {isValid, errorList, firstMessage} = validateForm(
      taskConfig,
      data,
      updateList,
    );
    let valid = isValid;
    let msg = firstMessage;
    let err = errorList;
    if (!valid && msg) ToastCustom({text: msg, type: 'danger'});
    setError(err);
    return valid;
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      getClientId();
      autoLogout();
    });
  }, []);

  async function getClientId() {
    const clientId = await CLIENT_ID();
    setClient(clientId);
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (checkValid()) {
        const {
          name,
          isProject,
          template,
          description,
          startDate,
          endDate,
          priority,
          customer,
          viewable,
          inCharge,
          taskManager,
          approved,
          join,
          support,
          approvedProgress,
          provincial,
          organizationUnit,
          code,
        } = data;
        let task = {
          parentId: dataProject,
          isProject,
          name: name.trim(),
          template,
          description,
          startDate,
          endDate,
          priority,
          customer,
          viewable,
          inCharge: Array.isArray(inCharge) ? inCharge.map(c => c._id) : [],
          taskManager,
          approved: Array.isArray(approved)
            ? approved.map(c => ({id: c._id, name: c.name}))
            : [],
          join,
          support,
          approvedProgress,
          provincial,
          isObligatory: true,
          code,
          organizationUnit,
          createBy: {
            _id: profile._id,
            name: profile.name,
          },
        };
        const res = await add(task, avatar);

        if (_.get(res, 'success')) {
          ToastCustom({text: 'Thêm mới thành công', type: 'success'});
          DeviceEventEmitter.emit('addProjectSuccess', {project: res.data});
          navigation.goBack();
        } else {
          ToastCustom({text: 'Thêm mới thất bại', type: 'danger'});
        }
      }
    } catch (err) {
      ToastCustom({text: 'Thêm mới thất bại', type: 'danger'});
    }
    setIsLoading(false);
  };

  return (
    <Fragment>
      <BackHeader
        navigation={navigation}
        title={data.isProject ? 'Thêm dự án' : 'Thêm công việc'}
      />

      <ScrollView keyboardShouldPersistTaps="handled" style={{flex: 1,  backgroundColor:'#ddd',}}>
        <View
          style={{
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
          }}>
          <View bordered style={{backgroundColor: '#f2f2f2', flex: 1, marginHorizontal: 10}} cardBody>
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <ImageInput source={avatar} onSave={setAvatar} />

              <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#aaa', flexDirection:'row', alignItems:'center', justifyContent:'space-between', }} >
                <Text>Dự án</Text>
                <View style={{height: 40, flex: 1, justifyContent: 'center'}}>
                  <Switch
                    value={data.isProject}
                    onValueChange={() =>
                      handleChange('isProject', !data.isProject)
                    }
                  />
                </View>
              </View>

              {!_.get(taskConfig, 'startDate.checkedShowForm') ? null : (
                <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.name}>
                  <Text>
                    {data.isProject ? 'Tên dự án:' : 'Tên công việc:'}
                  </Text>
                  <TextInput
                    onChangeText={e => handleChange('name', e)}
                    value={data.name}
                    style={{textAlign: 'right', marginRight: 5}}
                    multiline={true}
                  />
                  <Icon
                    active
                    type="Entypo"
                    name="keyboard"
                    style={{fontSize: 16}}
                  />
                </View>
              )}

              <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.provincial}>
                <Text>
                  {' '}
                  {convertLabel(
                    _.get(taskConfig, 'provincial.title') || 'Khu vực',
                  )}
                  :
                </Text>
                <Search
                  single
                  items={provincialColumns}
                  uniqueKey="name"
                  handleSelectItems={value =>
                    handleChange('provincial', _.get(value, '[0]'))
                  }
                  selectedItems={data.provincial ? [data.provincial] : []}
                />
              </View>

              {!_.get(taskConfig, 'startDate.checkedShowForm') ? null : (
                <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.startDate}>
                  <Text>
                    {convertLabel(
                      _.get(taskConfig, 'startDate.title') || 'Ngày bắt đầu',
                    )}
                    :
                  </Text>
                  <DateTimePicker
                    mode="datetime"
                    onSave={e => handleChange('startDate', e)}
                    value={
                      data.startDate &&
                      moment(data.startDate).format(DATE_FORMAT.DATE_TIME)
                    }
                  />
                </View>
              )}

              {!_.get(taskConfig, 'endDate.checkedShowForm') ? null : (
                <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.endDate}>
                  <Text>
                    {convertLabel(
                      _.get(taskConfig, 'endDate.title') || 'Ngày kết thúc',
                    )}
                    :
                  </Text>
                  <DateTimePicker
                    mode="datetime"
                    onSave={e => handleChange('endDate', e)}
                    value={
                      data.endDate &&
                      moment(data.endDate).format(DATE_FORMAT.DATE_TIME)
                    }
                  />
                </View>
              )}

              {!_.get(taskConfig, 'template.checkedShowForm') ? null : (
                <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.template}>
                  <Text>
                    {convertLabel(
                      _.get(taskConfig, 'template.title') || 'Quy trình',
                    )}
                    :
                  </Text>
                  <SingleAPISearch
                    API={API_SAMPLE_PROCESS}
                    onSelectedItemObjectsChange={value =>
                      handleChange('template', _.get(value, '[0]'))
                    }
                    selectedItems={data.template ? [data.template] : []}
                    filterOr={['name']}
                  />
                </View>
              )}

              {!_.get(taskConfig, 'customer.checkedShowForm') ? null : (
                <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.customer}>
                  <Text>
                    {convertLabel(_.get(taskConfig, 'customer.title')) ||
                      'Khách hàng'}
                    :
                  </Text>
                  <SingleAPISearch
                    API={API_CUSTOMER}
                    selectedItems={data.customer ? [data.customer] : []}
                    onSelectedItemsChange={value =>
                      handleChange('customer', _.get(value, '[0]'))
                    }
                    filterOr={['name', 'customerCif', 'phoneNumber']}
                  />
                </View>
              )}

              {!_.get(taskConfig, 'priority.checkedShowForm') ? null : (
                <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.priority}>
                  <Text>
                    {convertLabel(
                      _.get(taskConfig, 'priority.title') || 'Độ ưu tiên',
                    )}
                    :
                  </Text>
                  <CustomMultiSelect
                    single
                    uniqueKey="value"
                    displayKey="text"
                    items={priorityData}
                    handleSelectItems={value =>
                      handleChange('priority', _.get(value, '[0]'))
                    }
                    selectedItems={data.priority ? [data.priority] : []}
                  />
                </View>
              )}
              {!_.get(taskConfig, 'description.checkedShowForm') ? null : (
                <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.description}>
                  <Text>
                    {convertLabel(
                      _.get(taskConfig, 'description.title') || 'Mô tả',
                    )}
                    :
                  </Text>
                  <TextInput
                    value={data.description}
                    onChangeText={e => handleChange('description', e)}
                    style={{textAlign: 'right', marginRight: 5, paddingTop: 10}}
                    multiline={true}
                  />
                  <Icon
                    active
                    type="Entypo"
                    name="keyboard"
                    style={{fontSize: 16}}
                  />
                </View>
              )}
              <CollapseView title="Người tham gia" >
                {!_.get(taskConfig, 'taskManager.checkedShowForm') ? null : (
                  <View inlineLabel   error={error.taskManager}>
                    <Text>
                      {convertLabel(
                        _.get(taskConfig, 'taskManager.title') || 'Quản lý',
                      )}
                      :
                    </Text>
                    <MultiAPISearch
                      API={API_USERS}
                      selectedItems={
                        Array.isArray(data.taskManager) ? data.taskManager : []
                      }
                      onSelectedItemsChange={value =>
                        handleChange('taskManager', value)
                      }
                      filterOr={['name', 'code', 'phoneNumber']}
                      selectedDatas={[profile]}
                    />
                  </View>
                )}

                {!_.get(taskConfig, 'viewable.checkedShowForm') ? null : (
                  <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.viewable}>
                    <Text>
                      {convertLabel(
                        _.get(taskConfig, 'viewable.title') || 'Người được xem',
                      )}
                      :
                    </Text>
                    <MultiAPISearch
                      API={API_USERS}
                      selectedItems={
                        Array.isArray(data.viewable) ? data.viewable : []
                      }
                      onSelectedItemsChange={value =>
                        handleChange('viewable', value)
                      }
                      filterOr={['name', 'code', 'phoneNumber']}
                    />
                  </View>
                )}

                {!_.get(taskConfig, 'join.checkedShowForm') ? null : (
                  <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.join}>
                    <Text>
                      {convertLabel(
                        _.get(taskConfig, 'join.title') || 'Người tham gia',
                      )}
                      :
                    </Text>
                    <MultiAPISearch
                      API={API_USERS}
                      onSelectedItemObjectsChange={e => handleChange('join', e)}
                      selectedItems={_.get(data, 'join._id')}
                    />
                  </View>
                )}
                {!_.get(taskConfig, 'inCharge.checkedShowForm') ? null : (
                  <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.inCharge}>
                    <Text>
                      {convertLabel(
                        _.get(taskConfig, 'inCharge.title') ||
                          'Người phụ trách',
                      )}
                      :
                    </Text>
                    <MultiAPISearch
                      API={API_USERS}
                      selectedItems={
                        Array.isArray(data.inCharge)
                          ? data.inCharge.map(c => c._id)
                          : []
                      }
                      onSelectedItemObjectsChange={value =>
                        handleChange('inCharge', value)
                      }
                      filterOr={['name', 'code', 'phoneNumber']}
                      selectedDatas={[profile]}
                    />
                  </View>
                )}

                {!_.get(taskConfig, 'support.checkedShowForm') ? null : (
                  <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.support}>
                    <Text>
                      {convertLabel(
                        _.get(taskConfig, 'support.title') || 'Người hỗ trợ',
                      )}
                      :
                    </Text>
                    <MultiAPISearch
                      API={API_USERS}
                      selectedItems={
                        Array.isArray(data.support) ? data.support : []
                      }
                      onSelectedItemsChange={value =>
                        handleChange('support', value)
                      }
                      filterOr={['name', 'code', 'phoneNumber']}
                    />
                  </View>
                )}

                {!_.get(taskConfig, 'approved.checkedShowForm') ? null : (
                  <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.approved}>
                    <Text>
                      {convertLabel(
                        _.get(taskConfig, 'approved.title') || 'Nhóm phê duyệt',
                      )}
                      :
                    </Text>
                    <SingleAPISearch
                      query={{
                        filter: {
                          clientId: client,
                        },
                      }}
                      API={API_APPROVE_GROUP}
                      selectedItems={
                        Array.isArray(data.approved)
                          ? data.approved.map(c => c._id)
                          : []
                      }
                      onSelectedItemObjectsChange={value =>
                        handleChange('approved', value)
                      }
                      filterOr={['name']}
                      // filter={{
                      //   isActive: true,
                      // }}
                    />
                  </View>
                )}

                {!_.get(
                  taskConfig,
                  'approvedProgress.checkedShowForm',
                ) ? null : (
                  <View inlineLabel style={{paddingVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}  error={error.approvedProgress}>
                    <Text>
                      {convertLabel(
                        _.get(taskConfig, 'approvedProgress.title') ||
                          'Người phê duyệt tiến độ',
                      )}
                      :
                    </Text>
                    <SingleAPISearch
                      API={API_USERS}
                      onSelectedItemObjectsChange={value =>
                        handleChange('approvedProgress', _.get(value, '[0]'))
                      }
                      selectedItems={
                        data.approvedProgress ? [data.approvedProgress._id] : []
                      }
                      onRemove={() => setApprovedProgress(null)}
                      filterOr={['name']}
                    />
                  </View>
                )}
              </CollapseView>
            </View>
          </View>
        </View>
        <LoadingButton
          style={{paddingVertical: 10, backgroundColor: 'rgba(46, 149, 46, 1)'}}
          isBusy={isLoading}
          block
          handlePress={handleSubmit}>
          <Icon
            style={{color: 'white', fontSize: 20, textAlign: 'center'}}
            name="check"
            type="Feather"
          />
        </LoadingButton>
      </ScrollView>
    </Fragment>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
  taskConfig: makeSelectViewConfig(MODULE.TASK),
});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(AddProjectPage);
