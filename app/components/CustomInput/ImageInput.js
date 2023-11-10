
import React from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
import images from '../../images';
import { pickupImage } from '../../utils/fileSystem';

export default ImageInput = props => {
    const { source, onSave } = props

    const onPress = () => pickupImage(onSave)

    return <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
        <ImageBackground
            style={{ flex: 1, height: 200, alignItems: 'flex-end', justifyContent: 'flex-end', opacity: source ? 1 : 0.1, transform: [{ scale: source ? 1 : 0.8 }] }}
            resizeMode="contain"
            source={source || images.photoCamera}>
        </ImageBackground>
    </TouchableOpacity>
}