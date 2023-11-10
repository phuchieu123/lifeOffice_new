import React, { useState, useEffect, memo, useRef } from 'react';
import { Alert } from 'react-native';
import { Button, Container, Icon, Input, Item, Text, View } from 'native-base';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectCallData, makeSelectSocket } from '../App/selectors';
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
// import JsSIP from 'react-native-jssip';

import styles from './styles';
import { getStream } from '../../utils/common';

const eventHandlers = {
    'accepted': function (e) {
        console.trace(" call accepted ");
    },
    'addstream': function (e) {
        console.log('addstream')
    },
    'confirmed': function (e) {
        console.log('call confirmed');
    },
    'connected': function (e) {
        console.log('connected');
    },
    'connecting': function (e) {
        console.log("connecting");
    },
    'disconnected': function (e) {
        console.log('disconnected');
    },
    'failed': function (e) {
        console.log('call failed with cause: ' + e.data.cause);
    },
    'ended': function (e) {
        console.log('call ended with cause: ' + e.data.cause);
    },
    'newMessage': function (e) {
        console.log('newMessage');
    },
    'newRTCSession': function (data) {
        console.log('newRTCSession')
    },
    'peerconnection': function (e) {
        console.log('peerconnection')
    },
    'progress': function (e) {
        console.log('call is in progress');
    },
    'registered': function (e) {
        console.log("registered");
    },
    'registrationFailed': function (e) {
        console.log("registrationFailed");
    },
    'unregistered': function (e) {
        console.log("unregistered");
    },
};


let eventHandlersEx = {
    'progress': function (e) {
        console.log('call is in progress');
    },
    'failed': function (e) {
        console.log('call failed with cause: ' + e.data.cause);
    },
    'ended': function (e) {
        console.log('call ended with cause: ' + e.data.cause);
    },
    'confirmed': function (e) {
        console.log('call confirmed');
    }
};

const options = {
    'eventHandlers': eventHandlersEx,
    'extraHeaders': ['X-Foo: foo', 'X-Bar: bar'],
    'mediaConstraints': { 'audio': true, 'video': true },
    'sessionTimersExpires': 120,
    'rtcOfferConstraints': { 'offerToReceiveAudio': true },
    mandatory: [{
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: false
    }, { 'DtlsSrtpKeyAgreement': true }]
};


const CCall = (props) => {
    const [calling, setCalling] = useState(false);

    const [callToUsername, setCallToUsername] = useState(null);

    const [localStream, setLocalStream] = useState({ toURL: () => null });
    const [remoteStream, setRemoteStream] = useState({ toURL: () => null });

    const uaRef = useRef()

    // useEffect(() => {
    //     let isFront = false;
    //     // getStream(isFront).then(setLocalStream)
    //     let socket = socket = new JsSIP.WebSocketInterface('wss://sbcwrtchcm.ccall.vn:8080/ws');
    //     let configuration = {
    //         uri: 'sip:103@lifetekhcm026.ccall.vn',
    //         password: 'a.Kd.1xjnc',
    //     };
    //     let ua = new JsSIP.UA(configuration);
    //     ua.start();

    //     Object.keys(eventHandlers).map(key => ua.on(key, eventHandlers[key]))
    //     var session = ua.call('0368923930', options);
    //     uaRef.current = ua

    //     return () => {
    //         ua.unregistered()
    //     }
    // }, []);

    const onCall = () => {
        console.log('uaRef.current.isRegistered', uaRef.current.isRegistered())
        if (uaRef.current && uaRef.current.isRegistered()) {
            uaRef.current.call('0368923930', options)
            console.log('called')
        }
    };

    const handleOffer = async (offer) => {
    };

    const handleLeave = () => {
        setRemoteStream({ toURL: () => null });
    };

    const handleAnswer = answer => {
    };

    const handleCandidate = candidate => {
    };

    const send = (type, data) => {
    }

    return <View style={styles.root}>
        <View style={styles.inputField}>
            <Input
                label="Enter Friends Id"
                mode="outlined"
                style={{ marginBottom: 7 }}
                onChangeText={text => setCallToUsername(text)}
            />
            <Button
                mode="contained"
                onPress={onCall}
                loading={calling}
                //   style={styles.btn}
                contentStyle={styles.btnContent}
            // disabled={!(socketActive)}
            >
                <Text> Call</Text>
            </Button>
        </View>

        <View style={styles.videoContainer}>
            <View style={[styles.videos, styles.localVideos]}>
                <Text>Your Video</Text>
                <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
            </View>
            <View style={[styles.videos, styles.remoteVideos]}>
                <Text>Friends Video</Text>
                <RTCView
                    streamURL={remoteStream.toURL()}
                    style={styles.remoteVideo}
                />
            </View>
        </View>
    </View>
}


const mapStateToProps = createStructuredSelector({
    socket: makeSelectSocket(),
    callData: makeSelectCallData(),
});

function mapDispatchToProps(dispatch) {
    return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CCall);