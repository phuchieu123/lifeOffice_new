import { StyleSheet, Dimensions } from 'react-native';
import { scale } from 'react-native-size-matters';
// import theme from 'utils/mipecTheme'

export default styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        // backgroundColor: theme.BACKGROUND_COLOR,
        // paddingHorizontal: 25,
    },
    pdf: {
        width: '100%',
        height: '100%',
    },
    buttonView: {
       
        width: '100%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        
     
        borderRadius: 200,
        shadowColor: 'black',
        borderColor:'#fff',
        backgroundColor: '#fff',
        borderWidth: 4,
        padding: 23,
    }
});