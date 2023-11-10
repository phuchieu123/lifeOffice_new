import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  content: {
    paddingHorizontal: 10,
  },
  label: {
    marginBottom: 10,
  },
  wrapper: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: '#555',
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
  },
  textWrapper: {
    // paddingHorizontal: 15,
    paddingVertical: 10,
    borderColor: '#555',
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
  },
  right: {
    height: 45,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 6,
  },
  input: {
    textAlign: 'right',
    marginRight: 5,
    height: 45,
    paddingTop: 10,
  },
});
