/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * NotificationPage
 *
 */

import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import Modal from 'react-native-modal';
import makeSelectNotificationPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Spinner, Left, ListItem, Body, Thumbnail, Text, View, Icon, Button, Right } from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
import LoadingLayout from '../../components/LoadingLayout';
import * as actions from './actions';
import moment from 'moment';
import images from '../../images';
import { makeSelectProfile, makeSelectSocket, makeSelectSocketError } from '../App/selectors';
import { getProfile } from '../../utils/authen';
import { getAvatar } from '../../utils/common';
import _ from 'lodash';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import { DATE_FORMAT, NOTIFICATION_STATUS } from '../../utils/constants';
import Search from '../../components/CustomMultiSelect/Search';
import { getNotifications, updateNotifications } from '../../api/notifications';
import { onSocketEvent } from '../../utils/deviceEventEmitter';
import ListPage from '../../components/ListPage';
import { API_NOTIFICATION, API_PROFILE } from '../../configs/Paths';
import { navigate } from '../../RootNavigation';
import request from '../../utils/request';
import { autoLogout } from '../../utils/autoLogout';

export function NotificationPage(props) {
  useInjectReducer({ key: 'notificationPage', reducer });
  useInjectSaga({ key: 'notificationPage', saga });
  const { navigation, notificationPage, onGetNotifications, onUpdateNotifcation, onPostReadAll, onCleanup, updateNotificationSuccess, socket, socketError, profile } = props;
  const { isLoading, notifications, isLoadingMore } = notificationPage;

  const [query, setQuery] = useState();
  const [isBusy, setIsBusy] = useState(false);
  const [isRead, setIsRead] = useState(0);
  const [openFilterModal, setOpenFilterModal] = useState();
  const [reload, setReload] = useState(0);

  useEffect(() => {
    navigation.addListener(
      'focus', () => {
        setReload((e) => e + 1);
      }
    );
    setQuery({
      filter: {
        to: profile._id
      }
    })
    return () => {
      onCleanup();
    };
  }, []);

  useEffect(() => {
    if (updateNotificationSuccess) {
      reloadCount()
      setIsBusy(false);
      setReload(e => e + 1)
    };
  }, [socketError, updateNotificationSuccess]);

  useEffect(() => {
    if ((notificationPage && notificationPage.loading) === false) {
      setReload(e => e + 1)
    }
  }, [notificationPage.loading])


  const reloadCount = () => {
    if (socketError) {
      getNotifications({ filter: { isRead: false }, limit: 1, skip: 0 }).then(e => e && onSocketEvent('notification', { isNotRead: e.count }))
    } else {
      socket.emit('notification', {
        command: 1001,
        data: {
          skip: 0,
          limit: 10,
        },
      });
    }
  }

  const handleReadAll = async () => {
    onPostReadAll();
    setIsBusy(true);
  };

  const handleOpenFilterModal = () => {
    setIsRead(_.has(query, 'filter.isRead') ? _.get(query, 'filter.isRead') ? 2 : 1 : null)
    setOpenFilterModal(true)
  }

  const handleSaveFilter = () => {
    const newQuery = { ...query }
    delete newQuery.filter.isRead
    if (isRead) newQuery.filter.isRead = isRead === 2 ? true : false
    setQuery(newQuery)
    setOpenFilterModal(false)
  }

  useEffect(() => {
    navigation.addListener(
      'focus', () => {
        autoLogout()
      }
    );

  }, []);

  return (
    <>
      <BackHeader
        // navigation={navigation}
        title="Thông báo"
        rightHeader={
          <Icon
            name="filter"
            type="FontAwesome"
            style={{ color: '#fff', marginHorizontal: 10 }}
            onPress={handleOpenFilterModal}
          />
        }
      />
      <ListPage
        reload={reload}
        query={query}
        api={API_NOTIFICATION}
        itemComponent={({ item }) => !notificationPage.loading && <RenderItem item={item} profile={profile} reloadCount={reloadCount} />}
        footerComponent={
          <Button bordered block iconLeft onPress={handleReadAll} isLoading={isLoading}>
            {notificationPage.loading && <Spinner color="gray" />}
            {!notificationPage.loading && <Icon type="AntDesign" name="eye" />}
            {!notificationPage.loading && <Text>Đánh dấu đã đọc</Text>}
          </Button>
        }
      />

      <Modal isVisible={openFilterModal} style={{ height: 'auto' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
          <View>
            <ListItem itemHeader itemDivider style={{ borderRadius: 10 }}>
              <Text>Trạng thái </Text>
            </ListItem>
            <ListItem>
              <Search
                single
                items={NOTIFICATION_STATUS}
                handleSelectItems={val => setIsRead(val[0])}
                selectedItems={isRead ? [isRead] : []}
                emptyText='Tất cả'
              />
            </ListItem>
          </View>
          <View padder style={{ flexDirection: 'row', marginTop: 40 }}>
            <Button block onPress={handleSaveFilter} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
              <Icon name="check" type="Feather" />
            </Button>
            <Button block onPress={() => setOpenFilterModal(false)} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
              <Icon name="close" type="AntDesign" />
            </Button>
          </View>
        </View>
      </Modal >

    </>
  );
}


const mapStateToProps = createStructuredSelector({
  notificationPage: makeSelectNotificationPage(),
  socket: makeSelectSocket(),
  socketError: makeSelectSocketError(),
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetNotifications: (query, isLoadMore) => dispatch(actions.getNotifications(query, isLoadMore)),
    onGetNotification: () => dispatch(actions.getNotification()),
    onUpdateNotifcation: (item) => dispatch(actions.updateNotification(item)),
    onCleanup: () => dispatch(actions.cleanup()),
    onPostReadAll: () => dispatch(actions.postReadAll()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(NotificationPage);

const RenderItem = (props) => {
  const { item, profile, reloadCount } = props

  const [isRead, setIsRead] = useState()
  const [avatarProfile, setAvatarProfile] = useState({})

  useEffect(async () => {
    getProfile();
  }, [])

  const getProfile = async () => {
    try {
      let url = `${await API_PROFILE()}`;
      const body = { method: 'GET' };
      const response = await request(url, body);

      if (response._id) {
        setAvatarProfile(response);
      }
    } catch (err) { }
  }

  useEffect(() => {
    setIsRead(item.isRead)
  }, [item.isRead])

  const onClick = async () => {
    handleGotoPage(item)
    if (!item.isRead) {
      updateNotifications(item._id, {
        ...item,
        isRead: true
      }).then(res => {
        setIsRead(true)
        reloadCount && reloadCount()
      })
    }
  }

  const handleGotoPage = (params) => {
    const { link, title } = params;
    let id = link.split('/');
    id = id[id.length - 1];

    if (link.includes('/Task/')) {
      if (id.length === 24) {
        const deny = title.toLowerCase().includes('từ chối');
        if (deny) {
        } else {
          navigate('ProjectDetail', { project: { _id: id } });
        }
      } else if (id === 'invite') {
        navigate('TaskInvite');
      }
    }
    else if (link.includes('/BusinessOpportunities/') && id.length === 24) {
      navigate('BusinessOpDetail', { businessOp: { _id: id } });
    }
    else if (title.includes('Yêu cầu cập nhật tiến độ công việc')) {
      navigate('Project');
    }
    else if (link.includes('/Calendar/') && id.length === 24) {
      navigate('MeetingScheduleDatailPage', {
        "item._id": id,
      });
    }
    else if (link.includes('/approve/')) {
      navigate('ApproveDetail', {
        "approveId": id,
      });
    }
  };

  return <ListItem
    noIndent={item.isRead}
    avatar
    style={{ marginLeft: 0, paddingLeft: 15, backgroundColor: isRead ? '#fff' : '#ccc' }}
    onPress={onClick}>
    <Left>
      <Thumbnail source={getAvatar(avatarProfile.avatar, profile.gender)} />
    </Left>
    <Body>
      <Text numberOfLines={1}>{item.title}</Text>
      <Text numberOfLines={2} note>
        {item.content}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
        <Icon name="clockcircleo" type="AntDesign" style={{ fontSize: 12, marginRight: 3 }} />
        <Text note>{moment(item.date).format(DATE_FORMAT.DATE_TIME)}</Text>
      </View>
    </Body>
  </ListItem>
}