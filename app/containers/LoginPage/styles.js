const React = require('react-native');

const { Dimensions } = React;

const deviceHeight = Dimensions.get('window').height;

export default {
  content: {
    flex: 1,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    top: '10%'
  },
  host:{
    width: '75%',
    height: 45,
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    flexDirection:'row',
    alignItems:'center',
    position: 'relative'
  },
  input: {
    width: '75%',
    height: 45,
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    flexDirection:'row',
    alignItems:'center',
  },
  loginBtn: {
    width: '75%',
    backgroundColor: 'black',
    marginTop: 5,
    height: 40,
    color: 'white',
    alignSelf: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    borderRadius: 20
  },
  
  loginBtnText: {
    color: '#FFF',
  },
  checkbox: {
    bottom: 3,
  },
  register:{
    marginTop: 20,
    textAlign : 'center',

  }
};
