/* eslint-disable curly */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useCallback } from 'react';
import { BackHandler, DeviceEventEmitter, StyleSheet, Text,
  View } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Icon from 'react-native-vector-icons/Entypo';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectApprovePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getApprove, updateApprove, cleanup, updateCount } from './actions';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import BackHeader from '../../components/Header/BackHeader';
import ApprovalStatusView from './ApprovalStatusView';
import { API_APPROVE, API_MODULE_DYNAMIC } from '../../configs/Paths';
import { handleSearchAprove, serialize } from '../../utils/common';
import ListPage from '../../components/ListPage';
import _ from 'lodash';
import ApproveItem from './ApproveFlatList/ApproveItem';
import { getUserByIds } from '../../api/employees';
import FabLayout from '../../components/CustomFab/FabLayout';
import { getCoutApprove, getDataApprove } from '../../api/approve';
import BadgeView from './BadgeView';
import { makeSelectProfile } from '../App/selectors';
import request from '../../utils/request';
const Tab = createMaterialTopTabNavigator();
export function ApprovePage(props) {
  useInjectReducer({ key: 'approvePage', reducer });
  useInjectSaga({ key: 'approvePage', saga });

  const { approvePage, navigation, onCleanup, profile, onSetCount } = props;
  const { approveCount } = approvePage
  const { updateApproveSuccess } = approvePage;
  const [countApprove, setcountApprove] = useState()
  const [reload, setReload] = useState(0);
  const [updateApprove, setUpdateApprove] = useState()
  const [updateProjectCoubt, setUpdateProjectCount] = useState()

  useEffect(() => {
    const approveSuccessEvent = DeviceEventEmitter.addListener("approveSuccess", ({ approveStatus }) => {
      setUpdateApprove(approveStatus)
      setReload(e => e + 1)
      getCount(0)
      getCount(approveStatus)
      getModuleTitle()
    })

    getCount(0)
    getCount(1)
    getCount(2)

    const approveSuccessEventCout = DeviceEventEmitter.addListener("ApproveProject", ({ res }) => {
      setUpdateProjectCount(res)

    })

    return () => {
      approveSuccessEvent.remove()
      approveSuccessEventCout.remove
      onCleanup();
    };
  }, []);

  const getCount = async (approveType) => {
    const res = await getDataApprove({
      skip: 0,
      limit: 1,
      filter: { 'groupInfo.approve': approveType },
    })
    _.get(res, 'count') && onSetCount(approveType, _.get(res, 'count'));
  };


  useEffect(() => {
    getCoutApprove().then((e) => {
      setcountApprove(e)
    })
  }, [updateApprove, reload, updateProjectCoubt])

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

  const handleOpenModal = (item) => {
    navigation.navigate('ApproveDetail', { approve: item })
  };

  const customData = async ({ data }) => {
    let arr = []

    data.forEach((item) => {
      item.groupInfo.forEach((employee) => {
        arr.push(employee.person)
      })
    })
    arr = _.uniq(arr)
    const users = await getUserByIds(arr)

    data = data.map((item, index) => {
      return {
        ...item,
        groupInfo: item.groupInfo.map(it => {
          const found = users.find(user => user.userId === it.person) || {}
          return {
            ...it,
            name: found.name,
            avatar: found.avatar,
            gender: found.gender,
            order: Number.isInteger(it.order) ? it.order : index,
          }
        })
      }
    });

    return data.map((item) => ({
      ...item,
      approveStatus: <ApprovalStatusView groupInfo={item.groupInfo} approveIndex={item.approveIndex} />,
    }));
  };

  const getModuleTitle = async () => {
    console.log("ooooo");
    try {
      let url = `${await API_MODULE_DYNAMIC()}`;
      const body = { method: 'GET' };
      const response = await request(url, body);
      console.log(response);
      return response
    } catch (err) { }
    return {}
  }

  return (
    <View style={{flex: 1}}>
      <BackHeader navigation={navigation} title="Danh sách phê duyệt" />
      <Tab.Navigator tabBarOptions={{
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
        <Tab.Screen
         name='chờ phê duyệt'
          component={() =>{return <ListPage
            func={handleSearchAprove}
            query={{
              filter: {
                'groupInfo.approve': 0
              }
            }}
            reload={reload}
            customData={customData}
            api={API_APPROVE}
            itemComponent={({ item }) => <ApproveItem item={item} profile={profile} handleOpenModal={handleOpenModal} />}
          /> } }

          options={{
    tabBarLabel: ({ focused }) => (
      <View>
        <Text numberOfLines={1} style={{ fontSize: 14, color: focused ? 'white' : '#eee'  }}>
          Chờ phê duyệt
        </Text>
        <BadgeView type={0} countApprove={countApprove && countApprove.countNotApproved} />
      </View>
    ),
  }}
          >
          
        </Tab.Screen>
        <Tab.Screen
          name="Đã phê duyệt"
          component={() =>{return   <ListPage
            func={handleSearchAprove}
            query={{
              filter: {
                'groupInfo.approve': 1
              }
            }}
            reload={reload}
            customData={customData}
            api={API_APPROVE}
            itemComponent={({ item }) => <ApproveItem item={item} handleOpenModal={handleOpenModal} />}
          />}}
         options={{
    tabBarLabel: ({ focused }) => (
      <View>
        <Text numberOfLines={1} style={{ fontSize: 14, color: focused ? 'white' : '#eee' }}>Đã phê duyệt</Text>
              <BadgeView type={1} countApprove={countApprove && countApprove.countApproved} />
      </View>
   ),
  }}
/>
         
        <Tab.Screen
           name="Không phê duyệt"
          component={() =>{return  <ListPage
             func={handleSearchAprove}
             query={{
               filter: {
                 'groupInfo.approve': 2
               }
             }}
             reload={reload}
             customData={customData}
          api={API_APPROVE}
           itemComponent={({ item }) => <ApproveItem item={item} handleOpenModal={handleOpenModal} />}
           />}}
         options={{
    tabBarLabel: ({ focused }) => (
      <View>
        <Text numberOfLines={1} style={{ fontSize: 14, color: focused ? 'white' : '#eee' }}>không phê duyệt</Text>
            
      </View>
   ),
  }}  />
        
      </Tab.Navigator>
      <FabLayout onPress={() => navigation.navigate('AddApprovePage')} style={styles}>
        <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
      </FabLayout>
    </View>
  );
}

const mapStateToProps = createStructuredSelector({
  approvePage: makeSelectApprovePage(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetApprove: () => dispatch(getApprove()),
    onUpdateApprove: (approve, data) => dispatch(updateApprove(approve, data)),
    onSetCount: (type, count) => dispatch(updateCount(type, count)),
    onCleanup: () => dispatch(cleanup()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ApprovePage);
const styles = {
  position: 'absolute',
  bottom: 10,
  right: 10,
  width: 40,
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 50,
};