import { StyleSheet, Dimensions } from 'react-native';
import theme from 'utils/customTheme';

const deviceWidth = Dimensions.get('screen').width;

export default StyleSheet.create({
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: 'cyan',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },

  camera: {
    width: deviceWidth,
    height: (deviceWidth) * 4 / 3,
  },

  bottomButton: {
    position: 'absolute',
    zIndex: 30,
    height: '100%',
    alignSelf: 'center',
    width: deviceWidth / 2,
  },
  buttonCheckin: {
    width: 240,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 20,
    height: 50,
    borderRadius: 100,
    justifyContent: 'center'
  },
  buttonRound: {
    fontSize: 30
  },

});
