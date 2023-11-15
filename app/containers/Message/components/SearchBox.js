import React, { useRef } from 'react';
import {View, TextInput} from 'react-native'
import { getFilterOr } from '../../../utils/common';
import Icon from 'react-native-vector-icons/FontAwesome';
export default SearchBox = props => {
    const { handleReload, query, setQuery } = props

    const searching = useRef();

    const onChangeText = (text) => {
        if (searching.current) clearTimeout(searching.current);
        searching.current = setTimeout(() => {
            let newQuery = { ...query };
            newQuery = getFilterOr(newQuery, text, ['name'])
            setQuery(newQuery);
        }, 500);
    }

    return <View style={{ paddingHorizontal: 10 }}>
        <TextInput placeholder="Tìm kiếm" onChangeText={onChangeText} />
        <Icon name="search" onPress={handleReload} />
    </View>
}