import { Container, Tab, TabHeading, Tabs, Text, Button, View, Content, Card, CardItem, Body, ListItem, Icon, Item } from 'native-base';
import { DeviceEventEmitter, FlatList, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import CustomHeader from '../../components/Header';
import { getDocument } from './actions';
import makeSelectTextManagement from './selectors';
import CommentView from '../CommentView';

export function TextOpinion(props) {
    useInjectReducer({ key: 'textOpinion', reducer });
    useInjectSaga({ key: 'textOpinion', saga });

    const { navigation, route, textOpinion } = props;
    const { params } = route;
    const { item, code } = params;

    return (
        <Container>
            <CustomHeader
                navigation={navigation}
                title={'Ý kiến xử lý'}
            />
            <Content>
                <CommentView project={item} code={code} textMng={true}/>
            </Content>
        </Container >
    )
}


const styles = {
    icon: {
        color: '#fff',
        marginLeft: 15,
        marginRight: 5,
        paddingRight: 5,
        fontSize: 30
    }
}

const mapStateToProps = createStructuredSelector({
    textOpinion: makeSelectTextManagement(),
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        onGetDocument: data => dispatch(getDocument(data)),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(TextOpinion);