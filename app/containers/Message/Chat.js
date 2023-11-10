import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Item, Left, List, Right, Thumbnail, Text, View, Input, Icon } from 'native-base';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import { connect } from 'react-redux';
import { compose } from 'redux';
import reducer from './reducer';
import saga from './saga';
import BackHeader from '../../components/Header/BackHeader';
import { API_CHAT, API_CONVERSATION } from '../../configs/Paths';
import { getJwtToken, getProfile } from '../../utils/authen';
import { clean, createConversation, mergeData } from './actions';
import { createStructuredSelector } from 'reselect';
import { makeSelectProfile, makeSelectSocket } from '../App/selectors';
import makeSelectMessage from './selectors';
import ListPage from '../../components/ListPage';
import { getAvatar, getUri } from '../../utils/common';
import _ from 'lodash';
import moment from 'moment';
import { DeviceEventEmitter, FlatList, ImageBackground, TouchableOpacity, Image } from 'react-native';
import theme from '../../utils/customTheme'
import { pickupImage, picupkFile, downloadFile } from '../../utils/fileSystem';
import { createFile, uploadImage } from '../../api/fileSystem';
import { navigate } from '../../RootNavigation';
import iconSvg from '../../iconSvg';
import LoadingLayout from '../../components/LoadingLayout';
import { deleteMesseger, updateIcon } from '../../api/conversation';
import callMsg from './callMsg';

