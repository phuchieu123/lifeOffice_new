import { View } from 'native-base';
import React from 'react';
import Legend from './Legend';

export default BarChartCustom = ({ data }) => {
  const { barData, yData, xData, legendData } = data;

  return (
    <View>
      {/* <View style={styles.chartView}>
        <YAxis
          data={yData}
          contentInset={styles.contentInsetYAsis}
          svg={{
            fontSize: 17,
            fill: 'black',
          }}
          numberOfTicks={5}
          formatLabel={(value) => `${value}`}
        />
        <BarChart
          style={styles.chart}
          numberOfTicks={5}
          spacingInner={0.3}
          spacingOuter={0.5}
          data={barData}
          yAccessor={({ item }) => item.value}
          contentInset={styles.contentInsetYAsis}>
          <Grid />
        </BarChart>
      </View>

      <XAxis
        style={styles.chartXAxis}
        data={xData}
        formatLabel={(value, index) => xData[index].value}
        contentInset={styles.contentInsetXAsis}
        svg={{
          fontSize: 17,
          fill: 'black',
        }}
      /> */}

      <Legend legendData={legendData} />
    </View>
  );
};
