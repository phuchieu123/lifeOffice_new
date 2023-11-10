import { Content, Button, Icon, Card, CardItem, Form, Item, Label, Input, View, Textarea, Left, Body, Text } from 'native-base';
import { DeviceEventEmitter, FlatList, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { serialize } from '../../utils/common';
import request from '../../utils/request';
import { API_INCOMMING_DOC_COMPLETE, API_OUTGOING_DOC_COMPLETE } from '../../configs/Paths';
import reducer from './reducer';
import saga from './saga';
import ToastCustom from '../../components/ToastCustom';
import CustomHeader from '../../components/Header';
import { getDocument } from './actions';
import makeSelectTextManagement from './selectors';
import { useInput } from '../../utils/useInput';

export function TextComplete(props) {
    useInjectReducer({ key: 'textComplete', reducer });
    useInjectSaga({ key: 'textComplete', saga });

    const { navigation, route, textComplete } = props;
    const { value: note, setValue: setNote, bind: bindNote } = useInput('');
    const { params } = route;
    const { item, type } = params;

    const getDocumentCompleteIn = async () => {
        try {
            const filter = {
                
            }
            let url = `${await API_INCOMMING_DOC_COMPLETE()}?${serialize({ filter: filter })}`;
            const newBody = {
                method: 'POST',
                body: JSON.stringify({
                    docIds: [item._id],
                    note: note,
                    processResult: null,
                    saveResult: null,
                })
            };
            const res = await request(url, newBody);

            if (res && res.successNo === 1) {
                ToastCustom({ text: 'Hoàn thành xử lý thành công', type: 'success' });
                navigation.navigate('TextManagement')
            } else {
                ToastCustom({ text: 'Hoàn thành xử lý thất bại', type: 'danger' });
            }
            return response
        } catch (err) { }
        return null
    }

    const getDocumentCompleteOut = async () => {
        try {
            const filter = {
                
            }
            let url = `${await API_OUTGOING_DOC_COMPLETE()}?${serialize({ filter: filter })}`;
            const newBody = {
                method: 'POST',
                body: JSON.stringify({
                    docIds: [item._id],
                    note: note,
                    inherit: false
                })
            };
            const res = await request(url, newBody);

            if (res && res.successNo === 1) {
                ToastCustom({ text: 'Hoàn thành xử lý thành công', type: 'success' });
                navigation.navigate('TextManagement')
            } else {
                ToastCustom({ text: 'Hoàn thành xử lý thất bại', type: 'danger' });
            }
            return response
        } catch (err) { }
        return null
    }

    return (
        <Content>
            <CustomHeader
                navigation={navigation}
                title={'Hoàn thành xử lý'}
            />
            <Card>
                <CardItem>
                    <Form style={{ flex: 1, backgroundColor: 'white' }}>
                        <Textarea
                            {...bindNote}
                            placeholder={'Nhập nội dung...'}
                            bordered
                            maxLength={500}
                            style={{ width: '100%', textAlign: 'left', height: 120 }}
                        />
                        <View style={{ flex: 0.05, flexDirection: 'row', marginTop: 10, justifyContent: 'flex-end' }}>
                            {(type === 1) ? <Button style={{ borderRadius: 18, backgroundColor: 'rgba(46, 149, 46, 1)', height: 35 }} onPress={() => getDocumentCompleteIn()}>
                                <Text style={{ paddingLeft: 20, paddingRight: 20, textAlign: 'center', fontSize: 10, color: '#fff', fontWeight: '600' }}>Hoàn thành</Text>
                            </Button> : null}
                            {(type === 2) ? <Button style={{ borderRadius: 18, backgroundColor: 'rgba(46, 149, 46, 1)', height: 35 }} onPress={() => getDocumentCompleteOut()}>
                                <Text style={{ paddingLeft: 20, paddingRight: 20, textAlign: 'center', fontSize: 10, color: '#fff', fontWeight: '600' }}>Hoàn thành</Text>
                            </Button> : null}
                        </View>
                    </Form>
                </CardItem>
            </Card>
        </Content>
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
    textComplete: makeSelectTextManagement(),
});

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        onGetDocument: data => dispatch(getDocument(data)),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(TextComplete);