import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../../utils/customTheme'

const CollapseView = props => {
    const { hide, title } = props
    const [show, setShow] = useState(!hide);

    const toggle = () => setShow(!show)

    return <>
        <TouchableOpacity activeOpacity={1} style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems:'center',
            paddingVertical: 10,
borderBottomWidth: 1, borderColor: '#ccc',marginRight: 8,
            // justifyContent: 'space-between',
            height: 45
        }} onPress={toggle}>
            <Text style={{ color: theme.brandPrimary }}>{title || 'Thông tin'} </Text>
            <Icon
                type="FontAwesome"
                name={show ? 'caret-down' : 'caret-left'}
                style={{ fontSize: 16, color: theme.brandPrimary, marginLeft: 5 }}
            />
        </TouchableOpacity>

        <View style={show ? {} : { display: 'none' }}>
            {props.children}
        </View>
    </>
}

export default CollapseView