import React, {useState, useEffect} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {scale} from 'react-native-size-matters';
import _ from 'lodash';
import RadioCustom from './Radio';
import theme from '../../../utils/customTheme';

const RenderItem = props => {
  const {
    item,
    title,
    value,
    readOnly,
    selectedItems,
    onSelect,
    enableInfo,
    onInfoPress,
  } = props;

  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (!readOnly && Array.isArray(selectedItems)) {
      const result = selectedItems.find(e => e === value);
      if (result !== selected) setSelected(result);
    }
  }, [value, selectedItems]);

  const onRemove = () => {
    // setSelected(false)
    onSelect(selectedItems.filter(e => e !== value));
  };

  const onAdd = () => {
    // setSelected(false)
    onSelect([...selectedItems, value]);
  };

  const onItemPress = () => {
    if (readOnly) return;
    else if (selected) onRemove();
    else onAdd();
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 10,
        marginRight: 10,
        borderBottomWidth: 1,
        borderBlockColor: '#aaa',
        alignItems: 'center'
      }}
      onPress={onItemPress}>
      <Text
        style={{color: 'black', paddingStart: 5, paddingVertical: 10}}
        onPress={() => onItemPress()}>
        {title}
      </Text>
      <View style={{ flexDirection: 'row'}}>
        {readOnly ? null : (
          <RadioCustom selected={selected} toggleRadio={onItemPress} />
        )}
        {enableInfo ? (
          <TouchableOpacity
            style={{
              backgroundColor: theme.brandWarning,
              borderRadius: 60,
              height: 20,
              width: 20,
              marginTop: 1,
              marginLeft: 5,
              justifySelf: 'center',
              
            }}
            onPress={() => onInfoPress(item)}>
            <Icon
              type="Ionicons"
              name="information"
              style={{
                fontSize: 15,
                color: 'white',
                position: 'absolute',
                alignSelf: 'center',
                marginTop: 2,
              }}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default RenderItem;
