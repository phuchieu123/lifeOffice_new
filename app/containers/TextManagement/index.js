import { Container, Tab, TabHeading, Tabs, Text, Icon, Card, CardItem, Body, View, Button } from 'native-base';
import { BackHandler, DeviceEventEmitter, TouchableWithoutFeedback, ScrollView } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import CustomHeader from '../../components/Header';
import RightHeader from '../../components/CustomFilter/RightHeader';
import SearchBox from '../../components/SearchBox';
import ListPage from './components/ListPage';
import { getFilterOr } from '../../utils/common';
import { makeSelectProfile } from '../App/selectors';
import { navigate } from '../../RootNavigation';
import {
  API_INCOMMING_DOCUMENT,
  API_OUTGOING_DOCUMENT,
  API_INCOMMING_DOC_PROCESS,
  API_OUTGOING_DOC_PROCESS,
} from '../../configs/Paths';
import { getDocument } from './actions';
import makeSelectTextManagement from './selectors';
import _ from 'lodash';
import moment from 'moment';

export function TextManagement(props) {
  useInjectReducer({ key: 'textManagement', reducer });
  useInjectSaga({ key: 'textManagement', saga });

  const { route, profile, navigation } = props;
  const { type = [], _id } = profile;
  const { params } = route;
  const typeText = _.get(params, 'typeText');

  const DEFAULT_QUERY = {
    limit: 50,
    sort: '-updatedAt',
    filter: {},
  };

  const [isSeaching, setIsSearching] = useState(false);
  const [queryIn, setQueryIn] = useState(DEFAULT_QUERY);
  const [queryOut, setQueryOut] = useState(DEFAULT_QUERY);
  const [reload, setReload] = useState(0);
  const [handleSaveIn, setHandleSaveIn] = useState(1);
  const [handleSaveOut, setHandleSaveOut] = useState(1);
  const [tab, setTab] = useState(typeText);

  const handleReload = () => setReload((e) => e + 1);

  useEffect(() => {
    setTab(Number(typeText));
  }, [params]);

  useEffect(() => {
    if (type && type.length) {
      if (type.includes('outlineDoc')) {
        const newQueryIn = { ...queryIn };
        newQueryIn.filter.typeDoc = 'preliminaryDoc/roomDoc';
        setQueryIn(newQueryIn);
      } else {
        const newQueryIn = { ...queryIn };
        const { filter } = newQueryIn;
        delete filter.typeDoc;
        setQueryOut(newQueryIn);
      }
    } else {
      const newQueryIn = { ...queryIn };
      const { filter } = newQueryIn;
      delete filter.typeDoc;
      setQueryOut(newQueryIn);
    }
  }, [type]);

  useEffect(() => {
    if (type && type.length) {
      if (type.includes('outlineDoc')) {
        const newQueryOut = { ...queryOut };
        newQueryOut.filter.typeDoc = 'preliminaryDoc/roomDoc';
        setQueryOut(newQueryOut);
      } else {
        const newQueryOut = { ...queryOut };
        const { filter } = newQueryOut;
        delete filter.typeDoc;
        setQueryOut(newQueryOut);
      }
    } else {
      const newQueryOut = { ...queryOut };
      const { filter } = newQueryOut;
      delete filter.typeDoc;
      setQueryOut(newQueryOut);
    }
  }, [type]);

  useEffect(() => {
    if (handleSaveIn === 1) {
      const newQueryIn = { ...queryIn };
      const { filter } = newQueryIn;
      delete filter.stage;
      delete filter.processeds;
      setQueryIn(newQueryIn);
    } else if (handleSaveIn === 2) {
      const newQueryIn = { ...queryIn };
      newQueryIn.filter.stage = 'processing';
      newQueryIn.filter.processeds = { $in: [_id] };
      setQueryIn(newQueryIn);
    } else if (handleSaveIn === 3) {
      const newQueryIn = { ...queryIn };
      newQueryIn.filter.stage = 'complete';
      newQueryIn.filter.processeds = { $in: [_id] };
      setQueryIn(newQueryIn);
    } else {
      const newQueryIn = {};
      const { filter } = newQueryIn;
      delete filter.stage;
      delete filter.processeds;
      setQueryIn(newQueryIn);
    }
  }, [handleSaveIn]);

  useEffect(() => {
    if (handleSaveOut === 1) {
      const newQueryOut = {
        limit: 50,
        sort: '-updatedAt',
        codeStatus: 1,
      };
      setQueryOut(newQueryOut);
    } else if (handleSaveOut === 2) {
      const newQueryOut = { ...queryOut };
      newQueryOut.codeStatus = 3;
      newQueryOut.filter = {
        processeds: { $in: [_id] },
        completeStatus: { $ne: 'promulgated' },
        signingStatus: { $in: ['none', 'signed'] },
      };
      setQueryOut(newQueryOut);
    } else if (handleSaveOut === 3) {
      const newQueryOut = { ...queryOut };
      newQueryOut.codeStatus = 3;
      newQueryOut.filter = {
        processeds: { $in: [profile._id] },
        $or: [
          {
            stage: 'complete',
            completeStatus: 'promulgated',
          },
          {
            releasePartStatus: 'released',
            completePartUnit: profile && profile.organizationUnit && profile.organizationUnit.organizationUnitId,
          },
        ],
      };
      setQueryOut(newQueryOut);
    } else {
      const newQueryOut = {};
      setQueryOut(newQueryOut);
    }
  }, [handleSaveOut]);

  useEffect(() => {
    const updateEvent = DeviceEventEmitter.addListener('updateTextSuccess', (e) => {
      handleReload();
    });
    return () => {
      updateEvent.remove();
    };
  }, []);

  useEffect(() => {
    const backHandlerListener = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => {
      backHandlerListener.remove();
    };
  }, []);

  const customData = ({ data }) => {
    return data.map((item) => ({
      ...item,
    }));
  };

  const onSearchText = async (text) => {
    let newQueryIn = { ...queryIn };
    newQueryIn = getFilterOr(newQueryIn, text, ['abstractNote']);
    setQueryIn(newQueryIn);

    let newQueryOut = { ...queryOut };
    newQueryOut = getFilterOr(newQueryOut, text, ['abstractNote']);
    setQueryOut(newQueryOut);
  };

  return (
    <Container>
      {isSeaching && <SearchBox isSeaching={isSeaching} onChange={onSearchText} setIsSearching={setIsSearching} />}
      <CustomHeader
        title="Điều hành văn bản"
        rightHeader={
          <RightHeader
            children={
              <Icon
                name="search"
                type="FontAwesome"
                onPress={() => setIsSearching(true)}
                style={{ color: '#fff', marginHorizontal: 10 }}
              />
            }
          />
        }
      />
      <Tabs
        page={Number(tab)}
        onChangeTab={(e) => {
          setTab(e.i);
        }}
        onScroll={(e) => {
          setTab(e.i);
        }}>
        <Tab
          heading={
            <TabHeading>
              <Text>Văn bản đến</Text>
            </TabHeading>
          }>
          <Container>
            <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>
              <Button
                style={{
                  borderRadius: 18,
                  backgroundColor: handleSaveIn === 1 ? 'rgba(46, 149, 46, 1)' : '#fff',
                  height: 35,
                  marginRight: 10,
                }}
                onPress={() => {
                  setHandleSaveIn(1);
                }}>
                <Text
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    textAlign: 'center',
                    fontSize: 10,
                    color: handleSaveIn === 1 ? '#fff' : '#000',
                    fontWeight: '600',
                  }}>
                  Chưa xử lý
                </Text>
              </Button>
              <Button
                style={{
                  borderRadius: 18,
                  backgroundColor: handleSaveIn === 2 ? 'rgba(46, 149, 46, 1)' : '#fff',
                  height: 35,
                  marginRight: 10,
                }}
                onPress={() => {
                  setHandleSaveIn(2);
                }}>
                <Text
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    textAlign: 'center',
                    fontSize: 10,
                    color: handleSaveIn === 2 ? '#fff' : '#000',
                    fontWeight: '600',
                  }}>
                  Đã xử lý
                </Text>
              </Button>
              <Button
                style={{
                  borderRadius: 18,
                  backgroundColor: handleSaveIn === 3 ? 'rgba(46, 149, 46, 1)' : '#fff',
                  height: 35,
                  marginRight: 10,
                }}
                onPress={() => {
                  setHandleSaveIn(3);
                }}>
                <Text
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    textAlign: 'center',
                    fontSize: 10,
                    color: handleSaveIn === 3 ? '#fff' : '#000',
                    fontWeight: '600',
                  }}>
                  Đã hoàn thành
                </Text>
              </Button>
            </View>
            <ListPage
              query={queryIn}
              reload={reload}
              api={API_INCOMMING_DOC_PROCESS}
              customData={customData}
              itemComponent={({ item }) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigate('DetailText', {
                        item,
                        type: 1,
                        handleSave: handleSaveIn,
                        signingStatus: item.signingStatus,
                      })
                    }>
                    <Card style={{ borderRadius: 10 }}>
                      <CardItem style={{ borderRadius: 10 }}>
                        <Body>
                          <View style={styles.view}>
                            <View style={{ flex: 0.3, alignItems: 'center', paddingRight: 20 }}>
                              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}>
                                {moment(item.updatedAt).format('HH:mm')}
                              </Text>
                              <Text style={{ fontSize: 14 }}>{item.createdAt}</Text>
                            </View>
                            <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
                              <Text
                                style={
                                  item.watched && item.watched.includes(_id)
                                    ? { fontSize: 16, color: 'green' }
                                    : { fontSize: 16, fontWeight: 'bold', color: 'green' }
                                }>
                                {item.abstractNote}
                              </Text>
                              <Text>
                                <Text note style={{ fontSize: 14 }}>
                                  Số văn bản:{' '}
                                </Text>
                                <Text numberOfLines={1} style={{ fontSize: 14 }}>
                                  {item.toBook}
                                </Text>
                              </Text>
                              <Text>
                                <Text note style={{ fontSize: 14 }}>
                                  Đơn vị gửi:{' '}
                                </Text>
                                <Text numberOfLines={1} style={{ fontSize: 14 }}>
                                  {item.senderUnit}
                                </Text>
                              </Text>
                              <Text>
                                <Text note style={{ fontSize: 14 }}>
                                  Ngày VB:{' '}
                                </Text>
                                <Text numberOfLines={1} style={{ fontSize: 14, color: '#75a3cc' }}>
                                  {item.createdAt}
                                </Text>
                              </Text>
                              <Text>
                                <Text note style={{ fontSize: 14 }}>
                                  Hạn xử lý:{' '}
                                </Text>
                                <Text numberOfLines={1} style={{ fontSize: 14, color: '#75a3cc' }}>
                                  {item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : ''}
                                </Text>
                              </Text>
                              <Text note style={{ fontSize: 14 }}>
                                Đính kèm:{' '}
                              </Text>
                              {item.files &&
                                item.files.map((i) => {
                                  return <Text style={{ fontSize: 14, color: '#75a3cc' }}>{i.name}</Text>;
                                })}
                            </View>
                          </View>
                        </Body>
                      </CardItem>
                    </Card>
                  </TouchableWithoutFeedback>
                );
              }}
            />
          </Container>
        </Tab>
        <Tab
          heading={
            <TabHeading>
              <Text>Văn bản đi</Text>
            </TabHeading>
          }>
          <Container>
            <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>
              <Button
                style={{
                  borderRadius: 18,
                  backgroundColor: handleSaveOut === 1 ? 'rgba(46, 149, 46, 1)' : '#fff',
                  height: 35,
                  marginRight: 10,
                }}
                onPress={() => {
                  setHandleSaveOut(1);
                }}>
                <Text
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    textAlign: 'center',
                    fontSize: 10,
                    color: handleSaveOut === 1 ? '#fff' : '#000',
                    fontWeight: '600',
                  }}>
                  Chờ xử lý
                </Text>
              </Button>
              <Button
                style={{
                  borderRadius: 18,
                  backgroundColor: handleSaveOut === 2 ? 'rgba(46, 149, 46, 1)' : '#fff',
                  height: 35,
                  marginRight: 10,
                }}
                onPress={() => {
                  setHandleSaveOut(2);
                }}>
                <Text
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    textAlign: 'center',
                    fontSize: 10,
                    color: handleSaveOut === 2 ? '#fff' : '#000',
                    fontWeight: '600',
                  }}>
                  Đã xử lý
                </Text>
              </Button>
              <Button
                style={{
                  borderRadius: 18,
                  backgroundColor: handleSaveOut === 3 ? 'rgba(46, 149, 46, 1)' : '#fff',
                  height: 35,
                  marginRight: 10,
                }}
                onPress={() => {
                  setHandleSaveOut(3);
                }}>
                <Text
                  style={{
                    paddingLeft: 20,
                    paddingRight: 20,
                    textAlign: 'center',
                    fontSize: 10,
                    color: handleSaveOut === 3 ? '#fff' : '#000',
                    fontWeight: '600',
                  }}>
                  Đã ban hành
                </Text>
              </Button>
            </View>
            <ListPage
              query={queryOut}
              reload={reload}
              api={handleSaveOut && handleSaveOut === 1 ? API_OUTGOING_DOC_PROCESS : API_OUTGOING_DOCUMENT}
              customData={customData}
              itemComponent={({ item }) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigate('DetailText', {
                        item,
                        type: 2,
                        handleSave: handleSaveOut,
                        signingStatus: item.signingStatus,
                      })
                    }>
                    <Card style={{ borderRadius: 10 }}>
                      <CardItem style={{ borderRadius: 10 }}>
                        <Body>
                          <View style={styles.view}>
                            <View style={{ flex: 0.3, alignItems: 'center', paddingRight: 20 }}>
                              <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}>
                                {moment(item.updatedAt).format('HH:mm')}
                              </Text>
                              <Text style={{ fontSize: 14 }}>{item.createdAt}</Text>
                            </View>
                            <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
                              <Text
                                style={
                                  item.watched && item.watched.includes(_id)
                                    ? { fontSize: 16, color: 'green' }
                                    : { fontSize: 16, fontWeight: 'bold', color: 'green' }
                                }>
                                {item.abstractNote}
                              </Text>
                              <Text>
                                <Text note style={{ fontSize: 14 }}>
                                  Đơn vị soạn:{' '}
                                </Text>
                                <Text numberOfLines={1} style={{ fontSize: 14 }}>
                                  {item.senderUnit}
                                </Text>
                              </Text>
                              <Text>
                                <Text note style={{ fontSize: 14 }}>
                                  Người soạn:{' '}
                                </Text>
                                <Text numberOfLines={1} style={{ fontSize: 14, color: '#75a3cc' }}>
                                  {item['drafter.name']}
                                </Text>
                              </Text>
                              <Text>
                                <Text note style={{ fontSize: 14 }}>
                                  Ngày soạn:{' '}
                                </Text>
                                <Text numberOfLines={1} style={{ fontSize: 14 }}>
                                  {item.createdAt}
                                </Text>
                              </Text>
                              <Text note style={{ fontSize: 14 }}>
                                Văn bản dự thảo:{' '}
                              </Text>
                              {/* {item.files && item.files.map(i => { return <Text style={{ fontSize: 14, color: '#75a3cc' }}>{i.name}</Text> })} */}
                            </View>
                          </View>
                        </Body>
                      </CardItem>
                    </Card>
                  </TouchableWithoutFeedback>
                );
              }}
            />
            <Tabs
              page={Number(tab)}
              onChangeTab={(e) => {
                setTab(e.i);
              }}
              onScroll={(e) => {
                setTab(e.i);
              }}>
              <Tab
                heading={
                  <TabHeading>
                    <Text>Văn bản đến</Text>
                  </TabHeading>
                }>
                <Container>
                  <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>
                    <Button
                      style={{
                        borderRadius: 18,
                        backgroundColor: handleSaveIn === 1 ? 'rgba(46, 149, 46, 1)' : '#fff',
                        height: 35,
                        marginRight: 10,
                      }}
                      onPress={() => {
                        setHandleSaveIn(1);
                      }}>
                      <Text
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          textAlign: 'center',
                          fontSize: 10,
                          color: handleSaveIn === 1 ? '#fff' : '#000',
                          fontWeight: '600',
                        }}>
                        Chưa xử lý
                      </Text>
                    </Button>
                    <Button
                      style={{
                        borderRadius: 18,
                        backgroundColor: handleSaveIn === 2 ? 'rgba(46, 149, 46, 1)' : '#fff',
                        height: 35,
                        marginRight: 10,
                      }}
                      onPress={() => {
                        setHandleSaveIn(2);
                      }}>
                      <Text
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          textAlign: 'center',
                          fontSize: 10,
                          color: handleSaveIn === 2 ? '#fff' : '#000',
                          fontWeight: '600',
                        }}>
                        Đã xử lý
                      </Text>
                    </Button>
                    <Button
                      style={{
                        borderRadius: 18,
                        backgroundColor: handleSaveIn === 3 ? 'rgba(46, 149, 46, 1)' : '#fff',
                        height: 35,
                        marginRight: 10,
                      }}
                      onPress={() => {
                        setHandleSaveIn(3);
                      }}>
                      <Text
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          textAlign: 'center',
                          fontSize: 10,
                          color: handleSaveIn === 3 ? '#fff' : '#000',
                          fontWeight: '600',
                        }}>
                        Đã hoàn thành
                      </Text>
                    </Button>
                  </View>
                  <ListPage
                    query={queryIn}
                    reload={reload}
                    api={API_INCOMMING_DOC_PROCESS}
                    customData={customData}
                    itemComponent={({ item }) => {
                      return (
                        <TouchableWithoutFeedback
                          onPress={() =>
                            navigate('TextDetail', {
                              item,
                              type: 1,
                              handleSave: handleSaveIn,
                              signingStatus: item.signingStatus,
                            })
                          }>
                          <Card style={{ borderRadius: 10 }}>
                            <CardItem style={{ borderRadius: 10 }}>
                              <Body>
                                <View style={styles.view}>
                                  <View style={{ flex: 0.3, alignItems: 'center', paddingRight: 20 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}>
                                      {moment(item.updatedAt).format('HH:mm')}
                                    </Text>
                                    <Text style={{ fontSize: 14 }}>{item.createdAt}</Text>
                                  </View>
                                  <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
                                    <Text
                                      style={
                                        item.watched && item.watched.includes(_id)
                                          ? { fontSize: 16, color: 'green' }
                                          : { fontSize: 16, fontWeight: 'bold', color: 'green' }
                                      }>
                                      {item.abstractNote}
                                    </Text>
                                    <Text>
                                      <Text note style={{ fontSize: 14 }}>
                                        Số văn bản:{' '}
                                      </Text>
                                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                                        {item.toBook}
                                      </Text>
                                    </Text>
                                    <Text>
                                      <Text note style={{ fontSize: 14 }}>
                                        Đơn vị gửi:{' '}
                                      </Text>
                                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                                        {item.senderUnit}
                                      </Text>
                                    </Text>
                                    <Text>
                                      <Text note style={{ fontSize: 14 }}>
                                        Ngày VB:{' '}
                                      </Text>
                                      <Text numberOfLines={1} style={{ fontSize: 14, color: '#75a3cc' }}>
                                        {item.createdAt}
                                      </Text>
                                    </Text>
                                    <Text>
                                      <Text note style={{ fontSize: 14 }}>
                                        Hạn xử lý:{' '}
                                      </Text>
                                      <Text numberOfLines={1} style={{ fontSize: 14, color: '#75a3cc' }}>
                                        {item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : ''}
                                      </Text>
                                    </Text>
                                    <Text note style={{ fontSize: 14 }}>
                                      Đính kèm:{' '}
                                    </Text>
                                    {item.files &&
                                      item.files.map((i) => {
                                        return <Text style={{ fontSize: 14, color: '#75a3cc' }}>{i.name}</Text>;
                                      })}
                                  </View>
                                </View>
                              </Body>
                            </CardItem>
                          </Card>
                        </TouchableWithoutFeedback>
                      );
                    }}
                  />
                </Container>
              </Tab>
              <Tab
                heading={
                  <TabHeading>
                    <Text>Văn bản đi</Text>
                  </TabHeading>
                }>
                <Container>
                  <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>
                    <Button
                      style={{
                        borderRadius: 18,
                        backgroundColor: handleSaveOut === 1 ? 'rgba(46, 149, 46, 1)' : '#fff',
                        height: 35,
                        marginRight: 10,
                      }}
                      onPress={() => {
                        setHandleSaveOut(1);
                      }}>
                      <Text
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          textAlign: 'center',
                          fontSize: 10,
                          color: handleSaveOut === 1 ? '#fff' : '#000',
                          fontWeight: '600',
                        }}>
                        Chờ xử lý
                      </Text>
                    </Button>
                    <Button
                      style={{
                        borderRadius: 18,
                        backgroundColor: handleSaveOut === 2 ? 'rgba(46, 149, 46, 1)' : '#fff',
                        height: 35,
                        marginRight: 10,
                      }}
                      onPress={() => {
                        setHandleSaveOut(2);
                      }}>
                      <Text
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          textAlign: 'center',
                          fontSize: 10,
                          color: handleSaveOut === 2 ? '#fff' : '#000',
                          fontWeight: '600',
                        }}>
                        Đã xử lý
                      </Text>
                    </Button>
                    <Button
                      style={{
                        borderRadius: 18,
                        backgroundColor: handleSaveOut === 3 ? 'rgba(46, 149, 46, 1)' : '#fff',
                        height: 35,
                        marginRight: 10,
                      }}
                      onPress={() => {
                        setHandleSaveOut(3);
                      }}>
                      <Text
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          textAlign: 'center',
                          fontSize: 10,
                          color: handleSaveOut === 3 ? '#fff' : '#000',
                          fontWeight: '600',
                        }}>
                        Đã ban hành
                      </Text>
                    </Button>
                  </View>
                  <ListPage
                    query={queryOut}
                    reload={reload}
                    api={handleSaveOut && handleSaveOut === 1 ? API_OUTGOING_DOC_PROCESS : API_OUTGOING_DOCUMENT}
                    customData={customData}
                    itemComponent={({ item }) => {
                      return (
                        <TouchableWithoutFeedback
                          onPress={() =>
                            navigate('TextDetail', {
                              item,
                              type: 2,
                              handleSave: handleSaveOut,
                              signingStatus: item.signingStatus,
                            })
                          }>
                          <Card style={{ borderRadius: 10 }}>
                            <CardItem style={{ borderRadius: 10 }}>
                              <Body>
                                <View style={styles.view}>
                                  <View style={{ flex: 0.3, alignItems: 'center', paddingRight: 20 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'green' }}>
                                      {moment(item.updatedAt).format('HH:mm')}
                                    </Text>
                                    <Text style={{ fontSize: 14 }}>{item.createdAt}</Text>
                                  </View>
                                  <View style={{ flex: 0.7, alignItems: 'flex-start' }}>
                                    <Text
                                      style={
                                        item.watched && item.watched.includes(_id)
                                          ? { fontSize: 16, color: 'green' }
                                          : { fontSize: 16, fontWeight: 'bold', color: 'green' }
                                      }>
                                      {item.abstractNote}
                                    </Text>
                                    <Text>
                                      <Text note style={{ fontSize: 14 }}>
                                        Đơn vị soạn:{' '}
                                      </Text>
                                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                                        {item.senderUnit}
                                      </Text>
                                    </Text>
                                    <Text>
                                      <Text note style={{ fontSize: 14 }}>
                                        Người soạn:{' '}
                                      </Text>
                                      <Text numberOfLines={1} style={{ fontSize: 14, color: '#75a3cc' }}>
                                        {item['drafter.name']}
                                      </Text>
                                    </Text>
                                    <Text>
                                      <Text note style={{ fontSize: 14 }}>
                                        Ngày soạn:{' '}
                                      </Text>
                                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                                        {item.createdAt}
                                      </Text>
                                    </Text>
                                    <Text note style={{ fontSize: 14 }}>
                                      Văn bản dự thảo:{' '}
                                    </Text>
                                    {/* {item.files && item.files.map(i => { return <Text style={{ fontSize: 14, color: '#75a3cc' }}>{i.name}</Text> })} */}
                                  </View>
                                </View>
                              </Body>
                            </CardItem>
                          </Card>
                        </TouchableWithoutFeedback>
                      );
                    }}
                  />
                </Container>
              </Tab>
            </Tabs>
          </Container>
        </Tab>
      </Tabs>
    </Container>
  );
}


const mapStateToProps = createStructuredSelector({
  textManagement: makeSelectTextManagement(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetDocument: (data) => dispatch(getDocument(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const styles = {
  view: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 2,
  },
  icon: {
    fontSize: 18,
    opacity: 0.4,
    marginTop: 0,
  },
};

export default compose(withConnect)(TextManagement);
