/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * AddApproveWorkOut
 *
 */

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Modal, StyleSheet, Alert, FlatList } from 'react-native';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectAddApproveWorkOut from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getApprove, updateApprove, cleanup, addMeetingSchedule } from './actions';
import { getProfile, getAppInfo } from '../../utils/authen';
import { TouchableOpacity } from 'react-native';
import {
  Text,
  Badge,
  Icon,
  Container,
  Card,
  CardItem,
  View,
  Button,
  Right,
  Tab,
  TabHeading,
  Tabs,
  H3,
  Textarea,
  List,
  ListItem,
  Left,
  Body,
  Item,
  Label,
  Input,
  Content,
  Spinner,
} from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
import LoadingLayout from '../../components/LoadingLayout';
import images from '../../images';
import CustomThumbnail from '../../components/CustomThumbnail';
import moment from 'moment';
import { useInput } from '../../utils/useInput';
import CustomInput from '../../components/CustomInput';
import styles from './styles';
import { API_APPROVE_GROUPS, API_USERS, API_HRM_SHIFT, API_APPROVE_GROUP, API_DYNAMIC_FORM } from '../../configs/Paths';
import { handleSearch } from '../../utils/common';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import _ from 'lodash';
import { makeSelectClientId } from '../App/selectors';
import ToastCustom from '../../components/ToastCustom';
import { MODULE } from '../../utils/constants';

