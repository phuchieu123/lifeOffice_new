import React, { useEffect, useRef, useState } from 'react';
import { Item, Left, List, View, Text, Right, Label, Input, Icon, ListItem, Button } from 'native-base';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { createStructuredSelector } from 'reselect';
import ListPage from '../../components/ListPage';
import { API_CONVERSATION, API_MESSAGE_LIST, API_USERS } from '../../configs/Paths';
import { navigate } from '../../RootNavigation';
import moment from 'moment';
import { createNewMessage } from '../../utils/common';
import SearchBox from './components/SearchBox';
import FabLayout from '../../components/CustomFab/FabLayout';
import Modal from 'react-native-modal';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import { getProfile } from '../../utils/authen';
import request from '../../utils/request';
import { DeviceEventEmitter } from 'react-native';

const Groups = props => {

    const [query, setQuery] = useState({ sort: '-updatedAt', filter: { type: 1, $expr: { $gt: ['$updatedAt', '$createdAt'] } } })
    const [localData, setLocalData] = useState()
    const [reload, setReload] = useState(0)

    const [modal, setModal] = useState()
    const [joins, setJoins] = useState()
    const [name, setName] = useState('')

    useEffect(() => {
        const onChat = DeviceEventEmitter.addListener("chat", (latestMessage) => {
            if (!localData) return
            if (latestMessage.type !== 1) return
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


    const openModal = () => {
        setModal(true)
        setJoins()
        setName('')
    }

    const addGroup = () => {
        if (!name.trim()) return
        setModal(false)
        getProfile().then(async profile => {
            try {
                const data = {
                    join: [...joins, profile._id],
                    name,
                    type: 1
                }
                const url = await API_CONVERSATION()
                const res = await request(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                });
                handleReload()
            } catch (err) { }
        })
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
                itemComponent={({ item }) => <RenderItem item={item} />}
            />
        </List>

        <FabLayout onPress={openModal}>
            <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
        </FabLayout>

        <Modal isVisible={modal} style={{ height: 'auto' }} >
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10 }}>
                <Item inlineLabel>
                    <Label >Tên nhóm</Label>
                    <Input value={name} onChangeText={setName} style={styles.input} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </Item>

                <Item inlineLabel>
                    {joins && joins.length ? null : <Label >Chọn</Label>}
                    <MultiAPISearch
                        API={API_USERS}
                        selectedItems={Array.isArray(joins) ? joins : []}
                        onSelectedItemsChange={setJoins}
                        onRemove={() => setJoins(null)}
                    // filterOr={['name', 'code', 'phoneNumber']}
                    />
                </Item>

                <View padder style={{ flexDirection: 'row' }}>
                    <Button block onPress={addGroup} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
                        <Icon name="check" type="Feather" />
                    </Button>
                    <Button block onPress={() => setModal(false)} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
                        <Icon name="close" type="AntDesign" />
                    </Button>
                </View>
            </View>
        </Modal >
    </>
}

const mapStateToProps = createStructuredSelector({
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(Groups)

const RenderItem = ({ item }) => {
    const { employee, message } = item

    return <Item onPress={() => navigate('MessageChat', { conversation: item })} >
        <Left style={{ flexDirection: 'row' }}>
            <View style={{ width: 54, height: 54, backgroundColor: '#EEE', borderRadius: 35, margin: 5, marginVertical: 8, justifyContent: 'center', alignItems: 'center' }}>
                {/* <Text style={{ textTransform: 'uppercase', fontSize: 20, opacity: 0.5 }}>{employee.length > 9 ? '9+' : employee.length}</Text> */}
                <Text style={{ textTransform: 'uppercase', fontSize: 20 }}>{item.name.substr(0, 2)}</Text>
            </View>
            <View style={{ margin: 10 }}>
                <Text numberOfLines={1}>{item.name}</Text>
                <Text note numberOfLines={1}>{message.content || ''}</Text>
            </View>
        </Left>
        {item.updatedAt && <Right style={{ justifyContent: 'center' }}>
            <Text note>{moment(item.updatedAt).format('HH:mm')}</Text>
            <Text note>{moment(item.updatedAt).format('DD/MM/YYYY')}</Text>
        </Right>}
    </Item>
}


const styles = {
    input: {
        textAlign: 'right',
        marginRight: 5,
        minHeight: 42
    }
}