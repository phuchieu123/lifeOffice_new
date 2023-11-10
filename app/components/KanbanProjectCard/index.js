/**
 *
 * KanbanProjectCard
 *
 */

import React from 'react';
import { ImageBackground } from 'react-native';
// import styled from 'styled-components';
import moment from 'moment';
import { Dimensions } from 'react-native';

import { Body, Button, Card, CardItem, Icon, Left, Right, Text, Thumbnail, View } from 'native-base';
import ProgressCircle from 'react-native-progress-circle';
import images from '../../images';
import { priorityData } from '../../utils/constants';
import CustomMultiSelect from '../CustomMultiSelect';

const screenWitdh = Dimensions.get('screen').width;
const minWidth = screenWitdh - 25 < 400 ? screenWitdh - 25 : 400;

function KanbanProjectCard(props) {
  const { item, handleCreateTask, handleOpenTaskDetails, handleUpdateTask, kanbanOption } = props;
  return (
    <View>
      <Card style={{ height: '100%', marginRight: 5, minWidth, maxWidth: screenWitdh - 10 }}>
        <CardItem
          header
          bordered
          cardBody
          style={{
            alignSelf: 'stretch',
            justifyContent: 'center',
            height: 45,
            alignItems: 'center',
          }}>
          <Left>
            <Text style={{ flex: 1, fontWeight: '700' }} numberOfLines={1}>
              {item.name}
            </Text>
          </Left>
          <Right style={{ justifyContent: 'flex-end' }}>
            <Button onPress={() => handleCreateTask(item)}>
              <Icon name="plus" type="EvilIcons" />
            </Button>
          </Right>
        </CardItem>
        {item &&
          item.children &&
          item.children.map(task => {
            const currentDate = new moment();
            const startDate = moment(task.startDate);
            const endDate = moment(task.endDate);
            const timeRange = endDate.diff(startDate, 'days');
            const curentTimeRange = currentDate.diff(startDate, 'days');

            let currentTimeProgress = 0;
            if (timeRange > 0) {
              currentTimeProgress = curentTimeRange > 0 ? (curentTimeRange / timeRange) * 100 : 0;
            } else {
              currentTimeProgress = 100;
            }
            return (
              <Card transparent>
                <CardItem bordered cardBody>
                  <ImageBackground
                    source={
                      task.avatar
                        ? {
                            uri: task.avatar,
                          }
                        : images.background
                    }
                    style={{ height: 200, width: '100%', flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', padding: 10 }}>
                      <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        <Button
                          rounded
                          small
                          style={{ width: 'auto', height: 35, backgroundColor: 'orange', marginBottom: 5 }}>
                          <Text>{priorityData.find(c => c.value === task.priority).text}</Text>
                        </Button>
                      </View>
                      <Button
                        rounded
                        small
                        onPress={() => handleOpenTaskDetails(task)}
                        iconLeft
                        style={{
                          width: '100%',
                          height: 35,
                          backgroundColor: 'rgba(52, 52, 52, 0.8)',
                          justifyContent: 'center',
                        }}>
                        <Icon name="gear" type="EvilIcons" />
                        <Text numberOfLines={1}>{task.name}</Text>
                      </Button>
                    </View>
                  </ImageBackground>
                </CardItem>
                <CardItem bordered style={{ flex: 1 }}>
                  <Button transparent iconRight small>
                    <Icon active name="navicon" type="FontAwesome" />
                  </Button>
                  <Text>Trạng thái: </Text>
                  <Right style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <CustomMultiSelect
                      single
                      uniqueKey={'code'}
                      displayKey={'name'}
                      items={kanbanOption}
                      handleSelectItems={value => handleUpdateTask(task, value[0])}
                      canRemove={false}
                      height={30}
                      selectedItems={[task.kanbanCode]}
                      fontWeight="700"
                    />
                  </Right>
                </CardItem>
                <CardItem bordered>
                  <Button transparent iconRight small>
                    <Icon active name="users" type="FontAwesome" />
                  </Button>
                  <Text>Người tham gia: </Text>
                  <Right style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                    {task.join && task.join.length > 0
                      ? task.join.map(user => (
                          <Thumbnail style={{ width: 24, height: 24 }} key={user._id} source={images.userImage} />
                        ))
                      : null}
                  </Right>
                </CardItem>
                <CardItem bordered style={{ backgroundColor: '#f2f2f2' }}>
                  <Body>
                    <View
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        justifyContent: 'center',
                        alignContent: 'center',
                      }}>
                      <ProgressCircle
                        percent={currentTimeProgress}
                        radius={70}
                        borderWidth={8}
                        color="orange"
                        shadowColor="#999"
                        bgColor="#fff"
                        outerCircleStyle={{ marginRight: 30 }}>
                        <Text style={{ fontSize: 14 }}>{'Timeline'}</Text>
                        <Text style={{ fontSize: 24, fontWeight: '700' }}>{timeRange} ngày</Text>
                        <Text style={{ fontSize: 14 }}>{startDate.format('DD/MM/YYYY')}</Text>
                        <Text style={{ fontSize: 14 }}>{endDate.format('DD/MM/YYYY')}</Text>
                      </ProgressCircle>
                      <ProgressCircle
                        percent={task.progress}
                        radius={70}
                        borderWidth={8}
                        color="green"
                        shadowColor="#999"
                        bgColor="#fff">
                        <Text style={{ fontSize: 24, fontWeight: '700' }}>{task.progress}%</Text>
                        <Text style={{ textAlign: 'center', fontSize: 16, flexWrap: 'wrap' }}>
                          Tiến độ
                        </Text>
                      </ProgressCircle>
                    </View>
                  </Body>
                </CardItem>
              </Card>
            );
          })}
      </Card>
    </View>
  );
}

export default KanbanProjectCard;
