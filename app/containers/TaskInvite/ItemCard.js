import React, { useState, memo, useEffect, useCallback } from 'react';
import { Card, CardItem, Body, Text, View, Icon, Button, Fab, Title } from 'native-base';
import LoadingButton from '../../components/LoadingButton';

const arrType = ['Người tham gia', 'Người phụ trách', 'Người hỗ trợ'];

export default ItemCard = props => {
    const { item, onAccept, onDeny } = props
    const { taskId, type, name } = item || {}

    const [loading, setLoading] = useState()

    const accept = async () => {
        setLoading(true)
        await onAccept(item)
        setLoading(false)
    }

    return <Card style={{ borderRadius: 10, marginBottom: 5 }}>
        <CardItem style={{ paddingBottom: 5 }}>
            <Text >{name}</Text>
        </CardItem>
        <CardItem style={{ marginTop: 0, paddingTop: 0, flexDirection: 'column' }}>
            {Number.isInteger(type) ? <Text style={{ fontSize: 14, alignSelf: 'flex-start' }}>Vai trò: {arrType[Number(type) - 1]}</Text> : null}

            <View padder style={{ flexDirection: 'row', marginTop: 5 }}>

                {/* <Button block onPress={accept} style={{ flex: 1, borderRadius: 10, marginRight: 10, backgroundColor: '#2196f3' }}> */}
                <LoadingButton block handlePress={accept} style={{ flex: 1, borderRadius: 10, marginRight: 10, backgroundColor: '#2196f3' }} isBusy={loading} spinnerColor='white'>
                    <Text>Chấp nhận</Text>
                </LoadingButton>
                {/* <Button block onPress={() => onDeny(item)} full style={{ flex: 1, borderRadius: 10 }} warning > */}
                <Button block onPress={() => onDeny(item)} full style={{ flex: 1, borderRadius: 10 }} warning disabled={loading}>
                    <Text>Từ chối</Text>
                </Button>
            </View>
        </CardItem>
    </Card >
}