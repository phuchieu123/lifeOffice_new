import React, { useEffect, useState, useRef } from 'react';
import { Text, Item, Icon, Button, Input } from 'native-base';

const TextSearch = (props) => {
  const { onSearch, onClose } = props;

  const [textSearch, setTextSearch] = useState('');

  const searchTimeout = useRef();

  useEffect(() => {
    setTextSearch(props.textSearch);
  }, [props.textSearch]);

  const onChangeText = (text) => {
    setTextSearch(text);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => onSearch(text), 500);
  };

  return (
    <Item>
      <Button transparent onPress={() => onSearch(textSearch)}>
        <Icon name="search" />
      </Button>
      <Input
        placeholder="Tìm kiếm"
        value={textSearch}
        onChangeText={(text) => onChangeText(text)}
        autoCapitalize="none"
      />
      <Button iconLeft transparent onPress={() => onChangeText('')}>
        <Icon name="remove" type="MaterialIcons" />
      </Button>
      <Button transparent onPress={onClose}>
        <Text>Đóng</Text>
      </Button>
    </Item>
  );
};

export default TextSearch;
