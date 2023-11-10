import React, { useState, useRef, useEffect, Fragment } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { handleSearch, serialize, mergeArray, formatDisplayKey } from 'utils/common';
import { Text } from 'native-base';
import Footer from './components/Footer';
import SearchHeader from './components/SearchHeader';
import ToggleIcon from './components/ToggleIcon';
import { icons } from './components/common';
import { getFilterOr } from '../../utils/common';
import _ from 'lodash';
import NoItem from './components/NoItem';

const SingleAPISearch = (props) => {
  const {
    API,
    selectedDatas,
    onRemove,
    query = {},
    filterOr = ['name'],
    customDislayKey,
    customData,
    getData,
    uniqueKey = '_id',
    limit = 20,
  } = props;

  const displayKey = customDislayKey && customDislayKey.join() || props.displayKey || 'name';

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState();

  const localItems = useRef([]);
  const data = useRef([]);
  const open = useRef();
  const multi = useRef()
  const lastQuery = useRef()
  const component = useRef(true);

  useEffect(() => {
    component.current = true
    return () => {
      component.current = false;
    };
  }, []);

  useEffect(() => {
    setSelectedItems(Array.isArray(props.selectedItems) ? props.selectedItems : props.selectedItems ? [props.selectedItems] : []);
  }, [props.selectedItems]);

  useEffect(() => {
    if (!_.isEqual(lastQuery.current, query)) {
      lastQuery.current = { ...query }
      onSearch();
    }
  }, [query]);

  useEffect(() => {
    if (!selectedDatas || !Array.isArray(selectedDatas) || !selectedDatas.length) return;
    let tmp = [...selectedDatas];
    if (customDislayKey) tmp = formatDisplayKey(tmp, customDislayKey);
    data.current = mergeArray(data.current, tmp, uniqueKey);
    if (!open.current) setItems(data.current);
  }, [selectedDatas]);

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
        if (getData) getData(res);
      }
      setLoading(false);
    });
  };

  const onSearch = (value = '') => {
    const newQuery = getFilterOr(query, value, filterOr)
    getItems(newQuery);
  };

  const handleSave = () => {
    if (props.onSelectedItemsChange) {
      selectedItems.length
        ? props.onSelectedItemsChange(selectedItems)
        : props.onSelectedItemsChange([])
    }
    if (props.onSelectedItemObjectsChange) {
      selectedItems.length
        ? props.onSelectedItemObjectsChange(data.current.filter(e => e[uniqueKey] === selectedItems[0]))
        : props.onSelectedItemObjectsChange([])
    }
    multi.current._closeSelector()
  }

  const onSelectedItemsChange = (e) => {
    const selected = e.pop()
    setSelectedItems(selected ? [selected] : [])
    if (selected) {
      const tmp = [items.find(e => e[uniqueKey] === selected)]
      data.current = mergeArray(data.current, tmp, uniqueKey);
    }
  }

  const onToggleSelector = (e) => {
    open.current = e;
    setItems(e ? localItems.current : data.current);
  };

  const onClose = (e) => {
    multi.current._closeSelector()
    setSelectedItems(Array.isArray(props.selectedItems) ? props.selectedItems : props.selectedItems ? [props.selectedItems] : []);
  };

  return (
    <View style={styles.view}>
      <SectionedMultiSelect
        ref={multi}
        hideConfirm
        hideSearch
        showRemoveAll
        IconRenderer={icons}
        loading={loading}
        onToggleSelector={onToggleSelector}
        items={items}
        selectedItems={selectedItems}
        onSelectedItemsChange={onSelectedItemsChange}
        selectText=""
        selectedText="lựa chọn"
        confirmText={'Xác Nhận'}
        uniqueKey={uniqueKey}
        displayKey={displayKey}
        showChips={false}
        itemNumberOfLines={1}
        selectLabelNumberOfLines={1}
        noItemsComponent={<NoItem />}
        noResultsComponent={<NoItem />}
        headerComponent={<SearchHeader {...{ onSearch, loading, setLoading }} />}
        selectToggleIconComponent={
          <ToggleIcon
            allowRemove={onRemove && Array.isArray(selectedItems) && selectedItems.length > 0}
            onRemove={onRemove}
          />
        }
        styles={styles.sectionedMultiSelect}
        itemFontFamily={{
          fontWeight: 'normal'
        }}
        stickyFooterComponent={<Footer onClose={onClose} handleSave={handleSave} />}
      />
    </View>
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
      height: 45,
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
export default SingleAPISearch;
