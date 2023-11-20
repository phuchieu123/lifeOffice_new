import React, { memo, useEffect, useState } from 'react';
import { BackHandler, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import IconMate from 'react-native-vector-icons/MaterialIcons';
import IconIon from 'react-native-vector-icons/Ionicons';

import {
  Body,
  Button,
  Container,
  Content,
  Text
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import BackHeader from '../../components/Header/BackHeader';
import { getData } from '../../utils/storage';
import makeSelectGlobal from '../App/selectors';
import reducer from './reducer';
import saga from './saga';
import makeSelectTimeKeepingPage from './selectors';
import styles from './styles';

const TimeKeepingPage = (props) => {
  useInjectReducer({ key: 'timeKeepingPage', reducer });
  useInjectSaga({ key: 'timeKeepingPage', saga });

  const { navigation } = props;
  const [profile, setProfile] = useState({});
  useEffect(() => {
    getData('profile').then((currentProfile) => {
      if (currentProfile) {
        setProfile(currentProfile);
      }
    });
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

  return (
    <View style={{flex: 1}}>
      <BackHeader title="Chấm công" navigation={navigation} />
      
      <View style={styles.content}>
        {/* <AccountTab profile={profile || {}} /> */}

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CheckTheFace')}>
        
          <View style={{ flexDirection: 'row', flex: 1 }}>
          
            <IconIon name="person-sharp" type="Ionicons" style={styles.icon} />
            
            <Text style={styles.title}>Chấm công</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('VerifyTimeKeepingHistoryPage')}> */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TimeKeepingHistoryPage')}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <IconMate name="history" type="MaterialIcons" style={styles.icon} />
            <Text style={styles.title}>Lịch sử chấm công</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TimeKeepingTable')}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Icon5 name="database" type="FontAwesome5" style={styles.icon} />
            <Text style={styles.title}>Bảng công</Text>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SalaryPage')}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Icon name="money" type="FontAwesome" style={styles.icon} />
            <Text style={styles.title}>Bảng lương</Text>
          </View>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DaysOffBoardPage')}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <Icon name="calendar-times-o" type="FontAwesome" style={styles.icon} />
            <Text style={styles.title}>Nghỉ phép</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OvertimePage')}>
          <View style={{ flexDirection: 'row', flex: 1 }}>
            <IconMate name="timelapse" type="MaterialIcons" style={styles.icon} />
            <Text style={styles.title}>Thời gian OT</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const mapStateToProps = createStructuredSelector({
  timeKeepingPage: makeSelectTimeKeepingPage(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TimeKeepingPage);
