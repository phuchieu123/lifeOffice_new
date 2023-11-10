import React from 'react';
import { ActionSheet, Icon, Item, Text, View, Alert } from 'native-base';
import { REQUEST_METHOD } from '../../utils/constants';
import { downloadFile } from '../../api/fileSystem';
import { PermissionsAndroid, Platform, Linking } from 'react-native';
import { API_FILE } from '../../configs/Paths';
import { navigate } from '../../RootNavigation';
import ToastCustom from '../../components/ToastCustom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { MODULE } from '../../utils/constants';
// import request from '../../utils/request';
import {
    makeSelectUserRole,
} from '../App/selectors';
import request from '../../utils/request';
const OPTIONS = ['Tải xuống', 'Xem', 'Xóa', 'Đóng',]
const IMGS = ['jpg', 'png', 'gif', 'heic', 'webp', 'bmp'];

export function RenderItemPersonnel(props) {
    const { item, onChangePath, path, route, api, onDeleteSuccess, filemanagerRole } = props

    const onFolderPress = () => {
        onChangePath(`${path}${item.name}/`, [item])
    }

    const onItemPress = async () => {
        ActionSheet.show({
            options: OPTIONS,
            cancelButtonIndex: OPTIONS.length - 1,
            destructiveButtonIndex: OPTIONS.length - 2,
        }, (buttonIndex) => {
            switch (buttonIndex) {
                case 0:
                    {
                        !filemanagerRole.GET ? null :
                            download()
                    }
                    break;
                case 1:
                    {
                        !filemanagerRole.GET ? null :
                            toWatch()
                        break;
                    }
                case 2:
                    {
                        !filemanagerRole.DELETE ? null :
                            deleteFile()
                    }
                    break;
            }
        })
    }

    const download = async () => {
        const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`
        const title = item.name
        downloadFile(uri, title)

    }
    const toWatch = async () => {
        if (item.type === '.pdf') {
            const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`
            const title = item.name
            navigate('PDFViewer', {
                uri: uri,
                title: title,
            });

        }
        if (item.type === '.jpg' || item.type === '.png' || item.type === '.jpeg') {
            const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`
            const title = item.name
            navigate('ViewScreenImg', {
                uri: uri,
                title: title,
            });
        }
    }
    // download()

    const deleteFile = async () => {
        try {
            const newData = {
                action: "delete",
                data: [item],
                names: [item.names],
                path: item.parentPath.substr(`${item.clientId}/company/inComingDocument`.length)
            }

            const body = {
                method: REQUEST_METHOD.POST,
                body: JSON.stringify(newData),
            };

            const response = await request(await api(), body);
            onDeleteSuccess && onDeleteSuccess()
        } catch (err) { }
    }



    return item.isFile
        ? <Item style={{ padding: 5 }} onPress={onItemPress}>
            {/* <Icon name='folder' type="MaterialIcons" style={{ color: 'gray', fontSize: 40 }} /> */}
            <View style={{ width: 40, height: 40, backgroundColor: '#DDD', marginRight: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 12, color: '#777' }}>{item.type}</Text>
            </View>
            <Text numberOfLines={1} style={{ width: '80%' }}>{item.name}</Text>
        </Item>
        : <Item style={{ padding: 5 }} onPress={onFolderPress}>
            <Icon name='folder' type="MaterialIcons" style={{ color: 'gray', fontSize: 40 }} />
            <Text numberOfLines={1} style={{ width: '95%' }}>{item.name}</Text>
        </Item>
}

export default connect(
    createStructuredSelector({
        filemanagerRole: makeSelectUserRole(MODULE.FILEMANAGER),
    }),
)(RenderItemPersonnel);