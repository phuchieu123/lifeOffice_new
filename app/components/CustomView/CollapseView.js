import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../../utils/customTheme'

const CollapseView = props => {
    const { hide, title } = props
    const [show, setShow] = useState(!hide);

    const toggle = () => setShow(!show)

    return <>
        <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingVertical: 10,
borderBottomWidth: 1, borderColor: '#ccc',
            // justifyContent: 'space-between',
            height: 45
        }} onPress={toggle}>
            <Text style={{ color: theme.brandPrimary }}>{title || 'Thông tin'} </Text>
            <Icon
                type="FontAwesome"
                name={show ? 'caret-down' : 'caret-left'}
                style={{ fontSize: 16, color: theme.brandPrimary, marginLeft: 5 }}
            />
        </View>

        <View style={show ? {} : { display: 'none' }}>
            {props.children}
        </View>
    </>
}

export default CollapseView