export function AddApproveWorkOut(props) {
  useInjectReducer({ key: 'addApprovePage', reducer });
  useInjectSaga({ key: 'addApprovePage', saga });

  const { navigation, clientId, onAddWorkOut, addApprovePage } = props;
  const { isLoading, approveMeetingScheduleSuccess } = addApprovePage
  const [localState, setLocalState] = useState({});
  const [isLoadingAll, setIsLoadingAll] = useState(false)
  const [proFile, setProfile] = useState()
  const [error, setError] = useState({});
  const { dateStart, dateEnd, location, shift, employee, group, reason } = localState;
  const approveMeetingScheduleSuccessRef = useRef(approveMeetingScheduleSuccess)
  const code = MODULE.CALENDAR

  useEffect(() => {
    getProfile().then(setProfile)
  }, [])

  useEffect(() => {

    if (approveMeetingScheduleSuccess) {
      if (approveMeetingScheduleSuccessRef.current === true) {
        approveMeetingScheduleSuccessRef.current = false
      } else {
        approveMeetingScheduleSuccessRef.current = false
        setIsLoadingAll(true)
      }
    } else if (approveMeetingScheduleSuccess === true && approveMeetingScheduleSuccessRef.current === true) {

      setIsLoadingAll(true)
    }

  }, [approveMeetingScheduleSuccess])

  useEffect(() => {
    if (isLoadingAll) {
      navigation.navigate('Approve');
      setIsLoadingAll(false)
    }
  }, [isLoadingAll])

  const handleChange = (key, value) => {
    let newData = {}
    newData[key] = value
    setLocalState({ ...localState, ...newData });
  };

  const isValid = () => {
    let err = {}, warning = ''
    // if (!localData.dataInfo || !localData.dataInfo.length) err.dataInfo = true
    // if (!localData.name || !localData.name.trim()) err.name = true
    if (!localState.approveGroup || !localState.approveGroup.length) err.approveGroup = true

    // if (err.dataInfo) warning = `Bạn cần chọn thời gian bắt đầu và kết thúc`
    // if (err.name) warning = 'Bạn cần nhập Tên phê duyệt'
    if (err.approveGroup) warning = 'Bạn cần chọn Nhóm phê duyệt'


    if (!err.timeStart && !err.timeEnd) {
      const isValidDate = moment(localState.timeStart).isBefore(localState.timeEnd)

      if (!isValidDate) {
        warning = 'Ngày kết thúc phải sau ngày bắt đầu'
        err.startDate = true
        err.endDate = true
      }
    }
    setError(err)

    const valid = !Object.keys(err).length
    if (!valid) ToastCustom({ text: warning, type: 'danger' })
    return valid
  }
  const onSendWorkOut = () => {
    if (!isValid()) return
    const body = {
      timeEnd: moment(localState.timeEnd).format('DD/MM/YYYY HH:mm').toString(),
      timeStart: moment(localState.timeStart).format('DD/MM/YYYY HH:mm').toString(),
      date: moment(localState.timeStart).format().toString(),
      name: 'Lịch công tác' + '_' + new Date().getTime(),
      createdBy: proFile,
      from: "5e0464fd09ea5f2a2c249306",
      kanbanStatus: "1",
      address: localState.location ? localState.location : '',
      link: "Calendar/working-calendar",
      people: localState.approveGroup,
      approved: localState.employee[0],
      typeCalendar: 2,
      organizer: null,
      result: "",
      content: "",
      subCode: localState.reason,
      approveGroup: localState.groupRender

    }
    onAddWorkOut(body)

  }

  return (
    <Container>
      <BackHeader
        navigation={navigation}
        title="Công tác/Ra ngoài"
        rightHeader={
          isLoading
            ? <Spinner />
            :
            <Icon active name="send" onPress={onSendWorkOut} style={{ color: '#fff' }} />
        } />
      <Content>
        <Item inlineLabel error={error.timeStart}>
          <Label>Thời gian bắt đầu:</Label>
          <DateTimePicker
            mode="datetime"
            onSave={(e) => handleChange('timeStart', e)}
            value={localState.timeStart && moment(localState.timeStart).format('DD/MM/YYYY HH:mm')}
          />
        </Item>
        <Item inlineLabel error={error.timeEnd}>
          <Label>Thời gian kết thúc:</Label>
          <DateTimePicker
            mode="datetime"
            onSave={(e) => handleChange('timeEnd', e)}
            value={localState.timeEnd && moment(localState.timeEnd).format('DD/MM/YYYY HH:mm')}
          />
        </Item>

        <CustomInput inlineLabel label={'Địa điểm'}>
          <Input multiline={true} style={styles.input} value={location} onValueChange={(e) => handleChange('location', e)} />
          <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
        </CustomInput>
        <CustomInput inlineLabel label="Người tham gia">
          <MultiAPISearch
            API={API_USERS}
            query={{ limit: 20 }}
            selectedItems={localState.employee}
            onSelectedItemObjectsChange={(e) => handleChange('employee', e)}
            onRemove={() => handleChange('employee', null)}
            filterOr={['name', 'code', 'phoneNumber']}
          />
        </CustomInput>

        <CustomInput inlineLabel label="Người phê duyệt" error={error.approveGroup}>
          <SingleAPISearch
            query={{ limit: 20 }}
            API={API_USERS}
            onSelectedItemObjectsChange={(value) => handleChange('approveGroup', value)}
            selectedItems={_.get(localState, 'approveGroup[0]._id')}
          />
        </CustomInput>
        <Item inlineLabel error={error.groupRender}  >
          <Label>Nhóm phê duyệt</Label>
          <SingleAPISearch
            query={{
              filter: {
                clientId,
              }
            }}
            API={API_APPROVE_GROUP}
            onSelectedItemObjectsChange={(value) => handleChange('groupRender', value)}
            selectedItems={_.get(localState, 'groupRender[0]._id')}
          />
        </Item>
        <Item inlineLabel>
          <Label>Biểu mẫu phê duyệt</Label>
          <SingleAPISearch
            displayKey='title'
            query={{
              clientId,
              moduleCode: code,
            }}
            API={API_DYNAMIC_FORM}
            onSelectedItemObjectsChange={(value) => {
              handleChange('form', value)
            }}
            selectedItems={_.get(localState, 'form[0]._id')}
          />
        </Item>
        <View>
          <CustomInput inlineLabel label={'Nội dung:'} >
            <Input value={_.get(localState, 'reason')} style={{
              textAlign: 'right',
              marginRight: 5,
              height: 100
            }} onChangeText={(e) => handleChange('reason', e)} multiline={true} />
            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
          </CustomInput>
        </View>
      </Content>
    </Container>
  );
}

const mapStateToProps = createStructuredSelector({
  addApprovePage: makeSelectAddApproveWorkOut(),
  clientId: makeSelectClientId()
});

function mapDispatchToProps(dispatch) {
  return {
    onAddWorkOut: (data) => dispatch(addMeetingSchedule(data)),
    onCleanUp: () => dispatch(cleanup()),


  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(AddApproveWorkOut);
