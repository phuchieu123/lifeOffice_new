
import React from 'react';
import { ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Button, Icon, Text, View } from 'native-base';
import { pickupImage } from '../../utils/fileSystem';

export default ImageInput = props => {
    const { loading, source, onSave, type, view } = props

    const onPress = () => pickupImage(onSave)

    return <View style={{ height: 160 }}>
        {loading ?
            <View style={{ flex: 1 }}>
                <ActivityIndicator size="large" color="#0000ff" style={{ alignSelf: 'center', marginTop: 50 }} />
            </View>
            :
            <>
                <TouchableOpacity onPress={() => type === 'detail' ? "" : onPress()} style={{ flex: 1 }} disabled={view === true}>
                    <Image
                        resizeMode="contain"
                        source={source}
                        style={{
                            flex: 1,
                            margin: 20,
                            width: 120,
                            height: 120,
                            alignSelf: 'center',
                            resizeMode: 'cover',
                            borderWidth: 2,
                            borderRadius: 60,
                        }}
                    />
                </TouchableOpacity>

                {/* <Button onPress={onPress} rounded small style={{ alignSelf: 'center' }}><Text>Cập nhật ảnh</Text></Button> */}
                {/* <Icon name="edit" type="AntDesign" style={{ position: 'absolute', right: 0, bottom: 0 }} onPress={onPress} /> */}
            </>
        }
    </View >
}