import React, { useState, useEffect, useRef } from 'react';
import { Header, Icon, Title, Body, Right, View, Text } from 'native-base';
import { useInjectSaga } from '../../../utils/injectSaga';
import { useInjectReducer } from '../../../utils/injectReducer';
import * as RootNavigation from '../../../RootNavigation';
import { makeSelectProfile } from '../../App/selectors';
import reducer from '../reducer';
import saga from '../saga';
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import _ from 'lodash';
import makeSelectMessage from '../selectors';
import { mergeData } from '../actions';
import { DeviceEventEmitter } from 'react-native';

const MsgIcon = props => {
    useInjectReducer({ key: 'messagePage', reducer });
    useInjectSaga({ key: 'messagePage', saga });

    const { onMergeData, messagePage, profile } = props;
    const { iconStyle = {} } = props;
    const { unReadMsg } = messagePage

    const onMsgPress = () => {
        RootNavigation.navigate('Message')
    }

    return <View>
        <Icon
            name="message-text"
            type="MaterialCommunityIcons"
            style={{ ...styles.icon, ...iconStyle }}
            onPress={onMsgPress}
        />
        {!unReadMsg ? null :
            <View>
                <View style={styles.count}>
                    <Text onPress={onMsgPress} style={{ color: 'white', fontSize: 13 }}>
                        {unReadMsg > 100 ? '99+' : unReadMsg}
                    </Text>
                </View>
            </View>}
    </View >

}

const styles = {
    icon: {
        color: '#fff',
        marginLeft: 15,
        marginRight: 5
    },
    count: {
        position: 'absolute',
        right: -11,
        top: -30,
        backgroundColor: 'red',
        borderRadius: 9,
        width: 26,
        height: 19,
        justifyContent: 'center',
        alignItems: 'center'
    }
}

// export default CustomHeader;
const mapStateToProps = createStructuredSelector({
    messagePage: makeSelectMessage(),
    profile: makeSelectProfile(),

});

function mapDispatchToProps(dispatch) {
    return {
        onMergeData: data => dispatch(mergeData(data)),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MsgIcon)