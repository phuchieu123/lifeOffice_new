import moment from 'moment';
import { Button, Item, Left, List, Right, Text, Thumbnail, View } from 'native-base';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { navigate } from '../../RootNavigation';
import { getAvatar } from '../../utils/common';
import { makeSelectProfile } from '../App/selectors';
import SearchBox from './components/SearchBox';

const FirebaseChat = props => {
    const { profile } = props;

    const [query, setQuery] = useState({ sort: '-updatedAt', filter: { type: 0, $expr: { $gt: ['$updatedAt', '$createdAt'] } } })
    const [localData, setLocalData] = useState()
    const [reload, setReload] = useState(0)

    useEffect(() => {
    }, [])

    const handleReload = () => {
        setReload(e => e + 1)
    }

    const connectToFirebase = () => {
        // createUserWithEmailAndPassword(auth, email, password)
        //     .then(userCredential => {
        //         const user = userCredential.user
        //     }).catch(err => {
        //         console.log('err', err)
        //     })
    }

    return <>
        <SearchBox handleReload={handleReload} query={query} setQuery={setQuery} />
        <List style={{ flex: 1, paddingHorizontal: 5 }}>
            <Button onPress={connectToFirebase}>
                <Text>
                    Sử dụng Firebase
                </Text>
            </Button>
            {/* <ListPage
                limit={20}
                reload={reload}
                query={query}
                api={API_MESSAGE_LIST}
                formatResponse={formatData}
                getList={setLocalData}
                forceList={localData}
                itemComponent={({ item }) => <RenderItem item={item} profile={profile} />}
            /> */}
        </List>
    </>
}

const mapStateToProps = createStructuredSelector({
    profile: makeSelectProfile()
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(FirebaseChat)

const RenderItem = ({ item, profile }) => {
    const [toUser, setToUser] = useState()
    const { employee, message } = item

    useEffect(() => {
        const emp = employee.filter(emp => emp._id !== profile._id)
        setToUser(emp[0])
    }, [])

    return <Item onPress={() => navigate('MessageChat', { conversation: item })}>
        <Left style={{ flexDirection: 'row' }}>
            <View style={{ margin: 5 }}>
                <Thumbnail source={getAvatar(toUser && toUser.avatar)} />
            </View>
            <View style={{ margin: 10 }}>
                <Text numberOfLines={1}>{item.name}</Text>
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