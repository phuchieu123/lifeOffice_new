import React, { useEffect, useState } from 'react';
import { ActionSheet, Icon, Item, Text, View, Alert, Input, Label, Badge, Button, Container } from 'native-base';
import { REQUEST_METHOD } from '../../../utils/constants';
import { rename, downloadFile, shareFile } from '../../../api/fileSystem';
import { PermissionsAndroid, Platform, Linking, Modal } from 'react-native';
import { API_FILE } from '../../../configs/Paths';
import { navigate } from '../../../RootNavigation';
import ToastCustom from '../../../components/ToastCustom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { MODULE } from '../../../utils/constants';
import Permissions from 'react-native-permissions';
import _ from 'lodash'

// import request from '../../utils/request';
import {
    makeSelectKanbanTaskConfigs,
    makeSelectKanbanData,
    makeSelectKanbanBosConfigs,
    makeSelectUserRole,
} from '../../App/selectors';
import request from '../../../utils/request';
import { Image } from 'react-native-svg';
import ShareModal from './ShareModal';
import { picupkFile, uriToBase64 } from '../../../utils/fileSystem';
import DetectionModal from './DetectionModal';
import { TouchableOpacity } from 'react-native';
import FolderModal from './FolderModal';

const DOCS = ['.pdf', '.mp4', '.docx', '.xlsx', '.txt', '.xls', '.doc'];
// const DOCS = ['.pdf'];
const IMGS = ['.jpg', '.png', '.jpeg', '.PNG'];
const READ = [...DOCS, ...IMGS]
const OCRS = [...DOCS, ...IMGS]
const TEXT_EXTRACTION = [...DOCS, ...IMGS]

