import { StyleSheet } from 'react-native';

const React = require('react-native');
const { Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  content: {
    padding: 20,
    // backgroundColor: '#9FE2BF',
    backgroundColor: '#fff',
  },
  button: {
    flexDirection:'row',
    alignItems:'center',
    height: 80,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    backgroundColor:  'rgba(46, 149, 46, 1)',
    borderRadius: 15,
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
  white: {
    color: '#fff',
  },
  left: {
    flex: 1
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
    fontSize: 30,
  },
  View:{flex: 1}
});
