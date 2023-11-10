/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * ApprovedTab
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Text, Button, View, Content, Card, CardItem, Item, Label, Form, Icon, ListItem } from 'native-base';
import { API_TASKS_CONTRACT, APP_URL, UPLOAD_FILE } from '../../../configs/Paths';
// import { getJwtToken } from '../../../utils/authen';
import { MODULE, REQUEST_METHOD } from '../../../utils/constants';
import CustomMultiSelect from '../../../components/CustomMultiSelect';
import { useInput } from '../../../utils/useInput';
import { TableWrapper, Table, Row, Rows } from 'react-native-table-component';
import moment from 'moment';
import { StyleSheet } from 'react-native';
import LoadingButton from '../../../components/LoadingButton';
import LoadingLayout from '../../../components/LoadingLayout';
import ListPage from '../../../components/ListPage';
import FabLayout from '../../../components/CustomFab/FabLayout';
import FileView from '../../../components/FileView';
import { addFile } from '../../../api/fileSystem';
import DocumentPicker from 'react-native-document-picker'
import ToastCustom from '../../../components/ToastCustom';


export function DocumentTab(props) {
    const {
        isBusy,
        projectDetail,
        clientId
    } = props;
    const defaultBody = {
        method: REQUEST_METHOD.POST,
        body: {
            action: "read",
            data: [],
            path: "/",
            showHiddenItems: false,
        },
    }
    const [body, setBody] = useState(defaultBody)
    const handleReload = () => setReload(reload + 1)
    const [reload, setReload] = useState(0)

    const handleAdd = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })

            await addFile({ folder: "users", clientId, path: body.body.path, file: res[0], code: 'Task', childTaskId: projectDetail._id, mid: projectDetail._id })
            ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
            handleReload()
        } catch (err) {
            ToastCustom({ text: 'Thêm mới không thành công', type: 'danger' })
        }
    }
    return (
        <>
            {/* <ListItem itemHeader itemDivider style={{ borderRadius: 10 }} >
                    <Text>Danh sách tài liệu</Text>
                </ListItem> */}

            {/* <RenderPageDocument api={UPLOAD_FILE} folder="users" /> */}
            <FileView id={projectDetail._id} code={MODULE.TASK} visible={true} reload={reload} />


            <FabLayout onPress={handleAdd}>
                <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
            </FabLayout>

        </>

    );
}

export default memo(DocumentTab);


