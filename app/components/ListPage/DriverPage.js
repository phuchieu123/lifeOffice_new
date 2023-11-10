import React, { useEffect, useState, useCallback } from 'react';
import { Text, Spinner } from 'native-base';
import { FlatList } from 'react-native';
import LoadingLayout from '../LoadingLayout';
import { handleSearch, serialize } from '../../utils/common';
import request from '../../utils/request';
import _ from 'lodash';
import { getData as getLocalStorage } from '../../utils/storage';

const DriverPage = (props) => {
  const { api, body, itemComponent, customData } = props;

  const [query, setQuery] = useState();
  const [localData, setLocalData] = useState([]);

  const [reload, setReload] = useState(false);
  const [reloading, setReloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    props.reload && setReload(true);
  }, [props.reload]);

  useEffect(() => {
    if (props.query) {
      setQuery({ ...props.query });
      setReload(true);
    }
  }, [props.query]);

  useEffect(() => {
    setReload(true);
  }, [body]);

  useEffect(() => {
    if (reload && query) {
      handleReload();
      setReload(false);
    }
  }, [reload, query, localData, body]);

  const handleReload = () => {
    setReloading(true);
    let newQuery = {
      ...query,
    };

    setQuery(newQuery);
    getData(newQuery);
  };

  const getData = async (newQuery) => {
    let newData = []
    try {
      const url = `${await api()}?${serialize(newQuery)}`;
 
      const token = await getLocalStorage('token_03')

      const newBody = {
        ...body,
        body: JSON.stringify(body.body),
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      const respon = await request(url, newBody)
      if (Array.isArray(respon.files)) newData = _.orderBy(_.orderBy(respon.files.map(e => ({ ...e, nameL: (e.name || '').toLowerCase() })), 'nameL', 'asc'), 'isFile', 'asc')
    } catch (err) { }

    setLocalData(newData);
    setReloading(false);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setReload(true);
  };

  return (
    <LoadingLayout isLoading={reloading}>
      {localData && !localData.length && (
        <Text style={{ alignSelf: 'center', flex: 1, textAlignVertical: 'center', position: 'absolute', top: 40 }}>Không có dữ liệu</Text>
      )}
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={localData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => itemComponent({ item })}
      />
    </LoadingLayout>
  );
};

export default DriverPage;
