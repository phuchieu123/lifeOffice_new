import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  processColor,
} from 'react-native';

import { PieChart } from 'react-native-charts-wrapper';
import NoItem from '../CustomMultiSelect/components/NoItem';

class PieChartScreen extends React.Component {

  constructor() {
    super();
    this.state = {}
  }

  componentDidUpdate(preProps, preState) {
    const { data, label, description = 'Biểu đồ' } = this.props
    if (data && preProps.data !== data) {
      const newData = data.filter(e => e.value)
      this.setState({
        noData: !newData.length,
        legend: {
          enabled: true,
          textSize: 15,
          form: 'CIRCLE',
          horizontalAlignment: "CENTER",
          verticalAlignment: "BOTTOM",
          orientation: "VERTICAL",
          wordWrapEnabled: true,
          // yEntrySpace: 50
        },
        data: {
          dataSets: [{
            values: newData.map(({ value, label }) => ({ label, value })),
            label,
            config: {
              colors: newData.map(e => processColor(e.color)),
              valueTextSize: 16,
              valueTextColor: processColor('green'),
              sliceSpace: 5,
              selectionShift: 13,
              // xValuePosition: "OUTSIDE_SLICE",
              // yValuePosition: "OUTSIDE_SLICE",
              valueFormatter: "#.#'%'",
              valueLineColor: processColor('green'),
              valueLinePart1Length: 0.5
            }
          }],
        },
        highlights: [{ x: 2 }],
        description: {
          text: ' ',
          textSize: 15,
          textColor: processColor('darkgray'),
        }
      })
    }
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    let newState
    if (entry == null) {
      newState = { ...this.state, selectedEntry: null }
    } else {
      newState = { ...this.state, selectedEntry: JSON.stringify(entry) }
    }

    const { data } = event.nativeEvent
    if (data) {
      newState.centerText = `${data.label}: ${data.value}`
    }
    this.setState(newState)
  }

  render() {

    const { centerText, data, noData } = this.state


    if (!data) return null
    if (noData) return <NoItem />
    return (
      <PieChart
        style={styles.chart}
        logEnabled={true}
        // chartBackgroundColor={processColor('pink')}
        chartDescription={this.state.description}
        data={this.state.data}
        legend={this.state.legend}
        highlights={this.state.highlights}
        extraOffsets={{ left: 5, top: 5, right: 5, bottom: 5 }}
        entryLabelColor={processColor('green')}
        entryLabelTextSize={0}
        entryLabelFontFamily={'HelveticaNeue-Medium'}
        drawEntryLabels={false}
        rotationEnabled={true}
        rotationAngle={45}
        usePercentValues={true}
        styledCenterText={{ text: centerText, color: processColor('gray'), size: 16 }}
        centerTextRadiusPercent={100}
        holeRadius={40}
        holeColor={processColor('#f0f0f0')}
        transparentCircleRadius={45}
        transparentCircleColor={processColor('#f0f0f088')}
        maxAngle={360}
        onSelect={this.handleSelect.bind(this)}
        onChange={(event) => console.log('event.nativeEvent', event.nativeEvent)}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chart: {
    flex: 1
  }
});

export default PieChartScreen;

