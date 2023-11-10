/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * AddApproveOverTime
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import _ from 'lodash';
import moment from 'moment';
import {
  Container,
  Icon,
  Input,
  Item,
  Label,
  Spinner,
  View
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import CustomInput from '../../components/CustomInput';
import BackHeader from '../../components/Header/BackHeader';
import ToastCustom from '../../components/ToastCustom';
import { API_APPROVE_GROUP, API_DYNAMIC_FORM, API_FIELD } from '../../configs/Paths';
import { MODULE } from '../../utils/constants';
import { makeSelectClientId, makeSelectProfile } from '../App/selectors';
import { addApproveOverTime, cleanup } from './actions';
import reducer from './reducer';
import saga, { addApproveAllIsLoading } from './saga';
import makeSelectAddApproveOverTime from './selectors';
export function AddApproveOverTime(props) {
  useInjectReducer({ key: 'addApprovePage', reducer });
  useInjectSaga({ key: 'addApprovePage', saga });

  const { navigation, route, onAddApprove, addApprovePage, profile, clientId } = props;
  const { isLoading, addApproveOverTimeSuccess, addApproveIsloadingSuccess } = addApprovePage
  const [localData, setLocalData] = useState({})
  const [error, setError] = useState({});
  const [isLoadingAll, setIsLoadingAll] = useState(false)

  const addApproveOverTimeSuccessRef = useRef(addApproveOverTimeSuccess)

  const code = MODULE.HRMOVERTIME

  const handleChange = (key, value) => {
    let newData = {}
    newData[key] = value

    setLocalData({ ...localData, ...newData });
  };

  const isValid = () => {
    let err = {}, warning = ''
    // if (!localData.dataInfo || !localData.dataInfo.length) err.dataInfo = true
    // if (!localData.name || !localData.name.trim()) err.name = true
    if (!localData.approveGroup || !localData.approveGroup.length) err.approveGroup = true

    // if (err.dataInfo) warning = `Bạn cần chọn thời gian bắt đầu và kết thúc`
    // if (err.name) warning = 'Bạn cần nhập Tên phê duyệt'
    if (err.approveGroup) warning = 'Bạn cần chọn Nhóm phê duyệt'

    if (!err.timeStart && !err.timeEnd) {
      const isValidDate = moment(localData.timeStart).isBefore(localData.timeEnd)

      if (!isValidDate) {
        warning = 'Ngày kết thúc phải sau ngày bắt đầu'
        err.timeStart = true
        err.timeEnd = true
      }
    }

    setError(err)

    const valid = !Object.keys(err).length
    if (!valid) ToastCustom({ text: warning, type: 'danger' })
    return valid
  }


  useEffect(() => {
    if (addApproveOverTimeSuccess) {
      if (addApproveOverTimeSuccessRef.current === true) {
        addApproveOverTimeSuccessRef.current = false
      } else {
        addApproveOverTimeSuccessRef.current = false
        setIsLoadingAll(true)
      }
    } else if (addApproveOverTimeSuccess === true && addApproveOverTimeSuccessRef.current === true) {
      setIsLoadingAll(true)
    }
  }, [addApproveOverTimeSuccess])

  useEffect(() => {
    if (isLoadingAll) {
      navigation.navigate('Approve');
      setIsLoadingAll(false)
    }
  }, [isLoadingAll])

  const onSendApprove = () => {
    if (!isValid()) return

    const body = {
      hrmEmployeeId: profile,
      dataInfo: profile,
      timeStart: moment(localData.timeStart).format('HH:mm').toString(),
      timeEnd: moment(localData.timeEnd).format('HH:mm').toString(),
      description: localData.reason,
      overTimeDate: moment(localData.overTimeDate),
      // organizationUnitId:
      month: parseInt(moment(localData.overTimeDate).format('MM')),
      year: parseInt(moment(localData.overTimeDate).format('YYYY')),
      approveGroup: localData && localData.approveGroup ? localData.approveGroup : null,
      clientId,
      collectionCode: 'HrmOverTime',
      field: null,
      name: 'Làm thêm giờ',
      subCode: ' Làm thêm giờ'

    }

    onAddApprove(body)


  }


  return (
    <Container>
      <BackHeader navigation={navigation} title="Làm thêm giờ"
        rightHeader={
          isLoading
            ? <Spinner />
            : <Icon active name="send" onPress={onSendApprove} style={{ color: '#fff' }} />
        } />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Item inlineLabel error={error.timeStart}>
          <Label>Thời gian bắt đầu:</Label>
          <DateTimePicker
            mode="time"
            onSave={(e) => handleChange('timeStart', e)}
            value={localData.timeStart && moment(localData.timeStart).format('HH:mm')}
          />
        </Item>
        <Item inlineLabel error={error.timeEnd}>
          <Label>Thời gian kết thúc:</Label>
          <DateTimePicker
            mode="time"
            onSave={(e) => handleChange('timeEnd', e)}
            value={localData.timeEnd && moment(localData.timeEnd).format('HH:mm')}
          />
        </Item>
        <Item inlineLabel>
          <Label>Ngày:</Label>
          <DateTimePicker
            mode="date"
            onSave={(e) => handleChange('overTimeDate', e)}
            value={localData.overTimeDate && moment(localData.overTimeDate).format('DD/MM/YYYY')}
          />
        </Item>
        <Item inlineLabel error={error.approveGroup}  >
          <Label>Nhóm phê duyệt</Label>
          <SingleAPISearch
            query={{
              filter: {
                clientId,
              }
            }}
            API={API_APPROVE_GROUP}
            onSelectedItemObjectsChange={(value) => handleChange('approveGroup', value)}
            selectedItems={_.get(localData, 'approveGroup[0]._id')}
          />
        </Item>
        <Item inlineLabel error={error.field} >
          <Label>Trường phê duyệt</Label>
          <SingleAPISearch
            query={{ filter: { code } }}
            API={API_FIELD}
            onSelectedItemsChange={(value) => handleChange('field', value)}
            selectedItems={localData.field}
          />
        </Item>
        <Item inlineLabel error={error.form} >
          <Label>Biểu mẫu phê duyệt</Label>
          <SingleAPISearch
            displayKey='title'
            query={{ clientId, moduleCode: code }}
            API={API_DYNAMIC_FORM}
            onSelectedItemObjectsChange={(value) => handleChange('form', value)}
            selectedItems={_.get(localData, 'form[0]._id')}
          />
        </Item>

        <View>
          <CustomInput inlineLabel label={'Nội dung:'} >

            <Input value={_.get(localData, 'reason')} style={{
              textAlign: 'right',
              marginRight: 5,
              height: 100
            }} onChangeText={(e) => handleChange('reason', e)} multiline={true} />
            <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
          </CustomInput>
        </View>
      </KeyboardAvoidingView>
    </Container>
  )




  // <ApproveTemplate
  //   route={route}
  //   navigation={navigation}
  //   title="Làm thêm giờ"
  //   code={MODULE.HRMOVERTIME}
  //   api={API_OVERTIME}
  //   label="Chọn"
  //   customDislayKey={['timeStart', 'timeEnd', 'hrmEmployeeId.name', 'organizationUnit.name']}
  // />
}

const mapStateToProps = createStructuredSelector({
  addApprovePage: makeSelectAddApproveOverTime(),
  clientId: makeSelectClientId(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    onAddApprove: (data) => dispatch(addApproveOverTime(data)),
    onCleanUp: () => dispatch(cleanup()),
    onAddLoading: (data) => dispatch(addApproveAllIsLoading(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(AddApproveOverTime);
