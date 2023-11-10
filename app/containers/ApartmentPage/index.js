/**
 *
 * HrmPage
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
// import makeSelectHrmPage from './selectors';
// import reducer from './reducer';
// import saga from './saga';
import { View, Text, Button, Icon, Right, Container } from 'native-base';
import { Alert } from 'react-native';
import CustomHeader from '../../components/Header';

function ApartmentPage(props) {
  // useInjectReducer({ key: 'hrmPage', reducer });
  // useInjectSaga({ key: 'hrmPage', saga });

  const { navigation } = props;

  const handleNavigate = page => {
    navigation.navigate(page);
  };

  return (
    <Container>
      <CustomHeader title="Quản lý nhân sự" />
      <View style={{ flex: 1, backgroundColor: '#1cc6c5' }}>
        <View padder style={styles.wrapper}>
          <View style={styles.view}>
            <Button style={styles.button} onPress={() => handleNavigate('WaterIndicatorsListPage')}>
              <Icon name="water-sharp" type="Ionicons" style={styles.icon} />
              <Text style={styles.text}>DS chỉ số nước</Text>
            </Button>

            <Button style={styles.button} onPress={() => handleNavigate('ElectricIndicatorPage')}>
              <Icon name="calendar" type="FontAwesome" style={styles.icon} />
              <Text style={styles.text}>Chấm công</Text>
            </Button>
          </View>

          <View style={styles.view}>

            <Button style={styles.button} onPress={() => handleNavigate('CarFeePage')}>
              <Icon name="car" type="FontAwesome5" style={styles.icon} />
              <Text style={styles.text}>DS phí xe</Text>
            </Button>
          </View>

        </View>
      </View>
      {/* <CustomFooter activePage="Hrm" /> */}
    </Container >
  );
}

export default ApartmentPage;

const styles = {
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#eee',
    borderRadius: 15,
  },
  view: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    // flex: 1,
    width: "45%",
    flexDirection: 'column',
    height: 'auto',
    borderRadius: 15,
    backgroundColor: 'white',
    margin: 10,
  },
  icon: {
    fontSize: 65,
    color: '#1cc6c5',
    margin: 10
  },
  text: {
    color: 'black',
    margin: 10
  }
};
