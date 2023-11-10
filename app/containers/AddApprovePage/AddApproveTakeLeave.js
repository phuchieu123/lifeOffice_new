
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Modal, StyleSheet, Alert } from 'react-native';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectAddApproveTakeLeave from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getApprove, updateApprove, cleanup, onleave } from './actions';
import { getProfile, getAppInfo } from '../../utils/authen';
import {
  Icon,
  Container,
  Input,
  Content,
  Item,
  Label,
  View,
  Spinner,
} from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
import moment from 'moment';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import CustomInput from '../../components/CustomInput';
import styles from './styles';
import { makeSelectClientId } from '../App/selectors';
import { API_APPROVE_GROUP, API_PERSONNEL, API_USERS } from '../../configs/Paths';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import _ from 'lodash';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import { getByIdHrm } from '../../api/hrmEmployee';
import ToastCustom from '../../components/ToastCustom';

export function AddApproveTakeLeave(props) {
  useInjectReducer({ key: 'addApprovePage', reducer });
  useInjectSaga({ key: 'addApprovePage', saga });
  const [error, setError] = useState({});
  const { navigation, hrmSource, clientId, onAddonLeave, addApprovePage } = props;
  const { isLoading, approveOnleaveSuccess } = addApprovePage


  const [localState, setLocalState] = useState({});
  const [profile, setProfile] = useState();
  const [isLoadingAll, setIsLoadingAll] = useState(false)
  const approveOnleaveSuccessRef = useRef(approveOnleaveSuccess)
  useEffect(() => {
    getProfile().then(setProfile)

  }, [])


  useEffect(() => {

    if (approveOnleaveSuccess) {
      if (approveOnleaveSuccessRef.current === true) {
        approveOnleaveSuccessRef.current = false
      } else {
        approveOnleaveSuccessRef.current = false
        setIsLoadingAll(true)
      }
    } else if (approveOnleaveSuccess === true && approveOnleaveSuccessRef.current === true) {

      setIsLoadingAll(true)
    }

  }, [approveOnleaveSuccess])

  useEffect(() => {
    if (isLoadingAll) {
      navigation.navigate('Approve');
      setIsLoadingAll(false)
    }
  }, [isLoadingAll])


  const { dateStart, dateEnd, shift, handover, group, reason } = localState;
  const [shiftsOption, setShiftsOption] = useState([{
    _id: "6007e2e41db4ac4f1b70ec30", title: "Nghỉ phép không lương", value: "ngh-php-khng-lng"

  },
  {
    _id: "6007e2e41db4ac4f1b70ec31", title: "Nghỉ phép", value: "Nghỉ phép"

  }]);


  const handleChange = (name, value) => {
    setLocalState({ ...localState, [name]: value });
  };

  const isValid = () => {
    let err = {}, warning = ''
    // if (!localData.dataInfo || !localData.dataInfo.length) err.dataInfo = true
    // if (!localData.name || !localData.name.trim()) err.name = true
    if (!localState.approveGroup || !localState.approveGroup.length) err.approveGroup = true

    // if (err.dataInfo) warning = `Bạn cần chọn thời gian bắt đầu và kết thúc`
    // if (err.name) warning = 'Bạn cần nhập Tên phê duyệt'
    if (err.approveGroup) warning = 'Bạn cần chọn Nhóm phê duyệt'



    if (!err.date && !err.toDate) {
      const isValidDate = moment(localState.date).isBefore(localState.toDate)

      if (!isValidDate) {
        warning = 'Ngày kết thúc phải sau ngày bắt đầu'
        err.date = true
        err.toDate = true
      }
    }

    setError(err)

    const valid = !Object.keys(err).length
    if (!valid) ToastCustom({ text: warning, type: 'danger' })
    return valid
  }
  const onSendOnLeave = async () => {
    if (!isValid()) return
    // const idHrm = await getByIdHrm(profile.hrmEmployeeId)
    const body = {
      hrmEmployeeId: localState.employee,
      organizationUnitId: "61a5fa4b0de8c72bcc72ed56",
      type: {
        _id: "6007e2e41db4ac4f1b70ec30", title: "Nghỉ phép không lương", value: "ngh-php-khng-lng"

      },
      description: localState.reason,
      approveGroup: localState && localState.approveGroup ? localState.approveGroup : null,
      toDate: localState.toDate,
      date: localState.date,
      handover: localState.handover
    }
    onAddonLeave(body)

  }



  return (
    <Container>
      <BackHeader
        navigation={navigation}
        title="Nghỉ phép"
        rightHeader={
          isLoading
            ? <Spinner />
            :
            <Icon active name="send" onPress={onSendOnLeave} style={{ color: '#fff' }} />
        } />

      <Content>
        <Item inlineLabel>
          <Label>Nhân viên:</Label>
          <SingleAPISearch
            API={API_PERSONNEL}
            selectedItems={localState.handover}
            onSelectedItemsChange={(e) => handleChange('handover ', e)}
            onRemove={() => handleChange('handover ', null)}
            filterOr={['name', 'code', 'phoneNumber']}
          />
        </Item>
        <Item inlineLabel>
          <Label>Người bàn giao:</Label>
          <SingleAPISearch
            API={API_PERSONNEL}
            selectedItems={localState.employee}
            onSelectedItemsChange={(e) => handleChange('employee', e)}
            onRemove={() => handleChange('employee', null)}
            filterOr={['name', 'code', 'phoneNumber']}
          />
        </Item>
        <Item inlineLabel error={error.date}>
          <Label>Từ ngày:</Label>
          <DateTimePicker
            mode="date"
            onSave={(e) => handleChange('date', e)}
            value={localState.date && moment(localState.date).format('DD/MM/YYYY HH:mm').toString()}
          />
        </Item>
        <Item inlineLabel error={error.toDate}>
          <Label>Đến ngày:</Label>
          <DateTimePicker
            mode="date"
            onSave={(e) => handleChange('toDate', e)}
            value={localState.toDate && moment(localState.toDate).format('DD/MM/YYYY HH:mm').toString()}
          />
        </Item>


        <CustomInput inlineLabel label="Loại nghỉ phép">
          <CustomMultiSelect
            single
            items={shiftsOption}
            handleSelectItems={(value) => handleChange('shift', value[0])}
            selectedItems={shift ? [shift] : []}
            canRemove={false}
            displayKey="title"
          />
        </CustomInput>

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
            selectedItems={_.get(localState, 'approveGroup[0]._id')}
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
  addApprovePage: makeSelectAddApproveTakeLeave(),
  clientId: makeSelectClientId()
});

function mapDispatchToProps(dispatch) {
  return {
    onAddonLeave: (data) => dispatch(onleave(data)),
    onCleanUp: () => dispatch(cleanup()),


  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(AddApproveTakeLeave);
