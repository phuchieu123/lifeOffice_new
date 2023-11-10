import React, { useState } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import { Icon, Item, Text, ListItem } from 'native-base';
import theme from '../../../utils/customTheme'

const CollapseText = props => {
    const { hide, title } = props
    const [show, setShow] = useState(!hide);

    const toggle = () => setShow(!show)

    return <>
        <Text style={show ? { fontSize: 14, color: '#75a3cc' } : { display: 'none' }} onPress={toggle}>{show ? title : ''} </Text>
        <Icon
            onPress={toggle}
            type="FontAwesome"
            name={show ? 'caret-up' : 'caret-down'}
            style={{ flexDirection: 'row', justifyContent: 'flex-end', fontSize: 14 }}
        />
    </>
}

export default CollapseText