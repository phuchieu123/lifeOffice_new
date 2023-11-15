import moment from 'moment';
import { Container} from 'native-base';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, Text, View, } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import RightHeader from '../../components/CustomFilter/RightHeader';
import CustomHeader from '../../components/Header';
import { getAvatar } from '../../utils/common';
import {
  makeSelectHasApprove,
  makeSelectKanbanBosConfigs,
  makeSelectKanbanTaskConfigs,
  makeSelectProfile,Message,
  makeSelectSocket,
  makeSelectUserRole,
} from '../App/selectors';
import selectSettingPageDomain from '../SettingPage/selectors';
import DashBoardBos from './DashBoardBos';
import DashBoardTask from './DashBoardTask';
import IncomingDocument from './IncomingDocument';
import ManageDocument from './ManageDocument';
import MeetingSchedule from './MeetingSchedule';
import WorkingSchedule from './WorkingSchedule';
import reducer from './reducer';
import saga from './saga';
import makeSelectDashBoardPage from './selectors';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import { getDataApprove } from '../../api/approve';
import { getIncomingDocument } from '../../api/documentary';
import { RenderBanner } from '../../components/RenderBanner';
import { API_PROFILE } from '../../configs/Paths';
import { autoLogout } from '../../utils/autoLogout';
import { MODULE } from '../../utils/constants';
import request from '../../utils/request';
import { makeSelectClientId } from '../App/selectors';
import makeSelectApprovePage from '../ApprovePage/selectors';

const DATE_FORMAT = 'YYYY-MM-DD';

export function DashBoardPage(props) {
  const DEFAULT_QUERY = {
    startDate: `${moment().startOf('month').format(DATE_FORMAT)}`,
    endDate: `${moment().endOf('month').format(DATE_FORMAT)}`,
    dashboard: true,
  };

  useInjectReducer({ key: 'dashBoardPage', reducer });
  useInjectSaga({ key: 'dashBoardPage', saga });

  const {
    kanbanTaskConfigs,
    kanbanBosConfigs,
    navigation,
    bosRole,
    taskRole,
    documentaryRole,
    calendarRole,
    customerRole,
    inComingDocumentRole,
    outGoingDocumentRole,
    profile,
    hasApprove,
    approvePage,
    socket,
    clientId
  } = props;

  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [incomingData, setIncomingData] = useState();
  const [outgoingData, setOutgoingData] = useState();
  const [countApprove, setCountApprove] = useState();

  const [avatarProfile, setAvatarProfile] = useState({})

  const getProfile = async () => {
    try {
      let url = `${await API_PROFILE()}`;
      const body = { method: 'GET' };
      const response = await request(url, body);

      if (response._id) {
        setAvatarProfile(response);
      }
    } catch (err) { }
  }

  useEffect(() => {
    navigation.addListener(
      'focus', () => {
        getSomeData();
        getProfile();
        autoLogout()
      }
    );

  }, []);

  const getSomeData = useCallback(async () => {
    hasApprove && getDataApprove({ filter: { 'groupInfo.approve': 0, }, limit: 1, skip: 0, }).then(result => _.get(result, 'count') && setCountApprove(result.count))
    inComingDocumentRole.GET && getIncomingDocument({ limit: 1, skip: 0, filter: { type: 2 } }).then(result => _.get(result, 'count') && setIncomingData(result.count))
    outGoingDocumentRole.GET && getIncomingDocument({ limit: 1, skip: 0, filter: { type: 1 } }).then(result => _.get(result, 'count') && setOutgoingData(result.count))
  }, [])

  const handleFilter = (obj) => {
    setQuery(e => ({ ...e, ...obj }))
  }

  return (
   
    <View style={{paddingBottom: 100}}>
      <CustomHeader title="Trang chủ" 
        rightHeader={
          <RightHeader
            enableFilterModal
            enableFilterOrg
            organizationUnitId={query.organizationUnitId}
            enableFilterEmp
            employeeId={_.get(query, 'filter.inCharge')}
            enableDatePicker
            startDate={query.startDate}
            endDate={query.endDate}
            onSave={handleFilter} 
          />
        }
      />
      <View style={{backgroundColor: '#eee' }}>
        <ScrollView>
          <View style={{ flex: 1, backgroundColor: '#99CC99', paddingBottom: 0 }}>
            <Image
              resizeMode="contain"
              source={getAvatar(avatarProfile.avatar, profile.gender)}
              style={{
                flex: 1,
                margin: 10,
                width: 120,
                height: 120,
                alignSelf: 'center',
                resizeMode: 'cover',
                borderRadius: 75,
                
              }}
            />
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 0, marginBottom: 40 }}>
              <Text style={{color: 'white', fontSize:18}} >{profile.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10, right: 0 }}>
              <MaterialIcons name='chat' onPress={() => navigation.navigate('Message')} style={{ paddingRight: 10, fontSize: 30, color: '#fff' }} />
              <Icon onPress={() => navigation.navigate('SettingPage')} name='user-circle' type='FontAwesome' style={{ paddingRight: 10, fontSize: 30, color: '#fff' }} />
              <Ionicons onPress={() => navigation.navigate('FingerprintUser')} name='settings' type='Ionicons' style={{ paddingRight: 10, fontSize: 30, color: '#fff' }} />
            </View>
          </View>
          <View padder style={styles.wrapper}>
            <View style={styles.view}>
              {hasApprove &&
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Approve')}>
                  <MaterialIcons
                    name="playlist-add-check"
                    type="MaterialIcons"
                    style={{ textAlign: 'center', fontSize: 40, color: 'green', margin: 10 }}
                  />
                  <Text style={{ color: 'black', margin: 10, textAlign: 'center' }}>Phê duyệt</Text>
                  <Badge count={_.has(approvePage, 'approveCount[0].count') ? _.get(approvePage, 'approveCount[0].count') : countApprove} />
                </TouchableOpacity>
              }

              {!customerRole.GET ? null : <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CustomerDetails')}>
                <Icon5
                  name="users"
                  type="FontAwesome5"
                  style={{ textAlign: 'center', fontSize: 40, color: 'green', margin: 10 }}
                />
                <Text style={{ color: 'black', margin: 10, textAlign: 'center' }}>Khách hàng</Text>
              </TouchableOpacity>
              }

            </View>
            <View style={styles.view}>
              {!inComingDocumentRole.GET ? null :
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Officialdispatch', { type: 2 })} >
                  <MaterialCommunityIcons
                    name="clipboard-arrow-down"
                    type="MaterialCommunityIcons"
                    style={{ textAlign: 'center', fontSize: 40, color: 'green', margin: 10 }}
                  />
                  <Text style={{ color: 'black', margin: 10, textAlign: 'center' }}>Công văn đến</Text>
                  <Badge count={incomingData} />
                </TouchableOpacity>
              }

              {!outGoingDocumentRole.GET ? null :
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Officialdispatch', { type: 1 })}>
                  <MaterialCommunityIcons
                    name="clipboard-arrow-up"
                    type="MaterialCommunityIcons"
                    style={{ textAlign: 'center', fontSize: 40, color: 'green', margin: 10 }}
                  />
                  <Text style={{ color: 'black', margin: 10, textAlign: 'center' }}>Công văn đi</Text>
                  <Badge count={outgoingData} />
                </TouchableOpacity>
              }

            </View>
            <View style={styles.view}>
              {(clientId !== 'HADO') ? null :
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TextManagement', { type: 0 })} >
                  <Icon
                    name="clipboard-arrow-down"
                    type="MaterialCommunityIcons"
                    style={{ textAlign: 'center', fontSize: 40, color: 'green', margin: 10 }}
                  />
                  <Text style={{ color: 'black', margin: 10, textAlign: 'center' }}>Văn bản đến</Text>
                  <Badge count={incomingData} />
                </TouchableOpacity>
              }

              {(clientId !== 'HADO') ? null :
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TextManagement', { type: 1 })}>
                  <Icon
                    name="clipboard-arrow-up"
                    type="MaterialCommunityIcons"
                    style={{ textAlign: 'center', fontSize: 40, color: 'green', margin: 10 }}
                  />
                  <Text style={{ color: 'black', margin: 10, textAlign: 'center' }}>Văn bản đi</Text>
                  <Badge count={outgoingData} />
                </TouchableOpacity>
              }

            </View> 

            <RenderBanner viewStyle={{ height: 180, borderRadius: 20, margin: 5 }} />
            {(clientId !== 'HADO') ? null : <ManageDocument navigation={navigation} incomingData={incomingData} outgoingData={outgoingData} />}
            {!bosRole.GET ? null : <DashBoardBos navigation={navigation} kanbanBosConfigs={kanbanBosConfigs} query={query} />}
            {!taskRole.GET ? null : <DashBoardTask navigation={navigation} kanbanTaskConfigs={kanbanTaskConfigs} query={query} />}
            {!inComingDocumentRole.GET ? null : <IncomingDocument />}
            {!calendarRole.GET ? null : <MeetingSchedule />}
            {!calendarRole.GET ? null : <WorkingSchedule profile={profile} />}
          </View>
        </ScrollView>
      </View>
      {/* <CustomFooter /> */}
    </View>
  );
}


