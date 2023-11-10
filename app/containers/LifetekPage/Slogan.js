
import React from 'react';
import { navigate } from '../RootNavigation';
import { Text } from 'native-base';

export default Slogan = () => {

    const toLt = () => {
        navigate('LifetekTab')
        // const newUrl = `https://${LIFFETEK.website}`
        // Linking.canOpenURL(newUrl).then(supported => {
        //   if (supported) Linking.openURL(newUrl)
        // });
    }

    return <Text
        style={{
            fontSize: 12,
            color: '#eee',
            textAlign: 'center',
            textDecorationLine: 'underline',
            alignContent: 'flex-end',
            marginBottom: 30
        }}
        onPress={toLt}>
        ©Lifetek - Công nghệ cho cuộc sống
    </Text>
}