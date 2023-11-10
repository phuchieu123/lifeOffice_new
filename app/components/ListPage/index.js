import React, { useEffect, useState, useCallback } from 'react';
import { Text, Spinner } from 'native-base';
import { FlatList } from 'react-native';
import LoadingLayout from '../../components/LoadingLayout';
import { handleSearch, serialize } from '../../utils/common';
import _ from 'lodash';

const RenderFooter = ({ isLoadingMore }) => {
  if (isLoadingMore) {
    return <Spinner />;
  }
  return null;
};

const ListPage = (props) => {
  const { key = '_id', params = '', api, itemComponent, customData, limit = 10 } = props;

  const [query, setQuery] = useState();
  const [localData, setLocalData] = useState([]);

  const [reload, setReload] = useState(false);
  const [reloading, setReloading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => { props.reload && setReload(true); }, [props.reload]);

  useEffect(() => {
    if (props.query) {
      setQuery({ ...props.query });
      setReload(true);
    }
  }, [props.query]);

  useEffect(() => {
    if (reload && query) {
      handleReload();
      setReload(false);
    }
  }, [reload, query, localData]);

  useEffect(() => {
    const { forceList } = props
    forceList && !_.isEqual(forceList, localData) && setLocalData(forceList)
  }, [props.forceList, localData]);

  const handleReload = () => {
    setReloading(true);
    let newQuery = {
      ...query,
      skip: 0,
      limit,
    };

    getData(newQuery);
  };

  const handleLoadMore = () => {
    if (query) {
      const newQuery = {
        ...query,
        skip: query.skip + limit,
        limit,
      };
      getData(newQuery, true);
    } else {
      setIsLoadingMore(false)
    }
  };

  const getData = async (newQuery) => {
    let url
    if (typeof api === 'string') url = `${api}${params}?${serialize(newQuery)}`;
    else url = `${await api()}${params}?${serialize(newQuery)}`;

    let func = props.func || handleSearch
    func(url, async (res) => {
      try {
        let newData
        const loadMore = newQuery.skip > 0;

        if (props.formatResponse) newData = props.formatResponse({ data: res })
        else if (Array.isArray(res)) newData = [...res]

        if (Array.isArray(newData)) {
          if (props.customData) newData = await customData({ data: newData, loadMore })

          if (loadMore) {
            const keyList = localData.map(e => e[key])
            newData = newData.filter(e => !keyList.includes(e[key]))
            newData = [...localData, ...newData]
          }

          if (!loadMore || newData.length) {
            console.log(url, 'url');
            setLocalData(newData);
            props.getList && props.getList(newData)
            setQuery(newQuery);
          }
        }
      }
      catch (err) { }

      setReloading(false);
      setRefreshing(false);
      setIsLoadingMore(false);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setReload(true);
  };

  const IsCloseToBottom = useCallback(({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  }, []);

  const onMomentumScrollEnd = ({ nativeEvent }) => {
    if (!refreshing && !reloading && !isLoadingMore && IsCloseToBottom(nativeEvent)) {
      setIsLoadingMore(true);
      handleLoadMore();
    }
  };

  return (
    <LoadingLayout isLoading={reloading}>
      {localData && !localData.length && (
        <Text style={{ alignSelf: 'center', flex: 1, textAlignVertical: 'center', position: 'absolute', top: 40 }}>{props.noDataText || 'Không có dữ liệu'}</Text>
      )}
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        inverted={props.inverted}
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={localData}
        keyExtractor={(item) => item[key]}
        ListFooterComponent={<RenderFooter isLoadingMore={isLoadingMore} />}
        scrollEventThrottle={16}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => itemComponent({ item })}
      />
      {props.footerComponent}
    </LoadingLayout>
  );
};

export default ListPage;
