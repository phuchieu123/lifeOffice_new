import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Button, Text, Right, } from 'native-base';
import styles from './styles';
import _ from 'lodash';

export default HistoryCard = (props) => {
  const { item, date, onPress } = props
  const { name, detail, faceTk } = item;

  return (
    <Button transparent style={{ marginBottom: 5, height: 'auto' }}>
      {/* <Body> */}
      <Text style={styles.name}>{name || 'Không xác định'}</Text>
      {detail && <Text style={styles.detail}>{detail}</Text>}
      {/* </Body> */}

      <Right style={styles.right}>
        {faceTk.map((e, index) => {
          const isCheckIn = _.has(e, 'in')
          return <TouchableOpacity
            key={`${name}_${e.in || e.out}_${index}`}
            onPress={() => onPress({ ...e, name })}
            style={{ width: '100%' }}
          >
            {isCheckIn
              ? <Text style={styles.start}>{e.in}</Text>
              : <Text style={styles.end}>{e.out}</Text>
            }
          </TouchableOpacity>
        })}
      </Right>
    </Button >
  );
};
