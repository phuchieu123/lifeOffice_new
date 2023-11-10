import React from 'react';
import { Text, View } from 'native-base';
import styles from './styles';

export default Legend = ({ legendData }) => {
  return legendData.map((item) => (
    <View style={styles.legendContainer} key={item.title}>
      <View style={[styles.legend, { backgroundColor: item.color }]} />
      <Text style={styles.legendText}>{item.title}</Text>
    </View>
  ));
};
