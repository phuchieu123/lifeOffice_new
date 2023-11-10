import React, { useState, useEffect } from 'react';
import { View, Text } from 'native-base';
import ToggleIcon from './ToggleIcon';
import _ from 'lodash';

const DefaultTitle = props => {
    const { defaultTitle, disableIcon, selectedItems, data, uniqueKey, displayKey, emptyText, styles = {} } = props
    if (defaultTitle) return defaultTitle

    const [text, setText] = useState('');

    const displaySeleted = (selectedItems.length === 1 && text) ? text : `(${selectedItems.length} đã chọn)`

    useEffect(() => {
        if (selectedItems.length === 1) {
            const found = data.find(e => e[uniqueKey] === selectedItems[0])
            if (found) setText(found[displayKey])
        }
    }, [selectedItems, data]);

    return <>
        {selectedItems.length
            ? <Text style={{ marginRight: 10, textAlignVertical: 'center', justifySelf: 'center', ...styles }}>{displaySeleted}</Text>
            : emptyText
                ? <Text style={{ marginRight: 10, textAlignVertical: 'center', justifySelf: 'center', ...styles }}>{emptyText}</Text>
                : <Text style={{ opacity: 0.5, marginRight: 10, textAlignVertical: 'center', justifySelf: 'center', ...styles }}>Lựa chọn</Text>
        }
        {disableIcon ? null : <ToggleIcon />}
    </>
}

export default DefaultTitle