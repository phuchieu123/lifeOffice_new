import React, { memo } from 'react';

import { Button, Icon, Text, List, ListItem, Left, Right, View } from 'native-base';
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
    <List style={{ marginBottom: 5 }}>
      {customer.name ? (
        <ListItem>
          <Left>
            <Text>{customer.name}</Text>
          </Left>
          <Right>
            <Button small iconLeft transparent color="info">
              <Icon name="user" type="FontAwesome" />
            </Button>
          </Right>
        </ListItem>
      ) : null}
      {customer.phoneNumber ?
        (<ListItem>
          <Left>
            <Text>{customer.phoneNumber.length > 0 ? customer.phoneNumber : "Chưa có số điện thoại"}</Text>
          </Left>
          <Right>
            <Button small iconLeft transparent onPress={() => handlePhoneCall(customer.phoneNumber)}>
              <Icon name="phone" type="FontAwesome" />
            </Button>
          </Right>
        </ListItem>)
        : null}

      {customer.email ?
        (<ListItem>
          <Left>
            <Text>{customer.email.length > 0 ? customer.email : "Chưa có email"}</Text>
          </Left>
          <Right>
            <Button small iconLeft transparent onPress={() => handleSendEmail(customer.email)}>
              <Icon name="envelope" type="FontAwesome" />
            </Button>
          </Right>
        </ListItem>)
        : null}

    </List>
  );
}

export default CustomerInfo;
