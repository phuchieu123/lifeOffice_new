import { View } from 'native-base';
import React from 'react';
import { Text } from 'react-native-svg';
import LegendOrg from './LegendOrg';

export default PieChartCustom = ({ data }) => {
    return (
        <View>
            {/* <PieChart
                style={{ height: styles.deviceWidth }}
                valueAccessor={({ item }) => item.total}
                data={data}
                spacing={0}
                outerRadius={'95%'}>
                <Labels />
            </PieChart> */}

            <LegendOrg
                legendData={data.map((e) => {
                    return { ...e, color: e.svg.fill };
                })}
            />
        </View>
    );
};

const Labels = ({ slices, height, width }) => {
    return slices.map((slice, index) => {
        const { labelCentroid, pieCentroid, data } = slice;
        return (
            <Text
                key={index}
                x={pieCentroid[0]}
                y={pieCentroid[1]}
                fill={'white'}
                textAnchor={'middle'}
                alignmentBaseline={'middle'}
                fontSize={24}
                stroke={'black'}
                strokeWidth={0.2}>
                {data.total}
            </Text>
        );
    });
};
