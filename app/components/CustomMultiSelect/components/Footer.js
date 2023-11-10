import React from 'react';
import { View } from 'react-native';
import { Icon, Button } from 'native-base';

export default Footer = (props) => {
    const { single, readOnly, handleSave, onClose } = props
    return <View padder style={{ flexDirection: 'row', margin: 5, marginTop: 0 }}>
        {(single || readOnly) ? null : <Button block onPress={handleSave} style={{ flex: 1, borderRadius: 10, margin: 5 }}>
            <Icon name="check" type="Feather" />
        </Button>}
        <Button block onPress={onClose} full style={{ flex: 1, borderRadius: 10, margin: 5 }} warning>
            <Icon name="close" type="AntDesign" />
        </Button>
    </View>
}