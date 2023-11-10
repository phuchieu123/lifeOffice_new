import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Text, View, Button, Textarea, Root, Spinner } from 'native-base';
import Modal from 'react-native-modal';
import ToastCustom from '../../components/ToastCustom';
import LoadingButton from '../../components/LoadingButton';

export default DenyModal = props => {
    const { visible, onAccept, onClose } = props

    const [text, setText] = useState('')
    const [loading, setLoading] = useState()

    useEffect(() => {
        if (visible) setText('')
    }, [visible])

    const accept = async () => {
        setLoading(true)
        const res = await onAccept()
       
        setLoading(false)
    }

    return <Modal isVisible={visible} style={{ height: 'auto', marginTop: 80 }} >
        <Root >
            <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>

                <Textarea rowSpan={5} bordered value={text} onChangeText={setText} style={{ margin: 5 }} placeholder="Nhập lí do" />

                <View padder style={{ flexDirection: 'row' }}>
                    <LoadingButton block handlePress={() => accept(text)} style={{ flex: 1, marginRight: 10, borderRadius: 10 }} isBusy={loading} spinnerColor='white'>
                        <Text> Xác nhận</Text>
                    </LoadingButton>
                    <Button block onPress={onClose} full style={{ flex: 1, borderRadius: 10 }} warning disabled={loading}>
                        <Text>Trở lại</Text>
                    </Button>
                </View>
            </View>
        </Root>
    </Modal>
}