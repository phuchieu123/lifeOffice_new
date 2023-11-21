import React, { memo, useEffect } from 'react';
import { BackHandler, View, TouchableOpacity, Text } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import Icon from 'react-native-vector-icons/Ionicons';

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
    <View >
      <BackHeader title="Báo cáo" navigation={navigation} />
       <View >
        <TouchableOpacity  style={styles.button} onPress={() => navigation.navigate('EmployeeReportPage')}>
          <View style={styles.left}>
            <Icon name="person" type="Ionicons" style={styles.icon} />
          </View>
          <View>
            <Text style={styles.title}>Báo cáo nhân sự</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TimeKeepingReportPage')}>
          <View style={styles.left}>
            <Icon name="clock-time-five-outline" type="MaterialCommunityIcons" style={styles.icon} />
          </View>
          <View>
            <Text style={styles.title}>Báo cáo chấm công</Text>
          </View>
        </TouchableOpacity> 

      </View> 
     
      
    </View>
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
