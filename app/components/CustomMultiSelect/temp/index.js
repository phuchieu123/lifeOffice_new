import React, { useState, memo, useEffect, useRef, useCallback } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { Icon, Text, Button } from 'native-base';
import lodash from 'lodash';
import Footer from './components/Footer'
import { icons } from './components/common';
import ToggleIcon from './components/ToggleIcon';
import _ from 'lodash';

const CustomMultiSelect = (props) => {
  const {
    items,
    handleSelectItems,
    selectedItems = [],
    displayKey,
    single,
    uniqueKey = '_id',
    onRemoveSelectedItem,
    canRemove = true,
    handleSelectObjectItems,
    additionContent = [],
    disabled,
    height = 45,
    fontWeight = '400',
    iconColor = '#000',
    textColor = 'black',
    fontSize = 16,
  } = props;

  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState([]);
  const [localItem, setLocalItem] = useState([]);
  const [selectText, setSelectText] = useState('');
  const multi = useRef()

  useEffect(() => {
    const newItems = lodash.unionWith(items, additionContent, lodash.isEqual);
    if (!lodash.isEqual(newItems, localItem)) setLocalItem(newItems);
  }, [items, additionContent]);

  useEffect(() => {
    Array.isArray(selectedItems) && setDataId(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    if (Array.isArray(dataId) && Array.isArray(localItem)) {
      const arr = localItem.filter(e => dataId.includes(e[uniqueKey]))
      const newText = arr.map(e => e[displayKey]).join(', ')
      setSelectText(newText)
    }
  }, [localItem, dataId, uniqueKey, displayKey]);

  const onSelectedItemsChange = (e) => {
    let newData = e
    if (single && newData.length) newData = [newData.pop()]
    if ((!canRemove || !onRemoveSelectedItem) && !newData.length) return
    setDataId(newData);
    setData(localItem.filter(item => newData.includes(item[uniqueKey])));
    // single && !handleSelectObjectItems && handleSelectItems(e);
  };

  const handleSave = () => {
    multi.current._closeSelector()
    handleSelectItems && handleSelectItems(dataId);
    handleSelectObjectItems && handleSelectObjectItems(data);
  }

  const onToggleSelector = (e) => {
    setDataId(selectedItems)
  };

  return (
    <View style={{ flex: 1 }}>
      <SectionedMultiSelect
        ref={multi}
        disabled={disabled}
        hideConfirm
        showCancelButton={false}
        IconRenderer={icons}
        onToggleSelector={onToggleSelector}
        {...props}
        single={false}
        items={localItem}
        searchPlaceholderText="Tìm kiếm..."
        noItemsComponent={<NoItem />}
        noResultsComponent={<NoItem />}
        confirmText={'Xác Nhận'}
        uniqueKey={uniqueKey}
        displayKey={displayKey || 'name'}
        selectText=""
        // subKey="child"
        selectedText="lựa chọn"
        showChips={false}
        showRemoveAll
        showDropDowns={true}
        readOnlyHeadings={false}
        onSelectedItemsChange={onSelectedItemsChange}
        itemNumberOfLines={1}
        selectLabelNumberOfLines={1}
        // onSelectedItemObjectsChange={onSelectedItemObjectsChange}
        selectedItems={dataId}
        selectToggleIconComponent={
          !disabled ?
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {canRemove && onRemoveSelectedItem && selectedItems && selectedItems.length > 0 && (
                <Button transparent onPress={onRemoveSelectedItem} iconRight>
                  <Icon type="FontAwesome" name="remove" color="red" style={{ fontSize, color: iconColor, marginRight: 10 }} />
                </Button>
              )}
              <Icon type="FontAwesome" name="caret-down" color="red" style={{ fontSize, color: iconColor }} />
            </View> : <></>
        }
        styles={{
          selectToggle: {
            height,
            alignContent: 'center',
            paddingRight: 2,
          },
          selectToggleText: { textAlign: 'right', marginRight: 10, alignItems: 'center', fontWeight, color: textColor },
          button: { backgroundColor: '#rgba(46, 149, 46, 1)', height: 50 },
          cancelButton: { backgroundColor: '#ffa217', padding: 5 },
          searchTextInput: { paddingLeft: 5 },
        }}
        itemFontFamily={{ fontWeight: 'normal' }}
        stickyFooterComponent={<Footer handleSave={handleSave} onClose={() => multi.current._closeSelector()} />}
        renderSelectText={() => <Text style={{ flex: 1, textAlign: 'right', minHeight: 45, marginRight: 10, textAlignVertical: 'center' }}>{selectText}</Text>}
      />
    </View>
  );
};

const NoItem = () => <Text style={{ alignSelf: 'center', opacity: 0.5 }}>Không có dữ liệu</Text>;

export default memo(CustomMultiSelect);