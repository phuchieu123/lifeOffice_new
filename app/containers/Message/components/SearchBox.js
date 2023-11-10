import React, { useRef } from 'react';
import { Icon, Input, Item } from 'native-base';
import { getFilterOr } from '../../../utils/common';

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

    return <Item style={{ paddingHorizontal: 10 }}>
        <Input placeholder="Tìm kiếm" onChangeText={onChangeText} />
        <Icon name="search" onPress={handleReload} />
    </Item>
}