import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Video from 'react-native-video';
import _ from 'lodash';

export function VideoVipBanner(props) {
    const { uri, style = {} } = props

    return (
        <Video
            source={uri}
            minLoadRetryCount={5}
            resizeMode="stretch"
            useNativeControls
            style={{ height: '100%', width: '100%', ...style }}
            maxBitRate={100000}
            rate={1.0}
            repeat={true}
            muted={true}
            ignoreSilentSwitch={"obey"}
        />
    );
}

const mapStateToProps = createStructuredSelector({
});

function mapDispatchToProps(dispatch) {
    return {
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(VideoVipBanner);
