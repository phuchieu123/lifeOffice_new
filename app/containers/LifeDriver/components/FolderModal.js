import React, { useCallback, useEffect, useState } from 'react';
import { Badge, Body, Button, Container, Icon, Input, Item, Label, Left, List, ListItem, Right, Tab, TabHeading, Tabs, Text, View, ActionSheet } from 'native-base';
import Modal from 'react-native-modal';
import { rename, addFolder } from '../../../api/fileSystem';
import ToastCustom from '../../../components/ToastCustom';
import _ from 'lodash'

const FolderModal = props => {
    const { data, isVisible, onClose, file, folder, path, updateSuccess } = props

    const [name, setName] = useState('')

    useEffect(() => {
        if (data) {
            setName(data.name)
        }
    }, [data])

    const handleSave = async () => {
        if (!name.trim()) return
        handleClose()

        if (!data) {
            const res = await addFolder({ folder, path, name })
            if (res) ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
            else ToastCustom({ text: 'Thêm mới không thành công', type: 'danger' })
        } else {
            const res = await rename(data, name)
            if (res) ToastCustom({ text: 'Cập nhật thành công', type: 'success' })
            else ToastCustom({ text: 'Cập nhật không thành công', type: 'danger' })
        }
        updateSuccess && updateSuccess()
    }

    const handleClose = () => {
        setName('')
        onClose()
    }

    return <Modal isVisible={isVisible} style={{ height: 'auto' }} >
        <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10 }}>
            <Item inlineLabel>
                <Label>{file ? 'Tên tập tin' : 'Tên thư mục'}</Label>
                <Input value={name} onChangeText={setName} style={styles.input} />
                <Icon type="Entypo" name="folder" style={{ color: 'gray' }} />
            </Item>

            {/* {file ?
                <Badge primary style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Text>{file.name}</Text>
                    <Icon type="FontAwesome" name="remove" style={styles.icon} onPress={() => setFile(null)} />
                </Badge>
                : null} */}
            <View padder style={{ flexDirection: 'row' }}>
                <Button block onPress={handleSave} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
                    <Icon name="check" type="Feather" />
                </Button>
                <Button block onPress={handleClose} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
                    <Icon name="close" type="AntDesign" />
                </Button>
            </View>
        </View>
    </Modal >
}

export default FolderModal

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