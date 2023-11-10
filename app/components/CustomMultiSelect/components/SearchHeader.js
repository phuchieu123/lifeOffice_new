import React, { useRef } from 'react';
import { Icon, Item, Input, } from 'native-base';

const SearchHeader = (props) => {
    const { onSearch, loading, setLoading } = props;
    const timer = useRef(null);

    const onSearchText = (value) => {
        if (!loading && setLoading) setLoading(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => onSearch(value), 500);
    };

    return (
        <Item regular style={{ marginLeft: 10, marginRight: 10, marginBottom: 5, marginTop: 5, height: 40 }}>
            <Icon type="FontAwesome" name="search" color="red" style={{ fontSize: 18 }} />
            <Input placeholder="Tìm kiếm..." onChangeText={onSearchText} />
        </Item>
    );
};

export default SearchHeader