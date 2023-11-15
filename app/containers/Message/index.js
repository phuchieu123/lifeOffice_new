// import React, { Fragment, useEffect, useState } from 'react';
// import { Button, Container, Icon, Input, Item, Label, ListItem, Tab, TabHeading, Tabs, Text, View } from 'native-base';
// import BackHeader from '../../components/Header/BackHeader';
// import Following from './Following';
// import Converstion from './Converstion';
// import Groups from './Groups';
// import FirebaseChat from './FirebaseChat';
// import { autoLogout } from '../../utils/autoLogout';
// import { BackHandler } from 'react-native';

// export default Message = (props) => {
//     const { navigation } = props;

//     useEffect(() => {
//         navigation.addListener(
//             'focus', () => {
//                 autoLogout()
//             }
//         );

//     }, []);

//     useEffect(() => {
//         const backHandlerListener = BackHandler.addEventListener('hardwareBackPress',
//           () => {
//             navigation.goBack();
//             return true;
//           }
//         );
//         return () => {
//           backHandlerListener.remove();
//         }
    
//       }, []);

//     return <Container>
//         <BackHeader title='Tin nhắn' navigation={navigation} />
//         <Tabs>
//             {/* <Tab heading={<TabHeading><Text>Firebase</Text></TabHeading>}>
//                 <FirebaseChat />
//             </Tab> */}
//             <Tab heading={<TabHeading><Text>Tin nhắn</Text></TabHeading>}>
//                 <Converstion />
//             </Tab>
//             <Tab heading={<TabHeading><Text>Nhóm</Text></TabHeading>} >
//                 <Groups />
//             </Tab>
//             <Tab heading={<TabHeading><Text>Theo dõi</Text></TabHeading>}>
//                 <Following />
//             </Tab>
//         </Tabs>
//     </Container>
// }


import React, {Fragment, useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import BackHeader from '../../components/Header/BackHeader';
import Following from './Following';
import Converstion from './Converstion';
import Groups from './Groups';
import FirebaseChat from './FirebaseChat';
import {autoLogout} from '../../utils/autoLogout';
import {BackHandler} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
export default Message = props => {
  const {navigation} = props;

  useEffect(() => {
    navigation.addListener('focus', () => {
      autoLogout();
    });
  }, []);

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

  return (
    <View style={{ flex: 1 }}>
      <BackHeader title="Tin nhắn" navigation={navigation} />
      <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: 'rgba(46, 149, 46, 1)', // Màu nền của toàn bộ thanh tab
            borderTopWidth: 0.5,
            borderTopColor: '#aaa',
          },
          activeTintColor: 'white', // Màu chữ của tab đang được chọn
          inactiveTintColor: 'white', // Màu chữ của tab không được chọn
          indicatorStyle: {
            backgroundColor: 'white', // Màu của thanh dưới chữ khi tab được chọn
          },
        }}>
        {/* <Tab heading={<TabHeading><Text>Firebase</Text></TabHeading>}>
                <FirebaseChat />
            </Tab> */}
        <Tab.Screen name="Tin nhắn" component={() => <Converstion />} />
        <Tab.Screen name="Nhóm" component={() => <Groups />} /> 

        <Tab.Screen name="Theo dõi" component={() => <Following />} />
      </Tab.Navigator>
    </View>
  );
};
