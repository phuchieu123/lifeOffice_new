import React, { useState, useRef, useEffect, Fragment } from 'react';
import { View } from 'react-native';
import { Text } from 'native-base';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { handleSearch, serialize, mergeArray, formatDisplayKey } from 'utils/common';
import SearchHeader from './components/SearchHeader';
import ToggleIcon from './components/ToggleIcon';
import { icons } from './components/common';
import { getFilterOr } from '../../utils/common';
import _ from 'lodash';
import NoItem from './components/NoItem';

const MultiAPISearch = (props) => {
  const {
    API,
    selectedItems,
    selectedDatas,
    onRemove,
    customData,
    query = {},
    filterOr = ['name'],
    customDislayKey,
    uniqueKey = '_id',
    limit = 20,
  } = props;

  const displayKey = customDislayKey && customDislayKey.join() || props.displayKey || 'name';

  const [items, setItems] = useState([]);

  const [localSelect, setLocalSelect] = useState([]);
  const [localSelectData, setLocalSelectData] = useState([]);
  const [loading, setLoading] = useState();
  const [selectText, setSelectText] = useState('');
  const [backgroundData, setBackgroundData] = useState([]);

  const localItems = useRef([]);
  const data = useRef([]);
  const open = useRef();
  const multi = useRef()
  const lastQuery = useRef()
  const component = useRef(true);
  const lastSelectedDatas = useRef()

  useEffect(() => {
    return () => {
      component.current = false;
    };
  }, []);

  useEffect(() => {
    if (!_.isEqual(lastQuery.current, query)) {
      lastQuery.current = { ...query }
      onSearch();
    }
  }, [query]);

  useEffect(() => {
    setLocalSelect(selectedItems || [])
  }, [selectedItems]);

  useEffect(() => {
    if (Array.isArray(selectedDatas) && selectedDatas.length && !_.isEqual(selectedDatas, lastSelectedDatas.current)) {
      lastSelectedDatas.current = [...selectedDatas]
      let tmp = [...selectedDatas];
      if (customDislayKey) tmp = formatDisplayKey(tmp, customDislayKey);
      tmp = mergeArray(backgroundData, tmp, uniqueKey);
      setBackgroundData(tmp)
      if (!open.current) setItems(tmp);
    }
  }, [selectedDatas, backgroundData]);

  useEffect(() => {
    const newData = items.filter((item) => localSelect.includes(item[uniqueKey]));
    const newBackgroundData = mergeArray(newData, backgroundData, uniqueKey);
    const newSelectedData = newBackgroundData.filter((item) => localSelect.includes(item[uniqueKey]))
    newSelectedData.length = localSelect.length

    setLocalSelectData(newSelectedData);
    setSelectText(newSelectedData.map(item => item[displayKey]).join(', '))
    if (!_.isEqual(backgroundData, newBackgroundData)) {
      setBackgroundData(newBackgroundData)
      if (!open.current) setItems(newBackgroundData);
    }
  }, [localSelect, backgroundData]);

  const getItems = async (newQuery = {}) => {
    setLoading(true);
    const url = `${await API()}?${serialize({ ...newQuery, limit, skip: 0 })}`;
    await handleSearch(url, (e) => {
      if (!component.current) return;
      if (Array.isArray(e)) {
        let res = [...e];
        if (customData) res = customData(res)
        if (customDislayKey) res = formatDisplayKey(res, customDislayKey);
        localItems.current = res;
        if (open.current) setItems(res);
      }
      setLoading(false);
    });
  };

  const onSearch = (value = '') => {
    const newQuery = getFilterOr(query, value, filterOr)
    getItems(newQuery);
  };

  const onSelectedItemsChange = (e) => {
    setLocalSelect(e);
  };

  const onConfirm = () => {
    props.onSelectedItemsChange && props.onSelectedItemsChange(localSelect);
    props.onSelectedItemObjectsChange && props.onSelectedItemObjectsChange(localSelectData);
    multi.current._closeSelector()
  };

  const onCancel = () => {
    multi.current._closeSelector()
    setLocalSelect(selectedItems || []);
  };

  const onToggleSelector = (e) => {
    open.current = e;
    setItems(e ? localItems.current : backgroundData);
  };

  return (
    <View style={styles.view}>
      <SectionedMultiSelect
        ref={multi}
        hideConfirm
        IconRenderer={icons}
        loading={loading}
        onToggleSelector={onToggleSelector}
        items={items}
        selectedItems={localSelect}
        onSelectedItemsChange={onSelectedItemsChange}
        onConfirm={onConfirm}
        onCancel={onCancel}
        hideSearch
        showRemoveAll
        renderSelectText={() => <Text style={{ flex: 1, textAlign: 'right', minHeight: 45, textAlignVertical: 'center' }}>{selectText}</Text>}
        selectedText="lựa chọn"
        confirmText={'Xác Nhận'}
        uniqueKey={uniqueKey}
        displayKey={displayKey}
        showChips={false}
        noItemsComponent={< NoItem />}
        noResultsComponent={< NoItem />}
        itemNumberOfLines={1}
        selectLabelNumberOfLines={1}
        headerComponent={< SearchHeader {...{ onSearch, loading, setLoading }} />}
        selectToggleIconComponent={
          <View style={{ marginLeft: 10 }}>
            <ToggleIcon
              allowRemove={onRemove && Array.isArray(selectedItems) && selectedItems.length > 0}
              onRemove={onRemove}
            />
          </View>
        }
        styles={styles.sectionedMultiSelect}
        itemFontFamily={{ fontWeight: 'normal' }}
        stickyFooterComponent={< Footer handleSave={onConfirm} onClose={onCancel} />}
        searchPlaceholderText="Chọn"
      />
    </View >
  );
};


const styles = {
  confirmText: {
    backgroundColor: 'pink',
  },
  icon: {
    fontSize: 16,
    color: '#000',
    paddingLeft: 5,
    paddingRight: 5,
  },
  icon2: {
    fontSize: 16,
    color: '#FFF',
    paddingLeft: 5,
    paddingRight: 5,
  },
  view: {
    flex: 1,
  },
  sectionedMultiSelect: {
    button: { backgroundColor: '#rgba(46, 149, 46, 1)', height: 50 },
    cancelButton: { backgroundColor: '#ffa217' },
    selectToggle: {
      minHeight: 45,
      alignContent: 'center',
      paddingRight: 5,
    },
    selectToggleText: {
      textAlign: 'right',
      marginRight: 10,
      alignItems: 'center',
      fontWeight: '400',
      color: 'black',
    },
  },
};
export default MultiAPISearch;
