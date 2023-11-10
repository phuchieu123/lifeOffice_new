import { StyleSheet } from 'react-native';

const React = require('react-native');
const { Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  content: {
    padding: 20,
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
  white: {},
  left: {
    flex: 0.25,
  },
  right: {
    flex: 0.25,
  },
  name: {
    color: '#000',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    flex: 1
  },
  detail: {
    alignSelf: 'flex-start',
  },
  icon: {
    fontSize: 32,
  },
  date: {
    marginBottom: 15,
  },
  right: {
    top: 1,
    flex: 0.4,
  },
  start: {
    width: '100%',
    backgroundColor: '#66ff33',
    textAlign: 'center',
    borderRadius: 10,
    margin: 2,
    marginBottom: 4,
    fontSize: 14,
  },
  end: {
    width: '100%',
    backgroundColor: '#ff6666',
    textAlign: 'center',
    borderRadius: 10,
    margin: 2,
    marginBottom: 4,
    fontSize: 14,
  },
});
