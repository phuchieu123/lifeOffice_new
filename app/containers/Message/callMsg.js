import React, { useState, useEffect, useRef } from 'react';
import { Header, Icon, Title, Body, Right, View, Text } from 'native-base';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import _ from 'lodash';
import { navigate } from '../../RootNavigation';
import { makeSelectProfile, makeSelectSocket } from '../App/selectors';
import { DeviceEventEmitter } from 'react-native';
import { getUniqueId } from 'react-native-device-info';
import { CALL_VIDEO, PUBLISH } from '../../utils/socket';
const DEVICE_ID = () => getUniqueId();
const CallMsg = (props) => {
    const { profile, group, socket } = props

    const onCall = () => {
        try {
            const arr = _.get(group, 'join', []).filter(e => e !== profile._id)
            send('ReceiveinComingCalls', { arr })
            // if (arr[0] === profile._id) {
            //     console.log('.....Dr')
            navigate('MyCall', { to: arr })
        } catch (err) {
            console.log('err', err)
        }
        // }65
    }

    const send = (type, data) => {
        const from = DEVICE_ID()
        // const to = user.identifyNo
        const sendData = {
            type,
            from,
            // to,
            data: {
                type,
                data,
                profile
            }
        }
        socket.emit(PUBLISH, sendData);
    }

    return <View>
        <Icon
            name="phone-alt"
            type="FontAwesome5"
            style={{ color: '#fff', marginLeft: 15, marginRight: 5, fontSize: 20 }}
            onPress={onCall}
        />

    </View >

}


// export default CustomHeader;
const mapStateToProps = createStructuredSelector({
    profile: makeSelectProfile(),
    socket: makeSelectSocket(),
});

function mapDispatchToProps(dispatch) {
    return {

    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(CallMsg)