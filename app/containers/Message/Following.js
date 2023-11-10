import React, { useEffect, useRef, useState } from 'react';
import { Body, Icon, Input, Item, Left, List, ListItem, View, Text, Thumbnail, Button } from 'native-base';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import ListPage from '../../components/ListPage';
import { API_USERS } from '../../configs/Paths';
import { getAvatar, getFilterOr } from '../../utils/common';
import { Alert, DeviceEventEmitter, ToastAndroid, TouchableNativeFeedback } from 'react-native'
import { makeSelectProfile, makeSelectSocket } from '../App/selectors';
import { navigate } from '../../RootNavigation';
import SearchBox from './components/SearchBox';

const Following = props => {
    const { profile } = props;
    const [query, setQuery] = useState({ sort: '-online' })
    const [reload, setReload] = useState(0)
    const [localData, setLocalData] = useState()

    useEffect(() => {
        const onDocUpdated = DeviceEventEmitter.addListener("docUpdated", (msg) => {
            const { moduleCode, data } = msg;
            if (moduleCode === 'Employee' && data._id !== profile._id) {
                const newData = localData.map(e => ({
                    ...e,
                    online: e._id === msg.data._id ? msg.data.online : e.online
                }))
                setLocalData(newData)
            }
        })

        return () => {
            onDocUpdated.remove()
        }
    }, [localData])

    const handleReload = () => {
        setReload(e => e + 1)
    }

    const customData = ({ data }) => {
        return data.filter(e => e._id !== profile._id)
    }

    return <>
        <SearchBox handleReload={handleReload} query={query} setQuery={setQuery} />
        <List style={{ flex: 1, paddingHorizontal: 5 }}>
            <ListPage
                limit={20}
                reload={reload}
                query={query}
                api={API_USERS}
                getList={setLocalData}
                forceList={localData}
                customData={customData}
                itemComponent={({ item }) => {
                    const color = item.online ? 'rgba(46, 149, 46, 1)' : 'red'
                    const status = item.online ? 'Trực tuyến' : 'Ngoại tuyến'
                    return <TouchableNativeFeedback onPress={() => navigate('MessageChat', { toUser: item })}>
                        <ListItem avatar>
                            <Left>
                                <Thumbnail
                                    source={getAvatar(item.avatar, item.gender)}
                                // style={{ borderColor: color, borderWidth: 3 }}
                                />
                            </Left>
                            <Body>
                                <Text>{item.name}</Text>
                                <Text note style={{ color }}>{status}</Text>
                            </Body>
                        </ListItem>
                    </TouchableNativeFeedback>
                }}
            />
        </List>
    </>
}

const mapStateToProps = createStructuredSelector({
    profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
    return {

    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Following)