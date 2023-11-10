import React, { memo, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  Body,
  Button,
  Container,
  Content,
  Icon,
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
    <Container>
      <BackHeader title="Chấm công" navigation={navigation} />

      <Content style={styles.content}>
        {/* <AccountTab profile={profile || {}} /> */}

        <Button style={styles.button} onPress={() => navigation.navigate('CheckTheFace')}>
          <Body style={{ flexDirection: 'row', flex: 1 }}>
            <Icon name="person-sharp" type="Ionicons" style={styles.icon} />
            <Text style={styles.title}>Chấm công</Text>
          </Body>
        </Button>

        {/* <Button style={styles.button} onPress={() => navigation.navigate('VerifyTimeKeepingHistoryPage')}> */}
        <Button style={styles.button} onPress={() => navigation.navigate('TimeKeepingHistoryPage')}>
          <Body style={{ flexDirection: 'row', flex: 1 }}>
            <Icon name="history" type="MaterialIcons" style={styles.icon} />
            <Text style={styles.title}>Lịch sử chấm công</Text>
          </Body>
        </Button>

        <Button style={styles.button} onPress={() => navigation.navigate('TimeKeepingTable')}>
          <Body style={{ flexDirection: 'row', flex: 1 }}>
            <Icon name="database" type="FontAwesome5" style={styles.icon} />
            <Text style={styles.title}>Bảng công</Text>
          </Body>
        </Button>

        {/* <Button style={styles.button} onPress={() => navigation.navigate('SalaryPage')}>
          <Body style={{ flexDirection: 'row', flex: 1 }}>
            <Icon name="money" type="FontAwesome" style={styles.icon} />
            <Text style={styles.title}>Bảng lương</Text>
          </Body>
        </Button> */}

        <Button style={styles.button} onPress={() => navigation.navigate('DaysOffBoardPage')}>
          <Body style={{ flexDirection: 'row', flex: 1 }}>
            <Icon name="calendar-times-o" type="FontAwesome" style={styles.icon} />
            <Text style={styles.title}>Nghỉ phép</Text>
          </Body>
        </Button>

        <Button style={styles.button} onPress={() => navigation.navigate('OvertimePage')}>
          <Body style={{ flexDirection: 'row', flex: 1 }}>
            <Icon name="timelapse" type="MaterialIcons" style={styles.icon} />
            <Text style={styles.title}>Thời gian OT</Text>
          </Body>
        </Button>
      </Content>
    </Container>
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
