import { Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

export default styles = {
    root: {
        backgroundColor: '#fff',
        flex: 1,
    },
    inputField: {
        marginBottom: 10,
        flexDirection: 'column',
    },
    videoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    videos: {
        width: '100%',
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 6,
    },
    localVideos: {
        marginBottom: 10,
    },
    remoteVideos: {
        height: 400,
    },
    localVideo: {
        backgroundColor: '#f2f2f2',
        height: '100%',
        width: '100%',
    },
    remoteVideo: {
        backgroundColor: '#f2f2f2',
        height: '100%',
        width: '100%',
    },
    rotateIcon: {
        position: 'absolute',
        color: '#000',
        fontSize: 40,
        left: 20,
        zIndex: 40,
        top: 20,
        fontSize: 40,
    },
    camera: {
        width: deviceWidth,
        height: deviceWidth * 4 / 3,
    }
}