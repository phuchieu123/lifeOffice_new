// import React, { useState, useEffect } from 'react';
// import { View, Tab, TabHeading, Tabs, Text  } from 'native-base';
// import CustomHeader from '../../components/Header';
// import { API_FILE_COMPANY, API_FILE_SHARE, API_FILE_USERS, } from '../../configs/Paths';
// import RenderPage from './components/RenderPage';
// import _ from 'lodash';

// export default function LifeDriver() {
//     return (
//         <View>
//             <CustomHeader title='Kho dữ liệu' />
//             <Tabs>
//                 <Tab heading={<TabHeading><Text>Công ty</Text></TabHeading>}>
//                     <RenderPage api={API_FILE_COMPANY} folder="company" allowAdd allowShare />
//                 </Tab>
//                 <Tab heading={<TabHeading><Text>Của tôi</Text></TabHeading>}>
//                     <RenderPage api={API_FILE_USERS} folder="users" allowAdd allowShare />
//                 </Tab>
//                 <Tab heading={<TabHeading><Text>Chia sẻ</Text></TabHeading>}>
//                     <RenderPage api={API_FILE_SHARE} folder="share" allowShare />
//                 </Tab>
//             </Tabs>
//         </View>
//     )
// }
import React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import RenderPage from './components/RenderPage';
import CustomHeader from '../../components/Header';
import { API_FILE_COMPANY, API_FILE_SHARE, API_FILE_USERS, } from '../../configs/Paths';

const Tab = createMaterialTopTabNavigator();

const LifeDriver = () => {
  return (
      <View style={{ flex: 1 }}>
        <CustomHeader title='Kho dữ liệu' />
        <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: 'rgba(46, 149, 46, 1)', // Màu nền của toàn bộ thanh tab
            borderTopWidth: 0.5,
            borderTopColor:'#aaa',
          },
          activeTintColor: 'white', // Màu chữ của tab đang được chọn
          inactiveTintColor: 'white', // Màu chữ của tab không được chọn
          indicatorStyle: {
            backgroundColor: 'white', // Màu của thanh dưới chữ khi tab được chọn
          },
        }}
        >
          <Tab.Screen
            name="Công ty"
            
            component={() => <RenderPage api={API_FILE_COMPANY} folder="company" allowAdd allowShare />}
          />
          <Tab.Screen
            name="Của tôi"
            component={() => <RenderPage api={API_FILE_USERS} folder="users" allowAdd allowShare />}
          />
          <Tab.Screen
            name="Chia sẻ"
            component={() => <RenderPage api={API_FILE_SHARE} folder="share" allowShare />}
          />
        </Tab.Navigator>
      </View>
  );
};

export default LifeDriver;