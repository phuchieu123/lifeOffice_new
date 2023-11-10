import React from 'react';
import { Dimensions, Image, TouchableOpacity } from 'react-native';
import { View } from 'native-base';
import { getRecognizeStatus, getTimeKeepingStatus } from './common'

export default ListImage = ({ item, onSelectItem }) => {
    const { faceImage, r_status, r_statusColor, tk_status, tk_statusColor } = item

    return <TouchableOpacity onPress={() => onSelectItem(item)}>
        <Image
            resizeMode="cover"
            source={{ uri: faceImage.uri }}
            style={{ ...styles.thumnail, borderColor: tk_statusColor || r_statusColor }}
        />
        <View style={styles.statusView}>
            {getTimeKeepingStatus(tk_status, tk_statusColor)}
            {getRecognizeStatus(r_status, r_statusColor)}
        </View>
    </TouchableOpacity>
}

const styles = {
    thumnail: {
        marginBottom: 2,
        width: 160,
        height: 120,
        borderWidth: 2,
        margin: 2,
        resizeMode: 'cover',
    },
    statusView: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        flexDirection: 'row'
    },
}