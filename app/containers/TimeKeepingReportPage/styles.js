import { StyleSheet } from 'react-native';

const React = require('react-native');
const { Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  content: {
    // padding: 10,
    // backgroundColor: '#9FE2BF',
    backgroundColor: '#fff',
  },
  button: {
    height: 80,
    padding: 20,
    marginBottom: 20,
    backgroundColor: '#6495ED',
    borderRadius: 15,
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  white: {
    color: '#fff',
  },
  left: {
    flex: 0.25,
  },
  right: {
    flex: 0.25,
  },
  title: {
    fontSize: 18,
    alignSelf: 'flex-start',
    color: '#fff',
  },
  detail: {
    alignSelf: 'flex-start',
    color: '#fff',
  },
  icon: {
    color: '#fff',
    fontSize: 32,
  },
  chartOption: {
    flex: 1,
  },
  deviceWidth: deviceWidth - 10,
  deviceHeight,
  chart: {
    height: deviceHeight - 200,
    width: deviceWidth,
  },
  chartView: {
    height: deviceHeight - 200,
    flexDirection: 'row',
    margin: 5,
  },
  chartXAxis: {
    width: deviceWidth,
    marginTop: 5,
  },
  legend: {
    width: 15,
    height: 15,
    alignSelf: 'center',
  },
  legendsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendText: {
    // fontFamily: 'Raleway-Medium',
    color: 'blue',
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
    right: 63,
  },
});
