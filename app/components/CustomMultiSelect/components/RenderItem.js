import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, ListItem, Icon, Radio } from 'native-base';
import { scale } from 'react-native-size-matters';
import _ from 'lodash';
import RadioCustom from './Radio';
import theme from '../../../utils/customTheme';

const RenderItem = (props) => {
    const { item, title, value, readOnly, selectedItems, onSelect, enableInfo, onInfoPress } = props

    const [selected, setSelected] = useState(false)

    useEffect(() => {
        if (!readOnly && Array.isArray(selectedItems)) {
            const result = selectedItems.find(e => e === value)
            if (result !== selected) setSelected(result)
        }
    }, [value, selectedItems])

    const onRemove = () => {
        // setSelected(false)
        onSelect(selectedItems.filter(e => e !== value))
    }

    const onAdd = () => {
        // setSelected(false)
        onSelect([...selectedItems, value])
    }

    const onItemPress = () => {
        if (readOnly) return
        else if (selected) onRemove()
        else onAdd()
    }

    return <ListItem style={{ flex: 1, flexDirection: 'row', width: '93%' }} onPress={onItemPress}>
        <Text style={{ flex: 1 }} onPress={() => onItemPress()}>{title}</Text>
        <View style={{ flexDirection: 'row' }}>
            {readOnly ? null : <RadioCustom selected={selected} toggleRadio={onItemPress} />}
            {enableInfo
                ? <TouchableOpacity
                    style={{ backgroundColor: theme.brandWarning, borderRadius: 60, height: 20, width: 20, marginTop: 1, marginLeft: 5, justifySelf: 'center' }}
                    onPress={() => onInfoPress(item)}
                >
                    <Icon type='Ionicons' name='information' style={{ fontSize: 15, color: 'white', position: 'absolute', alignSelf: 'center', marginTop: 2 }} />
                </TouchableOpacity>
                : null
            }
        </View>
    </ListItem >
}

export default RenderItem