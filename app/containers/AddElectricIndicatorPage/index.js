/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * AddElectricIndicatorPage
 *
 */

import {
  Content,
  DatePicker,
  Form,
  Icon,
  Input,
  Item,
  Label
} from 'native-base';
import React, { Fragment, memo, useEffect, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';

import { TouchableWithoutFeedback } from 'react-native';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import BackHeader from '../../components/Header/BackHeader';
import LoadingButton from '../../components/LoadingButton';
import ToastCustom from '../../components/ToastCustom';
import { useInput } from '../../utils/useInput';
import { clean, createElectricIndicator } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectAddElectricIndicatorPage from './selectors';

export function AddElectricIndicatorPage(props) {
  useInjectReducer({ key: 'addElectricIndicatorPage', reducer });
  useInjectSaga({ key: 'addElectricIndicatorPage', saga });

  const { route, navigation, addElectricIndicatorPage, onCreateElectricIndicator, onClean } = props;

  const { isLoading, createElectricIndicatorSuccess } = addElectricIndicatorPage;

  const [avatar, setAvatar] = useState('');
  const [isElectricIndicator, setIsElectricIndicator] = useState(true);
  const [hasParrent, setHasParent] = useState(false);
  const [custommerOption, setCustommerOption] = useState([]);

  const { value: name, bind: bindName, valid: validName, setValid: setValidName } = useInput('', c => c.length > 4);
  const { value: startDate, setValue: setStartDate, valid: validStartDate, setValid: setValidStartDate } = useInput('');
  const { value: endDate, setValue: setEndDate, valid: validEndDate, setValid: setValidEndDate } = useInput('');
  const { value: customer, setValue: setCustomer } = useInput(null);

  useEffect(() => {
    // const { task: parent } = route.params;

    // if (parent) {
    //   setIsElectricIndicator(false);
    //   setHasParent(true);
    // }

    // handleSearchTemplates();
    // handleSearchApprovers();
    // handleSearchEmployees();
    // handleSearchCustormers();
    return () => {
      onClean();
    };
  }, []);

  useEffect(() => {
    if (createElectricIndicatorSuccess) {
      ToastCustom({ text: 'Thêm mới thành công', type: 'success' });
      handleGoBack();
    } else if (createElectricIndicatorSuccess === false) {
      ({ text: 'Thêm mới thất bại', type: 'danger' });
    }
  }, [createElectricIndicatorSuccess]);

  // const pickupImage = () => {
  //   checkAndRequestPermission(DEVICE_PERMISSIONS.READ_EXTERNAL_STORAGE).then(
  //     async res => {
  //       if (res) {
  //         try {
  //           const file = await DocumentPicker.pick({
  //             type: [DocumentPicker.types.images],
  //           });
  //           if (file) {
  //             setAvatar(file);
  //           }
  //         } catch (error) { }
  //       } else {
  //         ({ text: 'Lỗi', type: 'danger' });
  //       }
  //     },
  //     () => {
  //       ToastCustom({ text: 'Lỗi', type: 'danger' });
  //     },
  //   );
  // };

  // const handleSearchCustormers = async () => {
  //   const url = `${await API_CUSTOMER()}`;
  //   handleSearch(url, setCustommerOption);
  // };

  // const handleSearchTemplates = async () => {
  //   handleSearch(await API_SAMPLE_PROCESS(), setTemplateOption);
  // };

  // const handleSearchEmployees = async () => {
  //   const url = `${await API_USERS()}`;
  //   handleSearch(url, setEmployeesOption);
  // };

  // const handleSearchApprovers = async () => {
  //   const url = `${APPROVE_URL}/api/approve-group`;
  //   handleSearch(url, setApproversOption);
  // };

  const checkValid = () => {
    let isValid = true;

    // const isValidName = name && name.trim().length >= 5;

    // setValidName(isValidName);
    // isValid = isValid && isValidName;

    // const isValidStartDate = startDate !== '';
    // setValidStartDate(isValidStartDate);
    // isValid = isValid && isValidStartDate;

    // const isValidEndDate = endDate !== '';
    // setValidEndDate(isValidEndDate);
    // isValid = isValid && isValidEndDate;
    return isValid;
  };

  const handleSubmit = () => {
    // if (checkValid()) {
    //   let task = {
    //     name: name.trim(),
    //     description,
    //     startDate: moment(startDate).format(),
    //     endDate: moment(endDate).format(),
    //     template,
    //     customer,
    //     approved,
    //     join,
    //     viewable,
    //     support,
    //     isObligatory: true,
    //     isElectricIndicator,
    //     priority,
    //     taskStatus,
    //     inCharge: [],
    //     progress: 0, //1
    //     file: [], //0
    //     type: 1, //1
    //     planerStatus: 1, //1
    //     ratio: '', //1
    //     parentId: '', //1
    //     kanbanStatus: 1, //1
    //     avatar: '', //1
    //     category: 1, //1,
    //     taskStage: 1,
    //   };
    //   if (!isElectricIndicator && hasParrent) {
    //     const { task: parent } = route.params;
    //     task.parentId = parent._id;
    //   }
    //   onCreateElectricIndicator({ task });
    //   return;
    // }
    // ToastCustom({ text: 'Mời điền đầy đủ thông tin', type: 'warning' });
  };

  const handleGoBack = () => {
    const { onGoBack } = route.params;

    navigation.goBack();
    if (onGoBack) {
      onGoBack();
    }
  };

  return (
    <Fragment>
      <BackHeader
        navigation={navigation}
        title={"Thêm số nước"}
        onGoBack={handleGoBack}
      />
      <Content>
        <Form style={{ flex: 1, backgroundColor: 'white' }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Item inlineLabel error={!validName}>
              <Label>Mặt bằng</Label>
              <Input placeholder="" style={{ textAlign: 'right', marginRight: 5 }} />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
            </Item>
          </TouchableWithoutFeedback>

          <Item inlineLabel>
            <Label>Khách hàng:</Label>
            <CustomMultiSelect
              single
              items={custommerOption}
              handleSelectItems={value => setCustomer(value[0])}
              selectedItems={customer ? [customer] : []}
              onRemoveSelectedItem={() => setCustomer(null)}
            />
          </Item>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Item inlineLabel error={!validName}>
              <Label>Chỉ số cũ</Label>
              <Input placeholder="" style={{ textAlign: 'right', marginRight: 5 }} />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
            </Item>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Item inlineLabel error={!validName}>
              <Label>Chỉ số mới</Label>
              <Input placeholder="" style={{ textAlign: 'right', marginRight: 5 }} />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
            </Item>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Item inlineLabel error={!validName}>
              <Label>Tiêu thụ</Label>
              <Input placeholder="" style={{ textAlign: 'right', marginRight: 5 }} />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
            </Item>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Item inlineLabel error={!validName}>
              <Label>Tổng tiền</Label>
              <Input placeholder="" style={{ textAlign: 'right', marginRight: 5 }} />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
            </Item>
          </TouchableWithoutFeedback>

          <Item inlineLabel error={!validStartDate}>
            <Label>Từ ngày:</Label>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <DatePicker
                locale={'vi'}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                onDateChange={date => {
                  setStartDate(date);
                  setValidStartDate(true);
                }}
                placeHolderText="Chọn ngày (Bắt buộc)"
                placeHolderTextStyle={{ flex: 1, color: 'gray' }}
              />

              <Icon name="calendar" style={{ fontSize: 20 }} />
            </View>
          </Item>

          <Item inlineLabel error={!validEndDate}>
            <Label>Đến ngày:</Label>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <DatePicker
                locale={'vi'}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                onDateChange={date => {
                  setEndDate(date);
                  setValidEndDate(true);
                }}
                placeHolderText="Chọn ngày (Bắt buộc)"
                placeHolderTextStyle={{ flex: 1, color: 'gray' }}
              />
              <Icon name="calendar" style={{ fontSize: 20 }} />
            </View>
          </Item>
        </Form>

        <LoadingButton isBusy={isLoading} block handlePress={() => { }}>
          <Icon name="plus" type="Entypo" />
        </LoadingButton>
      </Content>
    </Fragment >
  );
}

const mapStateToProps = createStructuredSelector({
  addElectricIndicatorPage: makeSelectAddElectricIndicatorPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateElectricIndicator: electricIndicator => dispatch(createElectricIndicator(electricIndicator)),
    onClean: () => dispatch(clean()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(AddElectricIndicatorPage);
