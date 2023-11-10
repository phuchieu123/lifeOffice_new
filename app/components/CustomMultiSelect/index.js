import _ from 'lodash';
import { Button, Icon, Text } from 'native-base';
import React, { memo, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import Footer from './components/Footer';
import NoItem from './components/NoItem';
import { icons } from './components/common';

const CustomMultiSelect = (props) => {
  const {
    single,
    items,
    handleSelectItems,
    selectedItems = [],
    displayKey = 'name',
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
  const multi = useRef();

  useEffect(() => {
    const newItems = _.unionWith(items, additionContent, _.isEqual);
    if (!_.isEqual(newItems, localItem)) setLocalItem(newItems);
  }, [items, additionContent]);

  useEffect(() => {
    Array.isArray(selectedItems) && setDataId(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    if (Array.isArray(dataId) && Array.isArray(localItem)) {
      const arr = localItem.filter((e) => dataId.includes(e[uniqueKey]));
      const newText = arr.map((e) => e[displayKey]).join(', ');
      setSelectText(newText);
    }
  }, [localItem, dataId]);

  const onSelectedItemsChange = (e) => {
    let newData = e;
    if (single && newData.length) newData = [newData.pop()];
    if ((!canRemove || !onRemoveSelectedItem) && !newData.length) return;
    setDataId(newData);
    setData(localItem.filter((item) => newData.includes(item[uniqueKey])));
    // single && !handleSelectObjectItems && handleSelectItems(e);
  };

  const handleSave = () => {
    multi.current._closeSelector();
    handleSelectItems && handleSelectItems(dataId);
    handleSelectObjectItems && handleSelectObjectItems(data);
  };

  const onToggleSelector = (e) => {
    setDataId(selectedItems);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
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
        displayKey={displayKey}
        selectText=""
        // subKey="child"
        selectedText="Lựa chọn"
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
          !disabled ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {!dataId.length > 0 && (
                <Text style={{ opacity: 0.5, marginRight: 10, textAlignVertical: 'center' }}>Lựa chọn</Text>
              )}
              {canRemove && onRemoveSelectedItem && selectedItems && selectedItems.length > 0 && (
                <Button transparent onPress={onRemoveSelectedItem} iconRight>
                  <Icon
                    type="FontAwesome"
                    name="remove"
                    color="red"
                    style={{ fontSize, color: iconColor, marginRight: 10 }}
                  />
                </Button>
              )}
              <Icon type="FontAwesome" name="caret-down" color="red" style={{ fontSize, color: iconColor }} />
            </View>
          ) : (
            <></>
          )
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
        renderSelectText={() => (
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              // minHeight: 45,
              marginRight: 10,
              textAlignVertical: 'center',
              color: textColor,
              justifyContent: 'center',
            }}>
            {selectText}
          </Text>
        )}
      />
    </View>
  );
};

export default memo(CustomMultiSelect);
