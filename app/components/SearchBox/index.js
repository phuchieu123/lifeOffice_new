import React, {useEffect, useState, useRef} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {Keyboard, Platform} from 'react-native';

const SearchBox = props => {
  const {onChange, setIsSearching, hideCancel} = props;
  const [textSearch, setTextSearch] = useState('');

  const searching = useRef();

  useEffect(() => {
    return () => {
      if (searching.current) clearTimeout(searching.current);
    };
  }, []);

  const handleSearch = newText => {
    let text = newText;
    text = text.trimLeft();

    if (text === textSearch) return;

    setTextSearch(text);
    if (searching.current) clearTimeout(searching.current);
    searching.current = setTimeout(() => {
      if (onChange) onChange(text);
    }, 500);
  };

  const onClose = () => {
    setIsSearching && setIsSearching(false);
    if (searching.current) clearTimeout(searching.current);
    onChange('');
  };

  const onRemove = () => {
    console.log('sssss');
    if (textSearch.trim()) handleSearch('');
    else setTextSearch('');
  };

  return (
    <View
      style={{
        position: 'absolute',
        width: '95%',
        zIndex: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        alignSelf: 'center',
        marginTop: Platform.OS === 'ios' ? 28 : 8,
        height: 40,
      }}>
      <TouchableOpacity onPress={() => onChange(textSearch)} style={{paddingHorizontal: 10,fontSize:18}}>
        <Icon name="search" color="rgba(46, 149, 46, 1)" size={20} />
      </TouchableOpacity>
      <TextInput
        placeholder="Tìm kiếm"
        value={textSearch}
        onChangeText={handleSearch}
        style={{flex: 1}}
        onSubmitEditing={Keyboard.dismiss}
      />
      <TouchableOpacity>
        <Icon name="remove" type="MaterialIcons" onPress={onRemove} color="rgba(46, 149, 46, 1)" size={20} />
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={{paddingHorizontal: 10,}} onPress={onClose}>
          <Text style={{color:"rgba(46, 149, 46, 1)"}} >ĐÓNG</Text>
        </View>
      </TouchableOpacity>
     
    </View>
  );
};

export default SearchBox;
