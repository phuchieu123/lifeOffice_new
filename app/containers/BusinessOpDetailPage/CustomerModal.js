/* eslint-disable react-native/no-inline-styles */
import React, { memo, useEffect, useState } from 'react';
import Modal from 'react-native-modal';

import { View, Card, CardItem, Button, Icon, Form, Label, Input, Item, Text, Root, ActionSheet } from 'native-base';
import LoadingButton from '../../components/LoadingButton';
import { useInput } from '../../utils/useInput';
import { checkPhoneNumber } from 'utils/common';
import ToastCustom from 'components/ToastCustom';
import { TextInput } from 'react-native';
function LogModal(props) {
  const { open, isCustomerLoading, onCreateCustomer, onClose } = props;
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open]);

  const handleCreateCustomer = async ({ allowCreate = false }) => {
    if (isLoading) {
      return;
    }

    setIsloading(true);

    try {
      if (checkValidCusomter()) {
        const result = await checkPhoneNumber({ phoneNumber: customerPhone.trim() });
        if (!allowCreate) {
          if (result === null) {
            ToastCustom({ text: 'Lỗi hệ thống', type: 'danger' });
            setIsloading(false);
            return;
          }

          if (result === true) {
            ActionSheet.show(
              {
                options: ['Xác nhận', 'Hủy'],
                title: 'Số điện thoại đã bị trùng, tiếp tục lưu?',
              },
              (buttonIndex) => {
                if (buttonIndex === 0) {
                  handleCreateCustomer({ allowCreate: true });
                }
              },
            );
            setIsloading(false);
            return;
          }
        }
      }



      const newCustomer = {
        // code: customerCode,
        name: customerName.trim(),
        phoneNumber: customerPhone.trim(),
        email: customerEmail.trim(),
        address: customerAddress.trim(),
        idetityCardNumber: idetityCardNumber.trim(),
      };
      onCreateCustomer(newCustomer);

    } catch (err) {
      // ToastCustom({ text: 'Lỗi hệ thống', type: 'danger' });
    }
    setIsloading(false);
  };
  // validate = (text) => {
  //   let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  //   if (reg.test(text) === false) {
  //     this.setState({ email: text })
  //     return false;
  //   }
  //   else {
  //     this.setState({ email: text })
  //   }
  // }

  const reset = () => {
    resetCustomerCode();
    resetCustomerName();
    resetCustomerEmail();
    resetCustomerPhone();
    resetCustomerAddress();
    resetIdetityCardNumber();
  };

  const {
    value: customerCode,
    bind: bindCustomerCode,
    valid: validCustomerCode,
    setValid: setValidCustomerCode,
    reset: resetCustomerCode,
  } = useInput('');
  const {
    value: customerName,
    bind: bindCustomerName,
    valid: validCustomerName,
    setValid: setValidCustomerName,
    reset: resetCustomerName,
  } = useInput('');
  const {
    value: customerEmail,
    bind: bindCustomerEmail,
    valid: validCustomerEmail,
    setValid: setValidCustomerEmail,
    reset: resetCustomerEmail,
  } = useInput('');
  const {
    value: customerPhone,
    bind: bindCustomerPhone,
    valid: validCustomerPhone,
    setValid: setValidCustomerPhone,
    reset: resetCustomerPhone,
  } = useInput('');
  const { value: customerAddress, bind: bindCustomerAddress, reset: resetCustomerAddress } = useInput('');
  const {
    value: idetityCardNumber,
    bind: bindIdetityCardNumber,
    valid: validIdetityCardNumber,
    setValid: setValidIdetityCardNumber,
    reset: resetIdetityCardNumber,
  } = useInput('');

  const checkValidCusomter = () => {
    let isValid = true;

    const isValidCustomerName = customerName && customerName.trim().length >= 5;

    setValidCustomerName(isValidCustomerName);
    isValid = isValid && isValidCustomerName;

    const isValidIdetityCardNumber = idetityCardNumber !== '' && idetityCardNumber.length <= 13;
    setValidIdetityCardNumber(isValidIdetityCardNumber);
    isValid = isValid && isValidIdetityCardNumber;

    const isValidcustomerPhone = customerPhone && customerPhone.length <= 13;
    setValidCustomerPhone(isValidcustomerPhone)
    isValid = isValid && isValidcustomerPhone;
    // const isValidCustomerCode = customerCode !== '';
    // setValidCustomerCode(isValidCustomerCode);
    // isValid = isValid && isValidCustomerCode;

    // const isValidCustomerPhone = customerPhone !== '';
    // setValidCustomerPhone(isValidCustomerPhone);
    // isValid = isValid && isValidCustomerPhone;

    // const isValidCustomerEmail = customerEmail !== '';
    // setValidCustomerEmail(isValidCustomerEmail);
    // isValid = isValid && isValidCustomerEmail;

    if (customerName.trim().length < 5) {
      ToastCustom({ text: 'Tên khách hàng phải có tối thiểu 5 kí tự', type: 'danger' });
    }

    else if (!isValidIdetityCardNumber) {
      ToastCustom({ text: 'Số CMND/CCCD không được để trống ', type: 'danger' });
    }

    else if (!isValidcustomerPhone) {
      ToastCustom({ text: 'Số điện thoại không được để trống', type: 'danger' });
    }
    return isValid;
  };

  return (
    <Modal isVisible={open} style={{}}>
      <Card>
        <Button full disabled primary>
          <Text uppercase style={{ textAlign: 'center', fontSize: 18 }}>
            Khách hàng mới
          </Text>
        </Button>
        <CardItem>
          <Form style={{ flex: 1, backgroundColor: 'white' }}>
            {/* <Item floatingLabel fixedLabel error={!validCustomerCode}>
              <Label>Mã khách hàng</Label>
              <Input {...bindCustomerCode} placeholder="Bắt buộc" placeholderTextColor="red" />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
            </Item> */}

            <Item floatingLabel fixedLabel error={!validCustomerName} style={styles.item}>
              <Label>Tên khách hàng</Label>
              <Input {...bindCustomerName} placeholder="Tối thiểu 5 kí tự" placeholderTextColor="red" multiline={true}  />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
            </Item>

            <Item floatingLabel fixedLabel error={!validIdetityCardNumber} style={styles.item}>
              <Label>Số CMND/CCCD</Label>
              <Input {...bindIdetityCardNumber} placeholder="Bắt buộc" placeholderTextColor="red" keyboardType="decimal-pad" maxLength={13} />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />

            </Item>

            <Item floatingLabel fixedLabel error={!validCustomerPhone} style={styles.item}>
              <Label>Số điện thoại</Label>
              <Input
                {...bindCustomerPhone}
                placeholder="Bắt buộc"
                placeholderTextColor="red"
                keyboardType="decimal-pad"
                maxLength={13}
              />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
            </Item>

            <Item floatingLabel fixedLabel error={!validCustomerEmail} style={styles.item}>
              <Label>Email</Label>
              <Input {...bindCustomerEmail} placeholder="Bắt buộc" placeholderTextColor="red" multiline={true}  />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
            </Item>

            <Item floatingLabel fixedLabel style={styles.item}>
              <Label>Địa chỉ</Label>
              <Input multiline={true} {...bindCustomerAddress} />
              <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
            </Item>

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <LoadingButton
                block
                isBusy={isCustomerLoading || isLoading}
                handlePress={handleCreateCustomer}
                style={{ flex: 1, marginRight: 10, borderRadius: 10 }}>
                <Icon name="check" type="Feather" />
              </LoadingButton>
              <Button block onPress={onClose} full style={{ flex: 1, borderRadius: 10 }} warning>
                <Text style={{ fontWeight: 'bold', fontSize: 22 }}>
                  <Icon name="close" type="AntDesign" style={{ color: '#fff' }} />
                </Text>
              </Button>
            </View>
          </Form>
        </CardItem>
      </Card>
    </Modal>
  );
}

const styles = {
  item: {
    marginBottom: 0,
    marginTop: 5,
  },
};
export default memo(LogModal);
