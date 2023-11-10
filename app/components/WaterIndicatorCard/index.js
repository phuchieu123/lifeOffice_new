import React, { memo } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
// import styled from 'styled-components';
import { Body, Button, Card, CardItem, Icon, Text, View } from 'native-base';
import ProgressCircle from 'react-native-progress-circle';
import images from '../../images';

function WaterIndicatorCard(props) {
  // const { project } = props;

  // const currentDate = new moment();
  // const startDate = moment(project.startDate);
  // const endDate = moment(project.endDate);
  // const timeRange = endDate.diff(startDate, 'days');
  // const curentTimeRange = currentDate.diff(startDate, 'days');
  // let currentTimeProgress = 0;
  // if (timeRange > 0) {
  //   currentTimeProgress = curentTimeRange > 0 ? (curentTimeRange / timeRange) * 100 : 0;
  // } else {
  //   currentTimeProgress = 100;
  // }

  return (
    <Card>
      <CardItem cardBody>
        <Body>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row' }}
            onPress={() => { }}>
            <ImageBackground
              source={
                // project.avatar
                //   ? {
                //     uri: project.avatar,
                //   }
                //   : 
                images.background
              }
              style={{ height: 200, width: '100%', flex: 1 }}>
              <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row' }}>
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                  <Button
                    style={styles.button}
                    rounded
                    small
                    iconLeft
                    inconRight
                    onPress={() => { }}>
                    <Text style={styles.btn_text} numberOfLines={1}>
                      Mã khách hàng
                    </Text>
                  </Button>
                  <Button
                    style={styles.button}
                    rounded
                    small
                    iconLeft
                    inconRight
                    onPress={() => { }}>
                    <Text style={styles.btn_text} numberOfLines={1}>
                      Tên khách hàng
                    </Text>
                  </Button>
                  <Button
                    style={styles.button}
                    rounded
                    small
                    iconLeft
                    inconRight
                    onPress={() => { }}>
                    <Icon type="FontAwesome" name="gears" />
                    <Text style={styles.btn_text} numberOfLines={1}>
                      Căn - Tầng
                    </Text>
                  </Button>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Circle>
                    <Text style={styles.cirlce_text}>Chỉ số nước</Text>
                  </Circle>
                  <Circle>
                    <Text style={styles.cirlce_text}>Tiền</Text>
                  </Circle>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </Body>
      </CardItem>
    </Card>
  );
}

export default memo(WaterIndicatorCard);

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    height: 'auto',
    marginBottom: 5,
    marginLeft: 5
  },
  btn_text: {
    textAlign: "center",
    flex: 1,
  },
  cirlce_text: {
    fontSize: 12,
    textAlign: "center",
  },
  circle: {
    marginRight: 5,
    marginBottom: 5,
  }
})

const Circle = ({ children }) => {
  return <ProgressCircle
    // percent={project.progress}
    radius={40}
    borderWidth={5}
    color="green"
    shadowColor="#999"
    bgColor="#fff"
    outerCircleStyle={styles.circle}>
    {children}
  </ProgressCircle>
}