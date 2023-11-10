import React, { memo, useEffect } from 'react';
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
  Left,
  Text
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal from '../App/selectors';
import reducer from './reducer';
import saga from './saga';
import makeSelectHrmReportPage from './selectors';
import styles from './styles';

const HrmReportPage = (props) => {
  useInjectReducer({ key: 'hrmReportPage', reducer });
  useInjectSaga({ key: 'hrmReportPage', saga });

  const { navigation } = props;
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
      <BackHeader title="Báo cáo" navigation={navigation} />
      <Content style={styles.content}>
        <Button style={styles.button} onPress={() => navigation.navigate('EmployeeReportPage')}>
          <Left style={styles.left}>
            <Icon name="person" type="Ionicons" style={styles.icon} />
          </Left>
          <Body>
            <Text style={styles.title}>Báo cáo nhân sự</Text>
          </Body>
        </Button>
        <Button style={styles.button} onPress={() => navigation.navigate('TimeKeepingReportPage')}>
          <Left style={styles.left}>
            <Icon name="clock-time-five-outline" type="MaterialCommunityIcons" style={styles.icon} />
          </Left>
          <Body>
            <Text style={styles.title}>Báo cáo chấm công</Text>
          </Body>
        </Button>
      </Content>
    </Container>
  );
};


const mapStateToProps = createStructuredSelector({
  hrmReportPage: makeSelectHrmReportPage(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(HrmReportPage);
