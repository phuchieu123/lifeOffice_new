import React, { useEffect, useState, useRef } from 'react';
import { Icon, Button, Text, Item, Input } from 'native-base';
import { Keyboard } from 'react-native';

const SearchBox = (props) => {
  const { query, setQuery, setIsSearching } = props;
  const [textSearch, setTextSearch] = useState();
  
  const searching = useRef();

  useEffect(() => {
    return () => {
      if (searching.current) clearTimeout(searching.current);
    };
  }, []);

  useEffect(() => {
    if (query.filter && query.filter.$or) {
      const found = query.filter.$or.find((e) => e.name);
      setTextSearch(found.name.$regex);
    }
  }, [query]);

  const handleSearch = (text) => {
    setTextSearch(text);
    if (searching.current) clearTimeout(searching.current);
    searching.current = setTimeout(() => {
      const newQuery = { ...query , limit:10,skip:0 };
      delete newQuery.filter.$or;

      if (text.trim() !== '') {
        newQuery.filter.$or = [
          {
            name: {
              $regex: text.trim(),
              $options: 'gi',
            },
          },
        ];
      }
      setQuery(newQuery);
    }, 0);
 
  };

  return (
    <Item>
      <Button transparent onPress={() => handleSearch(textSearch)}>
        <Icon name="search" />
      </Button>
      <Input placeholder="Tìm kiếm" value={textSearch} onChangeText={handleSearch} onSubmitEditing={Keyboard.dismiss} />
      <Button iconLeft transparent onPress={() => handleSearch('')}>
        <Icon name="remove" type="MaterialIcons" />
      </Button>
      <Button transparent onPress={() => setIsSearching(false)}>
        <Text>Đóng</Text>
      </Button>
    </Item>
  );
};

export default SearchBox;
