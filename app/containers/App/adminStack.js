import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, {useEffect, useState} from 'react';
import {DeviceEventEmitter} from 'react-native';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import theme from '../../utils/customTheme';
import {MODULE} from '../../utils/constants';
import CrmPage from '../CrmPage';
import DashBoardPage from '../DashBoardPage';
import HrmPage from '../HrmPage';
import LifeDriver from '../LifeDriver';
import NotificationPage from '../NotificationPage';
import ProjectPage from '../ProjectPage';
import {makeSelectHasDriver} from './selectors';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import {makeSelectClientId, makeSelectUserRole} from '../App/selectors';
import TextManagement from '../TextManagement';

const AdminTab = createMaterialBottomTabNavigator();
export function AdminStackScreen(props) {
  const {
    hrmRole,
    bosRole,
    filemanagerRole,
    taskRole,
    HrmTimekeepingTableRole,
    hasDriver,
    clientId,
  } = props;

  const [notifications, setNotifications] = useState({});
  const {isNotRead = 0} = notifications;

  useEffect(() => {
    const onNoti = DeviceEventEmitter.addListener(
      'notification',
      setNotifications,
    );
    return () => {
      onNoti.remove();
    };
  }, []);

  return (
    <AdminTab.Navigator
      initialRouteName="DashBoard"
      barStyle={{backgroundColor: theme.brandPrimary}}
    //   screenOptions={({route}) =>({
    //     tabBarLabel: ({ focused }) => {
    //       const routeName = getFocusedRouteNameFromRoute(route);
    //   if (focused || routeName === route.name) {
    //     return <Text style={{ color: 'blue' }}>{route.name}</Text>;
    //   } else {
    //     return null;
    //   }
    // }, 
    //   })}
      >
      <AdminTab.Screen
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({color}) => (
            <Icon
              name="home"
              type="FontAwesome"
              style={{color: color, fontSize: 30, marginTop: -5}}
            />
          ),
        }}
        name="DashBoard"
        component={DashBoardPage}
      />

      {!hrmRole.GET || !HrmTimekeepingTableRole.GET ? null : (
        <AdminTab.Screen
          options={{
            tabBarLabel: 'HRM',
            tabBarIcon: ({color}) => (
              <Icon
                name="users"
                type="FontAwesome"
                style={{color: color, fontSize: 20}}
              />
            ),
          }}
          name="Hrm"
          component={HrmPage}
        />
      )}

      {/* {!bosRole.GET ? null : <AdminTab.Screen
        options={{
          tabBarLabel: "CRM",
          tabBarIcon: ({ color }) => (
            <Icon name="call-split" type="MaterialIcons" style={{ color: color, fontSize: 25 }} />
          ),
        }}
        name="Crm"
        component={CrmPage}
      />} */}
      {/* <AdminTab.Screen
        options={{
          tabBarLabel: "Quản lí",
          tabBarIcon: ({ color }) => (
            <Icon name="office-building" type="MaterialCommunityIcons" style={{ color: color, fontSize: 25 }} />
          ),
        }}
        name="Apartment"
        component={ApartmentPage}
      /> */}
      {clientId !== 'HADO' ? null : (
        <AdminTab.Screen
          options={{
            tabBarLabel: 'ĐHVB',

            tabBarIcon: ({color}) => (
              <MaterialIcons
                name="description"
                type="MaterialIcons"
                style={{color: color, fontSize: 25, bottom: 3}}
              />
            ),
          }}
          name="TextManagement"
          component={TextManagement}
        />
      )}
      {!taskRole.GET ? null : (
        <AdminTab.Screen
          options={{
            tabBarLabel: 'Công việc',
            tabBarIcon: ({color}) => (
              <MaterialIcons
                name="business-center"
                type="MaterialIcons"
                style={{color: color, fontSize: 25, bottom: 3}}
              />
            ),
          }}
          name="Project"
          component={ProjectPage}
        />
      )}
      {!hasDriver || !filemanagerRole.GET ? null : (
        <AdminTab.Screen
          options={{
            // tabBarLabel: I18n.t('footer.other'),
            tabBarIcon: ({color}) => (
              <Ionicons
                name="folder-open-sharp"
                type="Ionicons"
                style={{color: color, fontSize: 20}}
              />
            ),
          }}
          name="LifeDriver"
          component={LifeDriver}
        />
      )}

      <AdminTab.Screen
        options={{
          tabBarLabel: 'Thông báo',
          tabBarIcon: ({color}) => (
            <MaterialIcons
              name="notifications"
              type="MaterialIcons"
              style={{color: color, fontSize: 20}}
            />
          ),
          tabBarBadge: isNotRead > 999 ? '999+' : isNotRead || null,
        }}
        name="Notification"
        component={NotificationPage}
      />

      {/* <AdminTab.Screen
        options={{
          tabBarLabel: I18n.t('footer.other'),
          tabBarIcon: ({ color }) => <Icon name="navicon" type="FontAwesome" style={{ color: color, fontSize: 20 }} />,
        }}
        name="Setting"
        component={SettingPage}
      /> */}
    </AdminTab.Navigator>
  );
}

export default connect(
  createStructuredSelector({
    hrmRole: makeSelectUserRole(MODULE.HRM),
    bosRole: makeSelectUserRole(MODULE.BOS),
    filemanagerRole: makeSelectUserRole(MODULE.FILEMANAGER),
    taskRole: makeSelectUserRole(MODULE.TASK),
    HrmTimekeepingTableRole: makeSelectUserRole(MODULE.HRMTIMEKEEPINGTABLE),
    hasDriver: makeSelectHasDriver(),
    clientId: makeSelectClientId(),
  }),
)(AdminStackScreen);
