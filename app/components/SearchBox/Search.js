import React, { useEffect, useState, useRef } from 'react';
import {View, Text, TextInput} from 'react-native';
import { Icon, Button} from 'native-base';
import { Keyboard, Platform } from 'react-native';
import theme from '../../utils/customTheme'

const SearchBox = (props) => {
    const { onChange } = props;
    const [textSearch, setTextSearch] = useState('');

    const searching = useRef();

    useEffect(() => {
        return () => {
            if (searching.current) clearTimeout(searching.current);
        };
    }, []);

    const handleSearch = (newText) => {
        let text = newText
        text = text.trimLeft()

        if (text === textSearch) return

        setTextSearch(text);
        if (searching.current) clearTimeout(searching.current);
        searching.current = setTimeout(() => {
            if (onChange) onChange(text);
        }, 500);

    };

    const onRemove = () => {
        if (textSearch.trim()) handleSearch('')
        else setTextSearch('')
    }

    return (
        <View style={{ zIndex: 20, backgroundColor: '#fff', alignSelf: 'center', marginLeft: 8, height: 40 }}>
            <Icon name="search" onPress={() => onChange(textSearch)} style={{ color: theme.brandPrimary }} />
            <TextInput placeholder="Tìm kiếm" value={textSearch} onChangeText={handleSearch} onSubmitEditing={Keyboard.dismiss} autoCapitalize='none' />
            <Icon name="remove" type="MaterialIcons" onPress={onRemove} style={{ color: theme.brandPrimary }} />
        </View >
    );
};

export default SearchBox;
