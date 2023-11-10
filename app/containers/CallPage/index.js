import React, { useState, useEffect, memo, useRef } from 'react';
import { Alert, DeviceEventEmitter, FlatList, TouchableOpacity } from 'react-native';
import { Button, Container, Icon, Input, Item, Text, View, Toast } from 'native-base';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectCallData, makeSelectProfile, makeSelectSocket } from '../App/selectors';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals,
} from 'react-native-webrtc';
import { CALL_VIDEO, PUBLISH, ON_OFFER, ON_CALL } from '../../utils/socket';
import styles from './styles';
import BackHeader from '../../components/Header/BackHeader';
import { rtcPeerConnection } from '../../utils/constants';
import request from '../../utils/request';
import { reconize } from '../../api/faceApi';

const CallPage = (props) => {
    const { navigation, socket, profile, route } = props
    const { params } = route
    const [isFront, setIsFront] = useState(true);
    const [localStream, setLocalStream] = useState({ toURL: () => null });
    const [remoteStream, setRemoteStream] = useState({ toURL: () => null });
    const [yourConn, setYourConn] = useState(new RTCPeerConnection(rtcPeerConnection));

    const [existUser, setExistUser] = useState([]);

    const isCalling = useRef(false)
    const userIdTo = useRef('')

    useEffect(() => {
        const callEvent = DeviceEventEmitter.addListener("offer", (profile) => {
            //...
        })

        getCamera()

        yourConn.onaddstream = event => {
            setRemoteStream(event.stream);
        };

        yourConn.onicecandidate = event => {
            if (event.candidate) {
                send('candidate', event.candidate);
            }
        };

        // isCalling.current = true
        // const interval = setInterval(() => {
        //     if (isCalling.current) onCall()
        // }, 5000)

        return () => {
            // if (interval) clearInterval(interval)
            callEvent.remove()
        }
    }, []);

    // useEffect(() => {
    //     callDataRef.current = callData
    //     const { type, data } = callData
    //     switch (type) {
    //         case ON_OFFER:
    //             setExistUser(arr => !arr.find(user => user.identifyNo === data.identifyNo) ? [...arr, data] : [...arr])
    //             break;
    //         // when somebody wants to call us
    //         case 'answer':
    //             handleAnswer(data);
    //             break;
    //         //when a remote peer sends an ice candidate to us
    //         case 'candidate':
    //             handleCandidate(data);
    //             break;
    //         case 'leave':
    //             handleGoBack();
    //             break;
    //         default:
    //             break;
    //     }
    // }, [callData])

    // useEffect(() => {
    //     if (takingPhoto) {
    //         setTimeout(() => {
    //             setTakePhoto(true)
    //         }, 100)
    //     } else {
    //         setTakePhoto(false)
    //         getCamera()
    //     }
    // }, [takingPhoto]);

    useEffect(() => {
        getCamera()
    }, [isFront]);

    const onCallUser = (user) => {
        yourConn.createOffer().then(offer => {
            yourConn.setLocalDescription(offer).then(() => {
                if (socket && profile && profile.identifyNo) {
                    const from = profile.identifyNo
                    const to = user.identifyNo

                    const sendData = {
                        type: ON_CALL,
                        from,
                        to,
                        data: {
                            user: profile,
                            offer
                        }
                    }
                    socket.emit(PUBLISH, sendData);
                }
            });
        });
    };

    const onCall = (user) => {
        yourConn.createOffer().then(offer => {
            yourConn.setLocalDescription(offer).then(() => {
                send('offer', { user, offer })
            });
        });
    };

    const handleGoBack = () => {
        // setRemoteStream({ toURL: () => null });
        send('leave')
        yourConn.close();
        navigation.goBack();
    };

    const handleAnswer = data => {
        const { answer, userId } = data
        userIdTo.current = userId
        isCalling.current = false
        yourConn.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleCandidate = candidate => {
        yourConn.addIceCandidate(new RTCIceCandidate(candidate));
    };

    const send = (type, data) => {
        const from = profile._id
        const to = userIdTo.current

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
    }


    const getUser = () => {
        if (socket && profile && profile.identifyNo) {
            const from = profile.identifyNo

            const sendData = {
                type: ON_OFFER,
                from,
            }
            socket.emit(PUBLISH, sendData);
        }
    }

    const getCamera = () => {
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
                    onCall(profile)
                })
                .catch();
        });
    }

    const cameraTypeHandler = () => {
        setIsFront(!isFront);
    };
    const hendalGoback = () => {
        navigation.goBack()
    }

    return <Container>
        {/* <BackHeader navigation={navigation} title="Xác thực" onGoBack={handleGoBack} /> */}
        <View style={styles.root}>
            {!isFront
                ? <Icon type="MaterialIcons" name="camera-rear" style={styles.rotateIcon} onPress={cameraTypeHandler} />
                : <Icon type="MaterialIcons" name="camera-front" style={styles.rotateIcon} onPress={cameraTypeHandler} />
            }

            <View style={styles.videoContainer}>
                <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
            </View>
        </View>
        <View style={{ width: '100%', backgroundColor: '#fff' }}>
            <TouchableOpacity onPress={hendalGoback} style={{ width: 70, height: 60, backgroundColor: 'red', alignSelf: 'center', borderRadius: 30, }}>
                <Icon name='phone-hangup' type='MaterialCommunityIcons' style={{ alignSelf: 'center', fontSize: 30, justifyContent: 'center', alignItems: 'center' }} />
            </TouchableOpacity>
        </View>
        {/* <View style={{ position: 'absolute', bottom: 10, backgroundColor: 'white', alignSelf: 'center', padding: 5 }}>
            <FlatList
                data={existUser}
                keyExtractor={item => item.identifyNo}
                renderItem={({ item }) => {
                    return <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => onCallUser(item)}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                }}
            />
        </View> */}
    </Container>
}

const mapStateToProps = createStructuredSelector({
    socket: makeSelectSocket(),
    profile: makeSelectProfile()
});

function mapDispatchToProps(dispatch) {
    return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CallPage);