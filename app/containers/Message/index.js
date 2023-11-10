import React, { Fragment, useEffect, useState } from 'react';
import { Button, Container, Icon, Input, Item, Label, ListItem, Tab, TabHeading, Tabs, Text, View } from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
import Following from './Following';
import Converstion from './Converstion';
import Groups from './Groups';
import FirebaseChat from './FirebaseChat';
import { autoLogout } from '../../utils/autoLogout';
import { BackHandler } from 'react-native';

export default Message = (props) => {
    const { navigation } = props;

    useEffect(() => {
        navigation.addListener(
            'focus', () => {
                autoLogout()
            }
        );

    }, []);

    useEffect(() => {
        const backHandlerListener = BackHandler.addEventListener('hardwareBackPress',
          () => {
            navigation.goBack();
            return true;
          }
        );
        return () => {
          backHandlerListener.remove();
        }
    
      }, []);

    return <Container>
        <BackHeader title='Tin nhắn' navigation={navigation} />
        <Tabs>
            {/* <Tab heading={<TabHeading><Text>Firebase</Text></TabHeading>}>
                <FirebaseChat />
            </Tab> */}
            <Tab heading={<TabHeading><Text>Tin nhắn</Text></TabHeading>}>
                <Converstion />
            </Tab>
            <Tab heading={<TabHeading><Text>Nhóm</Text></TabHeading>} >
                <Groups />
            </Tab>
            <Tab heading={<TabHeading><Text>Theo dõi</Text></TabHeading>}>
                <Following />
            </Tab>
        </Tabs>
    </Container>
}