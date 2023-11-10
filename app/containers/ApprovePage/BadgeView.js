import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import reducer from './reducer';
import saga from './saga';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectApprovePage from './selectors';
import {
    Text,
    View,
} from 'native-base';
import { updateCount } from './actions';
import { getDataApprove } from '../../api/approve';
import _ from 'lodash';

const BadgeView = (props) => {
    useInjectReducer({ key: 'approvePage', reducer });
    useInjectSaga({ key: 'approvePage', saga });

    const { approvePage, type, onSetCount, countApprove } = props
    const { approveCount } = approvePage
    const { count, width } = approveCount[type] || {}

    if (!(count && width)) return null;
    return (
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'center',
                width,
                height: 15,
                borderRadius: 10,
                backgroundColor: 'red',
                position: 'absolute',
                right: 2, top: 10
            }}>
            <Text style={{ fontSize: 10, color: 'white' }}>{props.countApprove && props.countApprove}</Text>
        </View>
    );
};

const mapStateToProps = createStructuredSelector({
    approvePage: makeSelectApprovePage(),
});

function mapDispatchToProps(dispatch) {
    return {
        onSetCount: (type, count) => dispatch(updateCount(type, count))
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(BadgeView);