import theme from '../../utils/customTheme';

export default styles = {
  view: {
    flex: 1,
    marginRight: 5,
  },
  button: {
    flexDirection: 'row',
    height: 45,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: 30,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBtn: {
    marginLeft: 5,
    height: 22,
    width: 22,
    borderRadius: 15,
    backgroundColor: theme.brandInfo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
    color: 'white',
  },
  modal: {
    height: '80%',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 0,
    alignSelf: 'center',
    zIndex: 39,
  },
};