function MessageChat(props) {
    useInjectReducer({ key: 'messagePage', reducer });
    useInjectSaga({ key: 'messagePage', saga });

    const { navigation, route, onCreateConversation, onClean, onMergeData, messagePage, socket, profile } = props;
    const { conversation } = messagePage
    const { params } = route
    const { toUser } = params
    const [api, setApi] = useState()
    console.log(':( ~ api', api)
    const [nameUser, setNameUser] = useState()
    const [query, setQuery] = useState({ sort: '-updatedAt' })
    const [content, setContent] = useState('')
    const [attachFile, setAttachFile] = useState([])
    const [localData, setLocalData] = useState()
    const [checkCall, setCheckCall] = useState()

    useEffect(() => {
        return () => {
            onClean()
        }
    }, [])
    useEffect(() => {
        if (toUser) {
            setNameUser(toUser)
        }
    }, [toUser])



    // useEffect(() => {


    //     const addEvent = DeviceEventEmitter.addListener("callApp", (e) => {
    //         console.log('e', e)
    //         console.log('profile', profile)
    //         // setCheckCall(profile === e.arr)
    //     })
    //     // const addEventReload = DeviceEventEmitter.addListener("callApp", (e) => {
    //     //     handleReload()
    //     // })
    //     return () => {
    //         addEvent.remove()
    //         // addEventReload.remove()
    //     }
    // }, [])

    useEffect(() => {
        const onChat = DeviceEventEmitter.addListener("chat", (latestMessage) => {
            if (!localData) return
            if (!conversation) return
            if (conversation._id !== latestMessage.id) return
            if (profile._id !== latestMessage.userId) {
                const newMsg = {
                    _id: moment().valueOf().toString(),
                    content: latestMessage.content,
                    conversation: latestMessage.id,
                    status: 1,
                    updatedAt: latestMessage.time,
                    user: {
                        _id: latestMessage.userId,
                        avatar: latestMessage.userAvatar,
                        name: latestMessage.userName,
                    },
                    attachFile: latestMessage.attachFile,
                }
                const newData = [newMsg, ...localData]
                setLocalData(newData)

            }

        })

        return () => {
            onChat.remove()
        }
    }, [localData, conversation])

    useEffect(() => {
        toUser && onCreateConversation({ join: [toUser._id, profile._id], type: 0, name: toUser.name, friendId: toUser._id })
    }, [toUser])

    useEffect(() => {
        params.conversation && onMergeData({ conversation: params.conversation })
    }, [params.conversation])

    useEffect(() => {
        conversation && setApi(() => async () => `${await API_CHAT()}/${conversation._id}`)
    }, [conversation])

    const onDeleteFile = useCallback((index) => {
        setAttachFile(attachFile.filter((e, idx) => idx !== index))
    }, [attachFile])


    const onSendImage = () => {
        pickupImage((e) => {
            const file = createFile(e)
            setAttachFile(e => [...e, file])
        })
    }
    const onSendFile = () => {
        picupkFile().then(e => {
            const file = createFile(e[0])
            setAttachFile(e => [...e, file])
        })
    }

    const onSend = () => {
        sendMessage()
    }

    const sendMessage = async () => {
        if (!socket) return
        if (!conversation) return
        if (!content.trim() && !attachFile.length) return
        setContent('')
        setAttachFile([])
        const token = await getJwtToken();
        const body = {
            data: {
                id: conversation._id,
                content: content.trim(),
                userName: profile.name,
                userAvatar: profile.avatar,
                userId: profile._id,
                type: conversation.type,
                join: conversation.join,
                name: conversation.name,
                time: moment(),
            },
            type: 'CHAT',
            Authorization: token,
        }
        if (attachFile.length > 0) {
            const result = await Promise.all(attachFile.map(uploadImage))
            body.data.attachFile = attachFile.map((e, idx) => ({ attachFile: result[idx], name: e.name, type: e.type }))
        }
        socket.emit('conversation', body);
        const { data } = body
        const newMsg = {
            _id: moment().valueOf().toString(),
            content: data.content,
            conversation: data.id,
            status: 1,
            updatedAt: data.time,
            user: {
                _id: data.userId,
                avatar: data.userAvatar,
                name: data.userName,
            },
            attachFile: data.attachFile,
        }
        const newData = [newMsg, ...localData]
        setLocalData(newData)
    }

    return <Container>
        <BackHeader
            title={(nameUser && nameUser.name) || (params.conversation && params.conversation.name)}
            navigation={navigation}
        // rightHeader={<CallMsg group={params.conversation} />}
        />
        <List style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#eee', flexDirection: 'column-reverse' }}>
            {api && <ListPage
                limit={20}
                inverted
                query={query}
                api={api}
                forceList={localData}
                getList={setLocalData}
                itemComponent={({ item }) => <RenderItem item={item} profile={profile} toUser={toUser} />}
                noDataText=" "
            />}
        </List>
        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
            <Icon name="picture-o" type='FontAwesome' onPress={onSendImage} style={styles.icon} />
            <Icon name="filetext1" type='AntDesign' onPress={onSendFile} style={styles.icon} />
            <Text style={{ fontSize: 30, padding: 0, color: theme.brandPrimary, top: -8 }}>|</Text>

            <FlatList
                horizontal
                data={attachFile}
                keyExtractor={(item) => item.name}
                renderItem={({ item, index }) => <View style={{ height: 30, top: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ccc', borderRadius: 20, padding: 0, paddingHorizontal: 15, marginLeft: 5 }}>
                    <Text numberOfLines={1} style={{ maxWidth: 80 }}>{item.name}</Text>
                    <Icon
                        name="close"
                        type="AntDesign"
                        onPress={() => onDeleteFile(index)}
                        style={{ padding: 0, margin: 0, paddingLeft: 5, fontSize: 20 }} />
                </View>
                }
            />
        </View>
        <View padder>
            <Item regular>
                <Input onChangeText={setContent} value={content} />
                <Icon active name="send" onPress={onSend} style={styles.icon} />
            </Item>
        </View>
    </Container >
}

const mapStateToProps = createStructuredSelector({
    socket: makeSelectSocket(),
    messagePage: makeSelectMessage(),
    profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
    return {
        onCreateConversation: data => dispatch(createConversation(data)),
        onClean: () => dispatch(clean()),
        onMergeData: data => dispatch(mergeData(data)),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MessageChat)

const RenderItem = props => {
    const { item, profile } = props
    const { user } = item

    const [show, setShow] = useState(false);
    const [showSettingIcon, setShowSettingIcon] = useState(false);
    const [showIcon, setShowIcon] = useState(false);
    const [isDsb, setIsDsb] = useState(false)
    const [istReturn, setIstReturn] = useState(false)
    const [reload, setReload] = useState(0);

    const handleReload = () => setReload(reload + 1)
    const toggleIcon = () => {
        setShowIcon(!showIcon)
    }
    const toggle = () => {
        setShow(!show)
    }
    const toggleSettingIcon = () => {
        setShowSettingIcon(!showSettingIcon)
        setShow(false)
        setIsDsb(true)

    }
    const [saveEmoij, setSaveEmoij] = useState()
    useEffect(() => {
        if (typeof item.emotion === 'object') {
            const RenDerItem = item.emotion.map((item) =>
                item.emotion
            )
            const rendericon = listEmoij.find((item) => item.emotion.toString() === RenDerItem.toString())
            setSaveEmoij(rendericon)
        }

    }, [item])


    const handleSubmit = async (data) => {

        let icon = {
            content: data.name,
            emotion: parseInt(data.emotion)
        }

        const res = await updateIcon(item._id, icon)
        if (res) {
            handleReload()
        }
        setSaveEmoij(data)
        setShow(false)
        setShowIcon(false)
        setShowSettingIcon(false)
        setIsDsb(false)
    };

    const deleteIcon = async () => {
        const resultApi = await deleteMesseger(item._id)
        if (resultApi.status === 1) {
            handleReload()
            setIstReturn(true)
            setShowSettingIcon(false)
            setShow(false)
            setShowIcon(false)
            setIsDsb(false)
        }
    }

    const listEmoij = [

        {
            name: 'haha', emotion: '1', content: "1", type: iconSvg.haha,
        },

        {
            hame: 'love', emotion: '0', content: "0", type: iconSvg.forinlove
        },

        {
            name: 'sad', emotion: '3', content: "3", type: iconSvg.sad
        },
        {
            name: 'wow', emotion: '2', content: "2", type: iconSvg.wow
        },
        {
            name: 'like', emotion: '5', content: "5", type: iconSvg.like
        },
        {
            name: 'angry', emotion: '4', content: "4", type: iconSvg.angry
        },
    ]

    const onPressImg = (uri, title) => navigate('ViewScreenImg', { uri, title });
    const onPressFile = (uri, title) => {
        downloadFile(uri, title)
    };

    return <>
        {/* 
        {!istReturn ? <View style={{ position: 'absolute' }}>
            <Thumbnail small source={getAvatar(user.avatar, user.gender)} />
        </View> : null} */}
        <View style={{ flexDirection: user._id !== profile._id ? 'row' : 'row-reverse', marginVertical: 5, marginBottom: 26 }}>

            {!istReturn ? <View >
                <Thumbnail small source={getAvatar(user.avatar, user.gender)} />
            </View> : null}

            <View>



                {!item.content.trim() ? null :
                    <View>
                        {!istReturn ? <TouchableOpacity disabled={isDsb} onLongPress={2000} onPress={toggle} style={{ justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, margin: 5 }}>
                            <Text>{item.content}</Text>
                            <View style={{ alignItems: 'flex-end', marginTop: 6, }}>
                                {saveEmoij ? <Image source={saveEmoij.type} style={{ height: 22, width: 22, }} /> : null}
                            </View>
                        </TouchableOpacity> : null}
                        {show ? <View style={{ flexDirection: 'row', position: 'absolute', right: user._id !== profile._id ? -26 : '100%', bottom: '30%' }} >
                            <TouchableOpacity onPress={toggleSettingIcon} >
                                <Icon name='dots-three-horizontal' type='Entypo' />
                            </TouchableOpacity>
                        </View> : null}
                        {showSettingIcon ? <View style={{ flexDirection: 'row', position: 'absolute', right: user._id !== profile._id ? -60 : '100%', bottom: '30%' }} >
                            <TouchableOpacity style={{ marginRight: 10 }} onPress={toggleIcon} >
                                <Icon style={{ color: 'blue' }} name='tag-faces' type='MaterialIcons' />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={deleteIcon} >
                                <Icon style={{ color: 'red' }} name='delete' type='AntDesign' />
                            </TouchableOpacity>
                        </View> : null}
                    </View>

                }
                {/* {showSettingIcon ? <View style={{ flexDirection: 'row', marginTop: 6, }} >
                <TouchableOpacity style={{ marginRight: 10 }} onPress={toggleIcon} >
                    <Icon style={{ color: 'blue' }} name='tag-faces' type='MaterialIcons' />
                </TouchableOpacity>
                <TouchableOpacity >
                    <Icon style={{ color: 'red' }} name='delete' type='AntDesign' />
                </TouchableOpacity>
            </View> : null} */}



                {showIcon ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }} >
                    {listEmoij.map((emoij) =>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <View>
                                    <TouchableOpacity onPress={() => handleSubmit(emoij)}>
                                        <Image source={emoij.type} style={{ height: 22, width: 22, marginRight: 10 }} />
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    )}
                </View> : null}

                <FlatList
                    data={_.get(item, 'attachFile', [])}
                    keyExtractor={(item) => item.attachFile}
                    renderItem={({ item }) => {
                        const { attachFile, type, name } = item
                        return (type.includes('image'))
                            ? <TouchableOpacity onPress={() => onPressImg(attachFile, name)}>
                                <ImageBackground
                                    style={{ flex: 1, width: 150, height: 150, marginVertical: 5 }}
                                    resizeMode="contain"
                                    source={{ uri: getUri(attachFile) }}>
                                </ImageBackground>
                            </TouchableOpacity>
                            : <View style={{ justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, margin: 5, top: -3 }}>
                                <TouchableOpacity onPress={() => onPressFile(attachFile, name)}>
                                    <Text style={{ textDecorationLine: 'underline' }}>{name}</Text>
                                </TouchableOpacity>
                            </View>
                    }}
                />
            </View>
        </View >

    </>
}

const styles = {
    icon: {
        color: theme.brandPrimary,
        padding: 5,
    }
}