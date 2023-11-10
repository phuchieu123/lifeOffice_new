import { StyleSheet } from 'react-native';

const React = require('react-native');
const { Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  deviceHeight,
  deviceWidth,
  chartView: {
    height: deviceHeight - 200,
    flexDirection: 'row',
    margin: 5,
  },
  chart: {
    height: deviceHeight - 200,
    width: deviceWidth - 40,
    left: 15
  },
  legendContainer: {
    flexDirection: 'row',
    marginLeft: 50,
  },
  legend: {
    width: 15,
    height: 15,
    alignSelf: 'center',
  },
  legendText: {
    // fontFamily: 'Raleway-Medium',
    color: 'black',
    // fontSize: 12,
    marginRight: 20,
    marginLeft: 5,
  },
  contentInsetYAsis: {
    top: 20,
    bottom: 30,
    left: 10,
    right: 10,
  },
  contentInsetXAsis: {
    left: 90,
    right: 60,
  },
  chartXAxis: {
    width: deviceWidth,
    // marginTop: 5,
  },
});
