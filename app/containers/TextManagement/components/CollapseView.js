import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Icon, Text, ListItem } from 'native-base';

const CollapseView = props => {
    const { hide, title, item } = props
    const [show, setShow] = useState(!hide);

    const toggle = () => setShow(!show)

    return <>
        <ListItem onPress={toggle}>
            <Icon
                type="FontAwesome"
                name={show ? 'caret-up' : 'caret-down'}
                style={{ flexDirection: 'row', justifyContent: 'flex-end', fontSize: 14 }}
            />
            <Text style={{ fontSize: 14, marginLeft: 10 }}>{title || ''}</Text>
        </ListItem>
        <View style={show ? {} : { display: 'none' }}>
            {props.children}
            <ScrollView>
                {item.map((item, index) => {
                    return <ListItem>
                        <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 2 }}>
                            <View style={{ flex: 0.25, alignItems: 'center', paddingRight: 20 }}>
                                <Text style={{ fontSize: 14 }} ellipsizeMode='tail' numberOfLines={1}>{index + 1}</Text>
                            </View>
                            <View style={{ flex: 0.25, alignItems: 'center', paddingRight: 20 }}>
                                <Text style={{ fontSize: 14 }}>{item.receiver && item.receiver.name}</Text>
                            </View>
                            <View style={{ flex: 0.25, alignItems: 'center', paddingRight: 20 }}>
                                <Text style={{ fontSize: 14 }}>{item.action}</Text>
                            </View>
                            <View style={{ flex: 0.25, alignItems: 'center' }}>
                                <Text style={{ fontSize: 14 }}>{item.stageStatus}</Text>
                            </View>
                        </View>
                    </ListItem>
                })}
            </ScrollView>
        </View>
    </>
}

export default CollapseView