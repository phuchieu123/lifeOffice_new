import React, { Fragment, useState, useEffect, memo, useRef } from 'react';
import { Content, Icon, Card, CardItem, Form, Item, Input, Label, Toast, Button, Text, View, Container } from 'native-base';
import { Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import BackHeader from '../../components/Header/BackHeader';
import { API_TASK_INVITE, API_TASK_TASKS } from '../../configs/Paths';
import { handleSearch, serialize } from '../../utils/common';
import ToastCustom from '../../components/ToastCustom';
import request from '../../utils/request';
import LoadingLayout from '../../components/LoadingLayout';
import ItemCard from './ItemCard';
import DenyModal from './DenyModal';

export function TaskInvite(props) {
  const { navigation } = props;

  const [data, setData] = useState([])
  const [loading, setLoading] = useState()
  const [dialog, setDialog] = useState()
  const selectedItem = useRef()

  useEffect(() => {
    getData();
  }, []);

  async function postData({ id, isAccept, reason = '' }) {
    const url = await API_TASK_TASKS()
    const body = {
      method: 'POST',
      body: JSON.stringify({
        id,
        isAccept,
        reason,
      })
    };
    try {
      const respon = await request(`${url}`, body);
      return { success: true, text: 'Cập nhật thành công', type: 'success' }
    } catch (err) {
      return { text: 'Có lỗi xảy ra', type: 'warning' }
    }
  }

  async function getData() {
    setLoading(true)
    const url = await API_TASK_TASKS()
    const query = serialize({ filterUser: true });
    const body = {
      method: 'GET',
    };
    try {
      const respon = await request(`${url}?${query}`, body);
      setData(respon.data);
    } catch (err) {
      setData([]);
      ToastCustom({ text: 'Lấy dữ liệu thất bại', type: 'warning' })
    }
    setLoading(false)
  }

  const onAccept = async (item) => {
    const res = await postData({ id: item._id, isAccept: true })
    if (res.success) getData()
    
  }


  const onDeny = async (item) => {
    selectedItem.current = item
    setDialog(true)
  }

  const onDenyConfirm = async (text) => {
    const res = await postData({ id: selectedItem.current._id, isAccept: false, reason: text })
    if (res.success) {
      setDialog(false)
      getData()
    }
    return res
  }

  return (
    <Container>
      <BackHeader navigation={navigation} title={'Lời mời công việc'} onGoBack={() => navigation.goBack()} />
        <LoadingLayout isLoading={loading}>
          <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              return <ItemCard
                item={item}
                onAccept={onAccept}
                onDeny={onDeny}
              />
            }}
          />
        </LoadingLayout>

      <DenyModal
        visible={dialog}
        onAccept={onDenyConfirm}
        onClose={() => setDialog(false)}
      />
    </Container>
  );
}

export default TaskInvite
