import React, {useRef} from 'react';
import {View, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const SearchHeader = props => {
  const {onSearch, loading, setLoading} = props;
  const timer = useRef(null);

  const onSearchText = value => {
    if (!loading && setLoading) setLoading(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSearch(value), 500);
  };

  return (
    <View
      regular
      style={{
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 5,
        marginTop: 5,
        height: 40,
        borderWidth: 1,
        borderColor:'#bbb',
        flexDirection:'row',
        alignItems: 'center'
      }}>
      <Icon
        type="FontAwesome"
        name="search"
        color="black"
        style={{fontSize: 18, paddingHorizontal: 10}}
      />
      <TextInput placeholder="Tìm kiếm..." onChangeText={onSearchText} style={{flex: 1}} />
    </View>
  );
};

export default SearchHeader;
