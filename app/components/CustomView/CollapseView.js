import React, { useState } from 'react';
import { View } from 'react-native';
import { Icon, Item, Text } from 'native-base';
import theme from '../../utils/customTheme'

const CollapseView = props => {
    const { hide, title } = props
    const [show, setShow] = useState(!hide);

    const toggle = () => setShow(!show)

    return <>
        <Item style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            // justifyContent: 'space-between',
            height: 45
        }} onPress={toggle}>
            <Text style={{ color: theme.brandPrimary }}>{title || 'Thông tin'} </Text>
            <Icon
                type="FontAwesome"
                name={show ? 'caret-down' : 'caret-left'}
                style={{ fontSize: 16, color: theme.brandPrimary, marginLeft: 5 }}
            />
        </Item>

        <View style={show ? {} : { display: 'none' }}>
            {props.children}
        </View>
    </>
}

export default CollapseView