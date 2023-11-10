import React, { useEffect, useState } from 'react';

import {
  Body,
  Icon,
  ListItem,
  Right,
  Text
} from 'native-base';

export default ListCustom = ({ item, list, setList, single }) => {
  const { _id } = item;
  const [isChecked, setIsCheck] = useState(false);

  useEffect(() => setIsCheck(list.includes(_id)), [_id, list]);

  const handlePress = () => {
    if (single) {
      setList(isChecked ? list.filter((e) => e !== _id) : [list,_id]);
     }
    else {
      setList(isChecked ? list.filter((e) => e !== _id) : [...list, _id]);
    }
  };

  return (
    <ListItem button onPress={handlePress}>
      <Body>
        <Text>{item.name}</Text>
      </Body>
      <Right>{isChecked && <Icon name="check" type="MaterialIcons" />}</Right>
    </ListItem>
  );
};
