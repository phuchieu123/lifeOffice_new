import React from 'react';
import { Text, View } from 'native-base';
import styles from './styles';

export default LegendOrg = ({ legendData }) => {

    return legendData.map((item) => (
        <View style={styles.legendContainer} key={item.name}>
            <View style={[styles.legend, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.name}</Text>
        </View>
    ));
};
