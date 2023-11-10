import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Badge, Body, Button, Container, Icon, Input, Item, Label, Left, List, ListItem, Right, Tab, TabHeading, Tabs, Text, View, ActionSheet } from 'native-base';
import { FOLDER, REQUEST_METHOD } from '../../utils/constants';
import DriverPage from '../../components/ListPage/DriverPage';
import FabLayout from '../../components/CustomFab/FabLayout';
import Modal from 'react-native-modal';
// import * as DocumentPicker from 'expo-document-picker';
import request from '../../utils/request';
import moment from 'moment';
import { getProfile } from '../../utils/authen';
import { serialize } from '../../utils/common';
import { addFile, addFolder } from '../../api/fileSystem';
import DocumentPicker from 'react-native-document-picker'
import ToastCustom from '../../components/ToastCustom';
import _ from 'lodash'
import RenderItemWSP from './RenderItemWSP'
import { createStructuredSelector } from 'reselect';
import { makeSelectClientId } from '../App/selectors';
import { compose } from 'redux';
import { connect } from 'react-redux';

const RenderPageWSP = (props) => {
    const defaultBody = {
        method: REQUEST_METHOD.POST,
        body: {
            action: "read",
            data: [],
            path: "/",
            showHiddenItems: false,
        },
    }

    const { api, folder, clientId } = props

    const [query, setQuery] = useState({ clientId })
    const [body, setBody] = useState(defaultBody)
    const [reload, setReload] = useState(0)

    const [modal, setModal] = useState()
    const [files, setFile] = useState()
    const [name, setName] = useState('')

    const handleReload = () => setReload(reload + 1)

    const onChangePath = (path, item) => {
        const newBody = {
            ...body
        }
        newBody.body.path = path
        // newBody.body.data = item
        setBody(newBody)
    }



    const newFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })
            await addFile({ folder, clientId, path: body.body.path, file: res[0] })
            handleReload()
            ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
        } catch (err) {
            ToastCustom({ text: 'Thêm mới không thành công', type: 'danger' })
        }
    }

    const handleAdd = async () => {
        try {
            if (!name.trim()) return
            setModal(false)
            await addFolder({ folder, clientId, path: body.body.path, name })
            handleReload()
            ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
        } catch (err) {
            ToastCustom({ text: 'Thêm mới không thành công', type: 'danger' })
        }
    }

    const getPrePath = (path) => {
        let newPath = path.split('/')
        newPath.pop()
        newPath.pop()
        newPath = newPath.join('/')
        onChangePath(`${newPath}/`)
    }

    return <Container>
        {/* <Item style={{ padding: 5 }}>
            <Icon name='home' style='Entypo' onPress={() => onChangePath('/', [])} />
            <Text>{'/'}</Text>
            {body.body.path === "/"
                ? <Text numberOfLines={1} style={{ width: '95%' }}>{'Trang chủ '}</Text>
                : <Text>{`.../${body.body.path.substr(0, body.body.path.length - 1).split('/').pop()}`}</Text>
            }
            {_.get(body, 'body.path') === '/' ? null
                : <Icon
                    name='arrow-bold-left'
                    type='Entypo'
                    onPress={() =>
                        // onChangePath(, [])
                        getPrePath(body.body.path)
                    }
                    style={{ position: 'absolute', right: 0 }}
                />}
        </Item > */}

        <DriverPage
            reload={reload}
            query={query}
            body={body}
            api={api}
            itemComponent={({ item }) =>
                <RenderItemWSP
                    api={api}
                    item={item}
                    onChangePath={onChangePath}
                    path={body.body.path}
                    onDeleteSuccess={handleReload}
                />}
        />

        {![FOLDER.USERS, FOLDER.COMPANY].includes(folder) ? null :
            <>
                <View style={{ backgroundColor: '#fff', elevation: 0, position: 'absolute', top: 10, right: 14 }}>
                    <Icon onPress={newFile} type="Octicons" name="diff-added" style={{ color: '#ccc', fontSize: 28 }} />
                </View>

                <Modal isVisible={modal} style={{ height: 'auto' }} >
                    <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10 }}>
                        <Item inlineLabel>
                            <Label>{files ? 'Tên tập tin' : 'Tên thư mục'}</Label>
                            <Input value={name} onChangeText={setName} style={styles.input} />
                            <Icon type="Entypo" name="folder" style={{ color: 'gray' }} />
                        </Item>

                        {files ?
                            <Badge primary style={{ flexDirection: 'row', marginTop: 5 }}>
                                <Text>{files.name}</Text>
                                <Icon type="FontAwesome" name="remove" style={styles.icon} onPress={() => setFile(null)} />
                            </Badge>
                            : null}
                        <View padder style={{ flexDirection: 'row' }}>
                            <Button block onPress={handleAdd} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
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
    </Container >
}

const mapStateToProps = createStructuredSelector({
    clientId: makeSelectClientId()
});

function mapDispatchToProps(dispatch) {
    return {
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(RenderPageWSP);

const styles = {
    input: {
        textAlign: 'right',
        marginRight: 5,
        height: 45,
    },
    icon: {
        fontSize: 16,
        color: '#fff',
        padding: 5
    },
}