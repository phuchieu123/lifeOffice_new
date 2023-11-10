import React, { useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';

import _ from 'lodash';
import { Button, Container, Text, View } from 'native-base';
import { getUniqueId } from 'react-native-device-info';
import {
    RTCIceCandidate,
    RTCPeerConnection,
    RTCSessionDescription,
    RTCView,
    mediaDevices
} from 'react-native-webrtc';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { navigate } from '../../RootNavigation';
import { rtcPeerConnection } from '../../utils/constants';
import { CALL_VIDEO, PUBLISH } from '../../utils/socket';
import { makeSelectCallData, makeSelectProfile, makeSelectSocket } from '../App/selectors';
import styles from './styles';

const DEVICE_ID = () => getUniqueId();

const ReceiveCallPage = (props) => {
    const { navigation, socket, callData, profile, route } = props
    const { params } = route
    const { data } = params
    const [localStream, setLocalStream] = useState({ toURL: () => null });
    const [remoteStream, setRemoteStream] = useState({ toURL: () => null });
    const [yourConn, setYourConn] = useState(new RTCPeerConnection(rtcPeerConnection));
    const [user, setUser] = useState({});
    const [isBusy, setIsBusy] = useState(false);
    const callDataRef = useRef(callData)
    // const [dataTo, setDataTo] = useState()
    // useEffect(() => {
    //     if (params) {
    //         setDataTo(params)
    //     }
    // }, [params])

    useEffect(() => {
        const callEvent = DeviceEventEmitter.addListener(CALL_VIDEO, (data) => {

            // switch (type) {
            // }
        })
        let isFront = false;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (
                    sourceInfo.kind == 'videoinput' &&
                    sourceInfo.facing == (isFront ? 'front' : 'environment')
                ) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }
            mediaDevices
                .getUserMedia({
                    audio: true,
                    video: {
                        mandatory: {
                            minWidth: 500, // Provide your own width, height and frame rate here  
                            minHeight: 300,
                            minFrameRate: 30,
                        },
                        facingMode: isFront ? 'user' : 'environment',
                        optional: videoSourceId ? [{ sourceId: videoSourceId }] : [],
                    },
                })
                .then(stream => {
                    setLocalStream(stream);
                    yourConn.addStream(stream);
                })
                .catch();
        });

        yourConn.onaddstream = event => {
            setRemoteStream(event.stream);
        };

        yourConn.onicecandidate = event => {
            if (event.candidate) {
                send('candidate', event.candidate);
            }
        };


        // handleOffer();
        return () => {
            callEvent.remove()
            yourConn.close()
        }
    }, []);

    // useEffect(() => {
    //     if (callData && callDataRef.current !== callData) {
    //         callDataRef.current = callData

    //         const { type, data } = callData
    //         switch (type) {
    //             //when somebody wants to call us
    //             case 'offer':
    //                 handleOffer(data);
    //                 break;
    //             //when a remote peer sends an ice candidate to us
    //             // case 'candidate':
    //             //     handleCandidate(data);
    //             //     break;
    //             // case 'leave':
    //             //     handleLeave();
    //             //     break;
    //             // case 'onRecognize':
    //             //     onRecognize(data);
    //             //     break;
    //             default:
    //                 break;
    //         }
    //     }
    //     // const addCallMSg = DeviceEventEmitter.addListener("offer", (profile) => {

    //     // })
    // }, [])
    useEffect(() => {
        const acceptCall = DeviceEventEmitter.addListener(CALL_VIDEO, (data) => {
            if (_.has(data, 'data')) {
                console.log('dataCallVideo', data.data)
                try {
                    if (_.get(data.data.data, 'type') === 'offer') {
                        console.log(1)
                        handleOffer(data)
                    }
                } catch (err) {
                    console.log('err', err)
                }
            }
        })
        return (() => {
            acceptCall.remove()
        })
    }, [])

    const handleLeave = () => {
        setRemoteStream({ toURL: () => null });
        setUser({});
    };

    const handleOffer = async (data) => {

        try {
            const { offer, user } = data
            console.log('data', data)
            // setUser(user)
            console.log(1)
            await yourConn.setRemoteDescription(new RTCSessionDescription(offer));
            console.log(2)
            const answer = await yourConn.createAnswer();
            console.log(3)
            await yourConn.setLocalDescription(answer);
            console.log(4)
            send('answer', { answer, userId: profile._id })
        } catch (err) {
            console.log('err', err)
        }
    };

    const handleCandidate = candidate => {
        yourConn.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const send = (type, data) => {
        try {
            const from = profile._id
            const to = params && params.data.to[0]
            const sendData = {
                type: CALL_VIDEO,
                from,
                to,
                data: {
                    type,
                    data,
                }
            }
            socket.emit(PUBLISH, sendData);
        } catch (err) {
            console.log('err', err)
        }
    }

    const onAccept = () => {
        navigate('CallPage', { arr: data.data.data })
        send('accept')
    }

    const onDeny = () => {
        navigate('MessageChat')
        send('deny')

    }

    const onGoBack = () => {
        handleLeave()
    }


    return <Container>
        {/* <MainHeader navigation={navigation} title="Xác thực" onGoBack={onGoBack} /> */}
        <View style={styles.root}>
            <View style={styles.videoContainer}>
                <RTCView streamURL={remoteStream.toURL()} style={styles.localVideo} />
            </View>

        </View>

        <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }} >
                <Button success style={{ alignSelf: 'center', width: '40%', borderRadius: 20 }} onPress={onAccept}>
                    <Text style={{ textAlign: 'center', flex: 1 }}>Nghe</Text>
                </Button>
                <Button danger style={{ alignSelf: 'center', width: '40%', borderRadius: 20 }} onPress={onDeny}>
                    <Text style={{ textAlign: 'center', flex: 1 }}>Kết thúc</Text>
                </Button>
            </View>
        </View>
    </Container >
}


const mapStateToProps = createStructuredSelector({
    socket: makeSelectSocket(),
    callData: makeSelectCallData(),
    profile: makeSelectProfile()
});

function mapDispatchToProps(dispatch) {
    return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ReceiveCallPage);