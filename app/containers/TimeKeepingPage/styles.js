import { StyleSheet } from 'react-native';

const React = require('react-native');
const { Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
    // backgroundColor: '#9FE2BF',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  button: {
    height: 80,
    padding: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(46, 149, 46, 1)',
    borderRadius: 15,
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  white: {
    color: '#fff',
  },
  right: {
    flex: 0.25,
  },
  title: {
    fontSize: 18,
    alignSelf: 'flex-start',
    color: '#111',
    marginTop: 6
  },
  detail: {
    alignSelf: 'flex-start',
    color: '#fff',
  },
  icon: {
    color: '#fff',
    fontSize: 32,
    marginHorizontal: 18,
  },
});
