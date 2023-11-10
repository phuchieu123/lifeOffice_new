import { values } from 'lodash';
import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View, processColor
} from 'react-native';

import { BarChart } from 'react-native-charts-wrapper';

class StackedBarChartScreen extends React.Component {

  constructor() {
    super();
    this.state = {}
  }

  componentDidUpdate(preProps, preState) {
    const { data, label, description = 'Biểu đồ', } = this.props
    if (data && preProps.data !== data) {
      this.setState(data)
    }
  }


  componentDidMount() {
    this.setState({ ...this.state, highlights: [{ x: 1, y: 40 }, { x: 2, y: 50 }] })
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (entry == null) {
      this.setState({ ...this.state, selectedEntry: null })
    } else {
      this.setState({ ...this.state, selectedEntry: JSON.stringify(entry) })
    }
  }

  render() {
    const { centerText, data, noData } = this.state
    if (!data) return null
    if (noData) return <NoItem />

    return (
      <View style={{ flex: 1 }}>

        {/* <View style={{ height: 80 }}>
          <Text> selected entry</Text>
          <Text> {this.state.selectedEntry}</Text>
        </View> */}

        <View style={styles.container}>
          <BarChart
            style={styles.chart}
            chartDescription={{
              text: '',
              textSize: 15,
              textColor: processColor('darkgray'),
            }}
            xAxis={this.state.xAxis}
            data={this.state.data}
            legend={this.state.legend}
            drawValueAboveBar={false}
            onSelect={this.handleSelect.bind(this)}
            onChange={(event) => console.log(event.nativeEvent)}
            highlights={this.state.highlights}
            marker={this.state.marker}

          />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  }
});


export default StackedBarChartScreen;
