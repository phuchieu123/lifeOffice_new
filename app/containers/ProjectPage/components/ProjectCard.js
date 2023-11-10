/**
 *
 * ProjectCard
 *
 */

import React, { useEffect, useState } from 'react';
import { ImageBackground, TouchableOpacity } from 'react-native';
// import styled from 'styled-components';
import _ from 'lodash';
import moment from 'moment';
import { Body, Button, Card, CardItem, Icon, Text, View } from 'native-base';
import ProgressCircle from 'react-native-progress-circle';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { navigate } from '../../../RootNavigation';
import Search from '../../../components/CustomMultiSelect/Search';
import images from '../../../images';
import { makeSelectKanbanTaskConfigs } from '../../App/selectors';
function ProjectCard(props) {
  const { project, parentId, kanbanTaskConfigs, updateBusinessOp } = props;
  const [kanbanStatusAll, setKanbanStatusAll] = useState([]);
  const [customColor, setCustomColor] = useState()
  const [currentTimeProgress, setCurrentTimeProgress] = useState(0)
  const startDate = moment(project.startDate);
  const endDate = moment(project.endDate);
  const timeRange = endDate.diff(startDate, 'days');
  useEffect(() => {
    setCustomColor(kanbanTaskConfigs.find((item) => project.kanbanStatus === item.type ? item.color ? item.color : null : null))

    const currentDate = new moment();
    const curentTimeRange = currentDate.diff(startDate, 'days');
    let currentTimeProgress = 0;
    if (timeRange > 0) {
      currentTimeProgress = curentTimeRange > 0 ? (curentTimeRange / timeRange) * 100 : 0;
    } else {
      currentTimeProgress = 100;
    }
    if (kanbanTaskConfigs) {
      setKanbanStatusAll(kanbanTaskConfigs[0])
    }
    setCurrentTimeProgress(currentTimeProgress)
  }, [])

  const openChildProject = () => navigate('ChildProjectPage', { project, parentId });

  const openAddProject = () => navigate('AddProject', { project, parentId });

  const onPressGear = () => navigate('ProjectDetail', { project })

  return (
    <View>
      <Card style={{ borderRadius: 20, top: 0 }}>
        <CardItem cardBody >
          <Body>
            <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row' }}>
              <ImageBackground
                source={project.avatar ? { uri: project.avatar, } : images.background}
                style={{ height: 200, width: '100%', flex: 1, }}
                imageStyle={{ borderRadius: 10 }}
              >
                <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flex: 0.7, justifyContent: 'flex-end' }}>
                    {_.get(project, 'totalChild', 0) > 0 ? (
                      <Button
                        style={{
                          backgroundColor: 'rgba(52, 52, 52, 0.8)',
                          height: 'auto',
                          marginBottom: 4,
                          marginLeft: 4,
                        }}
                        rounded
                        small
                        iconLeft
                        inconRight
                        onPress={openChildProject}>
                        <Icon type="FontAwesome" name="bars" />
                        <Text style={{ flex: 1, fontSize: 10 }} numberOfLines={2}>
                          {`${project.totalChild} công việc`}
                        </Text>
                      </Button>
                    ) : <Button
                      style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.8)',
                        height: 'auto',
                        marginBottom: 4,
                        marginLeft: 4,
                      }}
                      rounded
                      small
                      iconLeft
                      inconRight
                      onPress={openAddProject}>
                      <Icon type="Feather" name="plus" />
                      <Text style={{ flex: 1, fontSize: 10 }} numberOfLines={2}>
                        Tạo công việc
                      </Text>
                    </Button>}

                    <Button
                      style={{
                        backgroundColor: 'rgba(52, 52, 52, 0.8)',
                        height: 'auto',
                        marginBottom: 4,
                        marginLeft: 4,
                      }}
                      rounded
                      small
                      iconLeft
                      inconRight
                      onPress={onPressGear}>
                      <Icon type="FontAwesome" name="gears" />
                      <Text style={{ flex: 1, fontSize: 10, }} numberOfLines={2}>
                        {project.name}
                      </Text>
                    </Button>

                    <View style={{
                      backgroundColor: 'rgba(52, 52, 52, 0.8)',
                      borderRadius: 30,
                      height: 35,
                      marginBottom: 10,
                      flexDirection: 'row'
                    }}>
                      <Icon name='triangle-down' type='Octicons' style={{ color: '#fff', fontSize: 20, marginHorizontal: 20, marginTop: 10 }} />
                      <Search single
                        disableIcon
                        items={kanbanTaskConfigs}
                        uniqueKey="type"
                        displayKey='name'
                        handleSelectObjectItems={(value) => updateBusinessOp(project, value[0])}
                        selectedItems={project.kanbanStatus ? [project.kanbanStatus] : [kanbanStatusAll.type]}
                        styles={{ color: '#fff', fontSize: 12, top: -3 }}
                        buttonStyles={{ alignSelf: 'flex-start' }}
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', }}>
                    <ProgressCircle
                      percent={currentTimeProgress}
                      radius={50}
                      borderWidth={5}
                      color="orange"
                      shadowColor="#999"
                      bgColor="#fff"
                      outerCircleStyle={{ marginRight: 5 }}>
                      <Text style={{ fontSize: 10 }}>Thời gian</Text>
                      <Text style={{ fontSize: 14 }}>{timeRange} ngày</Text>
                      <Text style={{ fontSize: 10 }}>{startDate.format('DD/MM/YYYY')}</Text>
                      <Text style={{ fontSize: 10 }}>{endDate.format('DD/MM/YYYY')}</Text>
                    </ProgressCircle>
                    <ProgressCircle
                      percent={project.progress}
                      radius={50}
                      borderWidth={5}
                      color="green"
                      shadowColor="#999"
                      bgColor="#fff">
                      <Text style={{ fontSize: 14 }}>{project.progress && project.progress.toFixed(2)}%</Text>
                      <Text style={{ textAlign: 'center', fontSize: 12 }}>Tiến độ</Text>
                    </ProgressCircle>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </Body>
        </CardItem>
      </Card>
    </View >

  );
}

const mapStateToProps = createStructuredSelector({
  kanbanTaskConfigs: makeSelectKanbanTaskConfigs(),

});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(ProjectCard);



