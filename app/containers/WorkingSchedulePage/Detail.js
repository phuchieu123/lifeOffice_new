import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import {Text, View, ScrollView, TextInput, BackHandler} from 'react-native';
import {compose} from 'redux';
import {useInjectSaga} from '../../utils/injectSaga';
import {useInjectReducer} from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import FabLayout from '../../components/CustomFab/FabLayout';
import Icon from 'react-native-vector-icons/Entypo';
import ToastCustom from '../../components/ToastCustom';
import * as actions from './actions';
import _ from 'lodash';
import makeSelectMeetingSchedulePage from './selectors';
import BackHeader from '../../components/Header/BackHeader';
import FileView from '../../components/FileView';
import {MODULE, REQUEST_METHOD} from '../../utils/constants';
import {
  makeSelectUserRole,
  makeSelectViewConfig,
  makeSelectProfile,
} from '../App/selectors';
import DocumentPicker from 'react-native-document-picker';
import {addFile} from '../../api/fileSystem';
import CalenderForm from './components/CalenderForm';
import {get} from '../../api/metting';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
export function MeetingScheduleDetailPage(props) {
  useInjectReducer({key: 'workingSchedulePage', reducer});
  useInjectSaga({key: 'workingSchedulePage', saga});

  const {navigation, route} = props;
  const {params} = route;

  const [localData, setLocaldata] = useState({});
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState();
  const [body, setBody] = useState({
    method: REQUEST_METHOD.POST,
    body: {
      action: 'read',
      data: [],
      path: '/',
      showHiddenItems: false,
    },
  });

  const id = _.get(params, 'item._id');

  useEffect(() => {
    if (id) {
      setLoading(true);
      get(id).then(res => {
        setLocaldata(res);
        setLoading(false);
      });
    }
  }, [params]);

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

  const handleReload = () => setReload(reload + 1);

  const handleAddFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      await addFile({
        folder: 'users',
        clientId: '20_CRM',
        path: body.body.path,
        code: 'Calendar',
        file: res[0],
        id,
        fname: 'root',
      });
      ToastCustom({text: 'Thêm mới thành công', type: 'success'});
      handleReload();
    } catch (err) {
      ToastCustom({text: 'Thêm mới không thành công', type: 'danger'});
    }
  };

  return (
    <View style={{flex: 1}}>
      <BackHeader
        title={id ? localData.name : 'Thêm mới lịch công tác'}
        navigation={navigation}
      />
      {!id ? (
        <CalenderForm />
      ) : (
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
          <Tab.Screen
            name="Chi Tiết"
            component={() => (
              <CalenderForm id={id} meeting={localData} loading={loading} />
            )}
          />

          <Tab.Screen
            name="Tài Liệu"
            component={() => (
              <View style={{flex: 1}}>
                <FileView
                  id={id}
                  code={'Calendar'}
                  visible={true}
                  reload={reload}
                />
                <FabLayout
                  style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 50,
                  }}
                  onPress={() => (loading ? '' : handleAddFile())}>
                  <Icon type="Entypo" name="plus" style={{color: '#fff'}} />
                </FabLayout>
              </View>
            )}
          />
        </Tab.Navigator>
      )}
    </View>
  );
}

const mapStateToProps = createStructuredSelector({
  meetingDetailPage: makeSelectMeetingSchedulePage(),
  calendarConfig: makeSelectViewConfig(MODULE.CALENDAR),
  calenderRole: makeSelectUserRole(MODULE.CALENDAR),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    mapMeeting: props => dispatch(actions.getMeetingSchelude(props)),
    onClean: () => dispatch(actions.onClean()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MeetingScheduleDetailPage);