export function RenderItem(props) {
    const { item, onChangePath, folder, path, allowShare, api, onDeleteSuccess, filemanagerRole, updateSuccess, onShare } = props
    const [modalShare, setModalShare] = useState()
    const [modalDetection, setModalDetection] = useState()
    const [modal, setModal] = useState()
    const [data, setData] = useState({})

    useEffect(() => {
        if (data) {
            setData(item)
        }
    }, [item])

    const onFolderPress = () => {
        onChangePath(`${path}${data.name}/`, [data])
    }

    const onItemPress = async () => {
        const OPTIONS = [{
            id: 'download',
            label: 'Tải xuống',
            func: download,
            role: filemanagerRole.GET
        },
        {
            id: 'read',
            label: 'Xem',
            func: toWatch,
            role: filemanagerRole.GET
        },
        {
            id: 'delete',
            label: 'Xóa',
            func: deleteFile,
            role: filemanagerRole.DELETE
        },
        {
            id: 'share',
            label: 'Chia sẻ',
            func: () => setModalShare(true),
            role: true
        },
        {
            id: 'scan',
            label: 'Quét text',
            func: scannerDocument,
            role: true
        },
        // {
        //     id: 'ocr',
        //     label: 'OCR',
        //     func: onOCR,
        //     role: true
        // },
        {
            id: 'textExtraction',
            label: 'Trích xuất văn bản',
            func: () => setModalDetection(true),
            role: true
        },
        {
            label: 'Đóng'
        }]

        const options = OPTIONS.filter(e => {
            if (e.id === 'read' && !READ.includes(data.type)) return false
            else if (e.id === 'share' && !allowShare) return false
            else if (e.id === 'ocr' && !OCRS.includes(data.type)) return false
            else if (e.id === 'textExtraction' && !TEXT_EXTRACTION.includes(data.type)) return false
            return true
        })
        ActionSheet.show({
            options: options.map(e => e.label),
            cancelButtonIndex: options.length - 1,
            destructiveButtonIndex: options.length - 2,
        }, (buttonIndex) => {
            const { role, func } = options[buttonIndex] || {}
            role && func && func()
        })
    }

    const seLectonItemPress = async () => {
        ActionSheet.show({
            options: ['Đổi tên', 'Chia sẻ', 'Xóa'],
        }, (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                    setModal(true)
                    break;
                case 1:
                    setModalShare(true)
                    break;
                case 2:
                    deleteFile()
                    break;
            }
        })
    }

    const scannerDocument = async () => {
        const title = data.name
        navigate('ScannerPage', {
            data: title,
            data: data
        });
    }

    const changename = () => {
        setModal(true)
    }

    const download = async () => {
        const uri = `${await API_FILE()}/GetImage/${data.clientId}?id=${data._id}`
        console.log('data', data);
        // https://g.lifetek.vn:203/api/file-system/GetImage/20_CRM?id=62b974c3a5fb0918e9f6e90f
        console.log('uri', uri);
        // const uri = 'https://www.techup.co.in/wp-content/uploads/2020/01/techup_logo_72-scaled.jpg'
        const title = data.name
        downloadFile(uri, title)
    }

    const toWatch = async () => {
        if (DOCS.includes(data.type)) {
            // const uri = `${await API_FILE()}/GetImage/${data.clientId}?id=${data._id}`
            // const title = data.name
            // navigate('PDFViewer', {
            //     uri: uri,
            //     title: title,
            // });
            ToastCustom({ text: <View>
                <Text style={{fontWeight: 'bold'}}>Không có bản xem trước</Text>
                <Text>Vui lòng tải về để mở file!</Text>
            </View>, type: 'warning' })
        }
        if (IMGS.includes(data.type)) {
            const uri = `${await API_FILE()}/GetImage/${data.clientId}?id=${data._id}`
            const title = data.name
            navigate('ViewScreenImg', {
                uri: uri,
                title: title,
            });
        }
    }

    const deleteFile = async () => {
        try {
            const newData = {
                action: "delete",
                data: [data],
                names: [data.names],
                path: data.parentPath.substr(`${data.clientId}/${folder}/inComingDocument`.length)
            }

            const body = {
                method: REQUEST_METHOD.POST,
                body: JSON.stringify(newData),
            };

            const response = await request(await api(), body);
            onDeleteSuccess && onDeleteSuccess()
        } catch (err) { }
    }

    const share = async (data) => {
        const id = data._id
        const response = await shareFile(id, data)

        if(response.status === 1) {
            ToastCustom({ text: 'Chia sẻ thành công', type: 'success' })
        } else {
            ToastCustom({ text: 'Chọn người muốn chia sẻ', type: 'danger' })
        }
    }

    return <>
        <View style={{ flex: 1 }}>
            {data.isFile
                ? <Item style={{ padding: 5 }} onPress={onItemPress}>
                    <View style={{ width: 40, height: 40, backgroundColor: '#DDD', marginRight: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#777' }}>{data.type}</Text>
                    </View>
                    <Text numberOfLines={1} style={{ width: '80%' }}>{data.name}</Text>
                </Item>
                : <Item style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    <TouchableOpacity onPress={onFolderPress} style={{ flexDirection: 'row' }}>
                        <Icon name='folder' type="MaterialIcons" style={{ color: 'gray', fontSize: 40 }} />
                        <Text style={{ alignSelf: 'center' }}>{data.name}</Text>
                    </TouchableOpacity>
                    <Icon onPress={seLectonItemPress} name='menu' type="Entypo" style={{ color: 'gray', fontSize: 30, }} />
                </Item>
            }

            {modal && <FolderModal isVisible={modal} onClose={() => setModal(false)} data={data} updateSuccess={updateSuccess} />}
            {modalShare && <ShareModal isVisible={modalShare} onClose={() => setModalShare(false)} data={data} onSave={(dataShare) => share(dataShare)} />}
            {modalDetection && <DetectionModal isVisible={modalDetection} onClose={() => setModalDetection(false)} data={data} />}
        </View>
    </>

}

export default connect(
    createStructuredSelector({
        filemanagerRole: makeSelectUserRole(MODULE.FILEMANAGER),
    }),
)(RenderItem);