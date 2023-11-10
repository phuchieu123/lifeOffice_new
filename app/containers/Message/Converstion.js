import React, { useEffect, useRef, useState } from 'react';
import { Item, Left, List, View, Text, Thumbnail, Right } from 'native-base';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createStructuredSelector } from 'reselect';
import ListPage from '../../components/ListPage';
import { API_MESSAGE_LIST, } from '../../configs/Paths';
import { makeSelectProfile } from '../App/selectors';
import { navigate } from '../../RootNavigation';
import moment from 'moment';
import { createNewMessage, getAvatar } from '../../utils/common';
import SearchBox from './components/SearchBox';
import { DeviceEventEmitter } from 'react-native';
import { getMessage, getMessageCoutAll } from '../../api/message';

const Converstion = props => {
    const { profile } = props;

    const [query, setQuery] = useState({ sort: '-updatedAt', filter: { type: 0, $expr: { $gt: ['$updatedAt', '$createdAt'] } } })
    const [localData, setLocalData] = useState()
    const [reload, setReload] = useState(0)
    const [coutUser, setCoutUser] = useState()
    const [coutUserAll, setCoutUserAll] = useState()

    console.log('coutUser', coutUser)
    console.log('coutUserAll', coutUserAll)
    useEffect(() => {
        const onChat = DeviceEventEmitter.addListener("chat", (latestMessage) => {
            if (!localData) return
            if (latestMessage.type !== 0) return
            let newData
            const found = localData.find(e => e._id === latestMessage.id)
            if (found) {
                const newMsg = {
                    ...found,
                    updatedAt: moment(),
                    message: {
                        ...found.message,
                        content: latestMessage.content,
                    }
                }
                newData = localData.filter(e => e._id !== latestMessage.id)
                newData = [newMsg, ...newData]
            } else {
                newData = [createNewMessage(latestMessage), ...localData]
            }
            setLocalData(newData)
        })

        return () => {
            onChat.remove()
        }
    }, [localData])



    useEffect(() => {
        getMessage().then((data) => {
            setCoutUser(data)
        })

        getMessageCoutAll().then((data) => {
            setCoutUserAll(data)
        })


    }, [])








    const formatData = props => {
        const { data } = props
        const { allConversation, allNewestMessage, employee } = data || {}
        let result

        if (allConversation && Array.isArray(allConversation.data) && Array.isArray(allNewestMessage) && Array.isArray(employee)) {
            result = allConversation.data.map(con => {
                const { join } = con
                return {
                    ...con,
                    message: { ...allNewestMessage.find(mes => mes && mes.conversation === con._id) || {} },
                    employee: [...employee.filter(emp => join.includes(emp._id))],
                }
            })
        }
        return result
    }

    const handleReload = () => {
        setReload(e => e + 1)
    }

    return <>
        <SearchBox handleReload={handleReload} query={query} setQuery={setQuery} />
        <List style={{ flex: 1, paddingHorizontal: 5 }}>
            <ListPage
                limit={20}
                reload={reload}
                query={query}
                api={API_MESSAGE_LIST}
                formatResponse={formatData}
                getList={setLocalData}
                forceList={localData}
                itemComponent={({ item }) => <RenderItem item={item} profile={profile} />}
            />
        </List>
    </>
}

const mapStateToProps = createStructuredSelector({
    profile: makeSelectProfile()
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(Converstion)

const RenderItem = ({ item, profile }) => {
    const [toUser, setToUser] = useState()
    const { employee, message } = item

    useEffect(() => {
        const emp = employee.filter(emp => emp._id !== profile._id)
        setToUser(emp[0])
    }, [])

    return <Item onPress={() => navigate('MessageChat', { conversation: item, toUser: toUser })}>
        <Left style={{ flexDirection: 'row' }}>
            <View style={{ margin: 5 }}>
                <Thumbnail source={getAvatar(toUser && toUser.avatar)} />
            </View>
            <View style={{ margin: 10 }}>
                <Text numberOfLines={1}>{toUser ? toUser.name : null}</Text>
                {!(toUser && message.content) ? null :
                    <Text note numberOfLines={1} style={{ fontWeight: message.user === toUser._id ? 'bold' : 'normal' }}>
                        {message.content}
                    </Text>
                }
            </View>
        </Left>
        {item.updatedAt && <Right style={{ justifyContent: 'center' }}>
            <Text note>{moment(item.updatedAt).format('HH:mm')}</Text>
            <Text note>{moment(item.updatedAt).format('DD/MM/YYYY')}</Text>
        </Right>}
    </Item>
}