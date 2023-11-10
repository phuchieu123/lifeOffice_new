/**
 *
 * KanbanBusinessOpCard
 *
 */
import React, { memo } from 'react';
// import styled from 'styled-components';
import moment from 'moment';
import { Dimensions, StyleSheet, ImageBackground } from 'react-native';
import Swiper from 'react-native-swiper';
import ProgressCircle from 'react-native-progress-circle';

import {
  Card,
  CardItem,
  View,
  Text,
  Thumbnail,
  Right,
  Icon,
  Left,
  Button,
  Body,
  Title,
  List,
  ListItem,
} from 'native-base';
import images from '../../images';
import CustomMultiSelect from '../CustomMultiSelect';
import { formatNumber } from '../../utils/common';
function KanbanBusinessOpCard(props) {
  const { kanban, kanbanOption, createBusinessOp, updateBusinessOp, openBusinessDetail, deleteBusinessOp } = props;
  const screenWitdh = Dimensions.get('screen').width;
  const minWidth = screenWitdh - 10 < 400 ? screenWitdh - 10 : 400;
  return (
    <View style={{ flex: 1, flexDirection: 'column' }} padder>
      <Button
        iconLeft
        small
        block
        full
        style={{ backgroundColor: kanban.color, borderRadius: 20 }}
        onPress={() => createBusinessOp(kanban)}>
        <Icon name="plus" type="FontAwesome" />
        <Text numberOfLines={1}>{kanban.name}</Text>
      </Button>
      <Swiper horizontal={false} showsPagination={false} loop={false}>
        {kanban &&
          kanban.businessOps &&
          kanban.businessOps.map(businessOp => {
            return (
              <View key={businessOp._id} style={{ flex: 1 }}>
                <Card style={{ flex: 1 }}>
                  <CardItem bordered cardBody>
                    <ImageBackground
                      source={
                        businessOp.avatar
                          ? {
                              uri: businessOp.avatar,
                            }
                          : images.background
                      }
                      style={{ height: 200, width: '100%', flex: 1 }}>
                      <View style={{ flex: 1, justifyContent: 'flex-end', padding: 10 }}>
                        <Button
                          rounded
                          small
                          onPress={() => openBusinessDetail(businessOp)}
                          iconLeft
                          style={{
                            width: '100%',
                            height: 35,
                            backgroundColor: 'rgba(52, 52, 52, 0.8)',
                            justifyContent: 'center',
                          }}>
                          <Icon name="gear" type="EvilIcons" />
                          <Text numberOfLines={1}>{businessOp.name}</Text>
                        </Button>
                      </View>
                    </ImageBackground>
                  </CardItem>
                  <CardItem bordered>
                    <Button transparent iconRight small>
                      <Icon active name="navicon" type="FontAwesome" style={{ color: kanban.color }} />
                    </Button>
                    <Text>Trạng thái: </Text>
                    <Right style={{ flex: 1, flexDirection: 'row' }}>
                      <CustomMultiSelect
                        single
                        items={kanbanOption}
                        handleSelectItems={value => updateBusinessOp(businessOp, value[0])}
                        canRemove={false}
                        height={30}
                        selectedItems={[businessOp.kanbanStatus]}
                        fontWeight="700"
                      />
                    </Right>
                  </CardItem>
                  <CardItem bordered>
                    <Button transparent iconRight small>
                      <Icon active name="user-circle" type="FontAwesome" style={{ color: kanban.color }} />
                    </Button>
                    <Text>Người tham gia: </Text>
                    <Right style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row' }}>
                      {businessOp.responsibilityPerson && businessOp.responsibilityPerson.length > 0
                        ? businessOp.responsibilityPerson.map(user => (
                            <Thumbnail
                              style={{ width: 24, height: 24 }}
                              key={user._id}
                              source={user.avatar ? { uri: user.avatar } : images.userImage}
                            />
                          ))
                        : null}
                    </Right>
                  </CardItem>
                  <CardItem bordered style={{ backgroundColor: '#f2f2f2', flex: 1 }}>
                    <Body>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                        }}>
                        <ProgressCircle
                          percent={100}
                          radius={70}
                          borderWidth={8}
                          color="orange"
                          shadowColor="#999"
                          bgColor="#fff"
                          outerCircleStyle={{ marginRight: 0 }}>
                          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
                            {moment().diff(moment(businessOp.updatedAt), 'days')}
                          </Text>
                          <Text style={{ fontSize: 14, textAlign: 'center' }}>ngày chưa hoạt động</Text>
                        </ProgressCircle>
                        <List style={{ flex: 1 }}>
                          {businessOp.customer && businessOp.customer.name && (
                            <ListItem>
                              <Icon name="user" type="FontAwesome" style={{ fontSize: 20, paddingRight: 8 }} />
                              <Text numberOfLines={1}>{businessOp.customer.name}</Text>
                            </ListItem>
                          )}
                          <ListItem>
                            <Icon name="calendar" type="FontAwesome" style={{ fontSize: 20, paddingRight: 8 }} />
                            <Text>{moment(businessOp.createdAt).format('DD/MM/YYYY')}</Text>
                          </ListItem>
                          {businessOp.supervisor && businessOp.supervisor.length > 0 && (
                            <ListItem>
                              <Icon name="eye" style={{ fontSize: 20, paddingRight: 8 }} />
                              <Text numberOfLines={1}>{businessOp.supervisor[0].name}</Text>
                            </ListItem>
                          )}
                          {businessOp.value && businessOp.value.amount != null && (
                            <ListItem b>
                              <Icon name="money" type="FontAwesome" style={{ fontSize: 20, paddingRight: 8 }} />
                              <Text>{formatNumber(businessOp.value.amount)}</Text>
                            </ListItem>
                          )}
                        </List>
                      </View>
                    </Body>
                  </CardItem>
                </Card>
              </View>
            );
          })}
      </Swiper>
    </View>
  );
}

export default memo(KanbanBusinessOpCard);
