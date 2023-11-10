import React, { useCallback, useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Badge, Body, Button, Container, Icon, Input, Item, Label, Left, List, ListItem, Right, Tab, TabHeading, Tabs, Text, View, ActionSheet } from 'native-base';
import { REQUEST_METHOD } from '../../../utils/constants';
import DriverPage from '../../../components/ListPage/DriverPage';
import RenderItem from './RenderItem';
import FabLayout from '../../../components/CustomFab/FabLayout';
import Modal from 'react-native-modal';
import { requestCamera } from '../../../utils/permission';
import { addFile, addFolder } from '../../../api/fileSystem';
import DocumentPicker from 'react-native-document-picker'
import ToastCustom from '../../../components/ToastCustom';
import { makeSelectClientId } from '../../App/selectors';
import { createStructuredSelector } from 'reselect';
import { navigate } from '../../../RootNavigation';
import { launchCamera } from 'react-native-image-picker';
import SearchBox from '../../../components/SearchBox/Search';
import Records from '../../../components/Records';
import _ from 'lodash'
import FolderModal from './FolderModal';
import DetectionModal from './DetectionModal';

const RenderPage = (props) => {
    const { api, folder, clientId, allowAdd, allowShare } = props

    const [body, setBody] = useState({
        method: REQUEST_METHOD.POST,
        body: {
            action: "read",
            data: [],
            path: "/",
            showHiddenItems: false,
        }
    })
    const [reload, setReload] = useState(0)
    const [code, setCode] = useState()
    const [codeVideo, setCodeVideo] = useState()
    const [modal, setModal] = useState()
    const [file, setFile] = useState()
    const [record, setRecord] = useState()
    const [ocr, setOCR] = useState()
    const [cameraCancel, setCameraCancel] = useState(false)

    const path = _.get(body, 'body.path')

    useEffect(() => {
        setCode('Document_' + new Date().getTime() + '.jpg')
        setCodeVideo('Video_' + new Date().getTime() + '.mp4')
        setCameraCancel(false)
    }, [cameraCancel])

    const handleReload = () => setReload(reload + 1)

    const onChangePath = (path, item) => {
        const newBody = {
            ...body
        }
        newBody.body.path = path
        newBody.body.data = item
        setBody(newBody)
    }

    const onItemPress = async () => {
        const OPTIONS = [
            {
                name: 'Thêm thư mục',
                func: newFolder
            },
            {
                name: 'Thêm tập tin',
                func: newFile
            },
            {
                name: 'Chụp ảnh',
                func: newFileCammera
            }, {
                name: 'Quay video',
                func: newFileVideo
            }, {
                // name: 'Ghi âm',
                // func: () => setRecord(true)
                // }, {
                //     name: 'Quét tài liệu',
                //     func: () => navigate('ScannerPage')
                // }, {
                name: 'OCR',
                func: onOCR
            },
        ]

        const options = OPTIONS.map(e => e.name)
        const funcs = OPTIONS.map(e => e.func)

        ActionSheet.show({ options }, (buttonIndex) => funcs[buttonIndex] && funcs[buttonIndex]())
    }

    const onOCR = () => {
        setOCR(true)
    }

    const newFolder = () => {
        setModal(true)
        setFile()
    }

    const newFileCammera = async () => {
        let permission = await requestCamera()
        if (permission) {
            launchCamera({ mediaType: 'photo', includeBase64: true }, async (e) => {
                const { didCancel, assets } = e
                setCameraCancel(true)
                if (!didCancel) {
                    try {
                        await addFile({ folder, clientId, path, file: { uri: assets[0].uri, name: code, type: 'image/jpeg' }, name: { name: 'Image' }, fileName: 'Image' })
                        ToastCustom({ text: 'Tải file thành công', type: 'success' })
                        handleReload()
                    } catch (err) {
                        ToastCustom({ text: 'Tải file không thành công', type: 'danger' })
                    }
                }
            })
        }
    }

    const newFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })
            await addFile({ folder, clientId, path, file: res[0] })
            ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
            handleReload()
        } catch (err) {
            ToastCustom({ text: 'Thêm mới không thành công', type: 'danger' })
        }
    }

    const newFileVideo = async () => {
        let permission = await requestCamera()
        if (permission) {
            launchCamera({ mediaType: 'video', includeBase64: true }, async (e) => {
                const { didCancel, assets } = e
                setCameraCancel(true)
                if (!didCancel) {
                    try {
                        await addFile({ folder, clientId, path, file: { uri: assets[0].uri, name: codeVideo, type: 'video/mp4' }, name: 'mp4', fileName: 'mp4' })
                        handleReload()
                        ToastCustom({ text: 'Tải file thành công', type: 'success' })
                    } catch (err) {
                        ToastCustom({ text: 'Tải file không thành công', type: 'danger' })
                    }
                }
            })
        }
    }

    const onChangeSearchContent = (val) => {
        const newBody = { ...body }
        console.log('~ newBody', newBody)
        newBody.body.searchContent = val
        setBody(newBody)
    }

    const toMainpage = () => {
        onChangePath('/', [])
    }

    const goBack = () => {
        let newPath = path.split('/')
        newPath.pop()
        newPath.pop()
        newPath = newPath.join('/')
        onChangePath(`${newPath}/`)
    }

    return <View>
        <SearchBox onChange={onChangeSearchContent} />
        <View style={{ padding: 5 }}>
            <Icon name='home' style='Entypo' onPress={toMainpage} />
            {path === "/"
                ? <Text numberOfLines={1}>{'Trang chủ '}</Text>
                : <Text>{`../${path.substr(0, path.length - 1).split('/').pop()}`}</Text>
            }
            {_.get(body, 'body.path') === '/' ? null
                : <Icon
                    name='arrow-bold-left'
                    type='Entypo'
                    onPress={goBack}
                    style={{ position: 'absolute', right: 0 }}
                />}
        </View >
        <DriverPage
            reload={reload}
            query={{ clientId }}
            body={body}
            api={api}
            itemComponent={({ item }) => <RenderItem
                folder
                allowShare={allowShare}
                api={api}
                item={item}
                onChangePath={onChangePath}
                path={path}
                updateSuccess={handleReload}
                onDeleteSuccess={handleReload}
            />}
        />

        <Modal isVisible={record}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
                <View itemHeader itemDivider style={{ borderRadius: 10 }}>
                    <Text>Ghi âm</Text>
                </View>
                <Records onClose={() => setRecord(false)} />
            </View>
        </Modal>

        {!allowAdd ? null :
            <>
                <FabLayout onPress={onItemPress}>
                    <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
                </FabLayout>
                <FolderModal isVisible={modal} onClose={() => setModal(false)} file={file} folder={folder} path={path} updateSuccess={handleReload} />
            </>
        }

        <DetectionModal isVisible={ocr} onClose={() => setOCR(false)} />
    </View >
}

const mapStateToProps = createStructuredSelector({
    clientId: makeSelectClientId(),
});

function mapDispatchToProps(dispatch) {
    return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(RenderPage);