const mapStateToProps = createStructuredSelector({
  dashBoardPage: makeSelectDashBoardPage(),
  profile: makeSelectProfile(),
  kanbanTaskConfigs: makeSelectKanbanTaskConfigs(),
  kanbanBosConfigs: makeSelectKanbanBosConfigs(),
  settingPage: selectSettingPageDomain(),
  bosRole: makeSelectUserRole(MODULE.BOS),
  taskRole: makeSelectUserRole(MODULE.TASK),
  documentaryRole: makeSelectUserRole(MODULE.DOCUMENTARY),
  calendarRole: makeSelectUserRole(MODULE.CALENDAR),
  customerRole: makeSelectUserRole(MODULE.CUSTOMER),
  inComingDocumentRole: makeSelectUserRole(MODULE.INCOMINGDOCUMENT),
  outGoingDocumentRole: makeSelectUserRole(MODULE.OUTGOINGDOCUMENT),
  hasApprove: makeSelectHasApprove(),
  approvePage: makeSelectApprovePage(),
  socket: makeSelectSocket(),
  clientId: makeSelectClientId(),
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(DashBoardPage);

const Badge = ({ count }) => {
  return !count ? null :
    <View style={{ position: 'absolute', bottom: 80, right: 0, backgroundColor: 'red', padding: 0, borderRadius: 20, color: '#fff', width: 40, alignItems: 'center', height: 25, top: 0 }}>
      <Text style={{ color: '#fff' }}>{count <= 99 ? count : '99+'}
      </Text>
    </View>
}

const styles = {
  container: {
    height: 'auto',
  },
  videoContainer: {

    height: 140,
    backgroundColor: 'black',
    borderRadius: 20
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  wrapper: {
    paddingTop: 5, 
    paddingBottom : 10,
    // flex: 1,
    paddingRight: 5,
    paddingLeft: 5,
    height: 'auto',
    // alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    backgroundColor: '#cccccc',
    
    // borderRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    
    

  },
  view: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    height: 'auto',
    borderRadius: 15,
    backgroundColor: 'white',
    margin: 3,
    paddingVertical: 5,
  },
  textButton: { color: 'black', margin: 10, fontSize: 30, fontWeight: 'bold' },
  textNote: { color: 'black', margin: 10, fontSize: 12 },
};
