import React, { memo } from 'react';
import {View, Text } from 'react-native';
import { Linking } from 'react-native';

function CustomerInfo({ customer, onCreateLog }) {
  const handlePhoneCall = async phone => {
    // const profile = await getProfile();

    // const employee = {
    //   employeeId: profile._id,
    //   name: profile.name,
    // };
    // const data = {
    //   content: `Gọi đến ${Number(phone)}`,
    //   employee,
    //   objectId: businessOpDetail._id,
    //   type: 'call',
    // };
    // onCreateLog(data);
    Linking.openURL(`tel:${Number(phone)}`);
  };

  const handleSendEmail = email => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={{ marginBottom: 5, flex: 1 }}>
      {customer.name ? (
        <View>
          <View>
            <Text>{customer.name}</Text>
          </View>
          <View>
            <Button small iconLeft transparent color="info">
              <Icon name="user" type="FontAwesome" />
            </Button>
          </View>
        </View>
      ) : null}
      {customer.phoneNumber ?
        (<View>
          <View>
            <Text>{customer.phoneNumber.length > 0 ? customer.phoneNumber : "Chưa có số điện thoại"}</Text>
          </View>
          <View>
            <Button small iconLeft transparent onPress={() => handlePhoneCall(customer.phoneNumber)}>
              <Icon name="phone" type="FontAwesome" />
            </Button>
          </View>
        </View>)
        : null}

      {customer.email ?
        (<View>
          <View>
            <Text>{customer.email.length > 0 ? customer.email : "Chưa có email"}</Text>
          </View>
          <View>
            <Button small iconLeft transparent onPress={() => handleSendEmail(customer.email)}>
              <Icon name="envelope" type="FontAwesome" />
            </Button>
          </View>
        </View>)
        : null}

    </View>
  );
}

export default CustomerInfo;
