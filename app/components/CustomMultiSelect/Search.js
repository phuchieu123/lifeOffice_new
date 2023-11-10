import React, { useState, memo, useEffect, useRef, useCallback } from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { Icon, Text, Button } from 'native-base';
import Footer from './components/Footer'
import ToggleIcon from './components/ToggleIcon';
import _ from 'lodash';
import styles from './styles';
import SearchHeader from './components/SearchHeader';
import RenderItem from './components/RenderItem';
import Modal from 'react-native-modal';
import DefaultTitle from './components/DefaultTitle';

const Search = (props) => {
  const {
    single,
    displayKey = 'name',
    uniqueKey = '_id',
    readOnly,
    disabled
  } = props;

  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showSelected, setShowSelected] = useState(false);

  useEffect(() => {
    setItems(props.items)
  }, [props.items]);

  useEffect(() => {
    if (Array.isArray(props.selectedItems)) setSelectedItems(props.selectedItems);
    else if (single && props.selectedItems) setSelectedItems([props.selectedItems]);
    else setSelectedItems([]);
  }, [props.selectedItems]);

  const onOpen = () => {
    if (disabled === false || !disabled) {
      if (readOnly) return
      setIsVisible(true)
    }
  }

  const onClose = () => {
    setSelectedItems(props.selectedItems);
    setIsVisible(false)
  }

  const handleSave = () => {
    props.handleSelectItems && props.handleSelectItems(selectedItems);
    props.handleSelectObjectItems && props.handleSelectObjectItems(props.items.filter(item => selectedItems.includes(item[uniqueKey])));
    setIsVisible(false)
  }

  const onSelect = (selected) => {
    if (single) {
      const result = [...selected].pop()
      if (result) setSelectedItems([result])
      else setSelectedItems([])
    } else setSelectedItems(selected)
  }

  const onSearch = (value = '') => {

  };

  const onGetSelected = () => {
    setShowSelected(!showSelected)
    if (showSelected) {
      setItems(props.items)
    } else {
      setItems(props.items.filter(e => e[uniqueKey] === selectedItems[0]))
    }
  }

  const selectedTextCount = `Đã chọn ${selectedItems.length ? `(${selectedItems.length})` : ''}`

  return <View style={styles.view}>
    <TouchableOpacity style={{ ...styles.button, ...props.buttonStyles }} onPress={onOpen}>
      <DefaultTitle
        disableIcon={props.disableIcon || readOnly}
        styles={props.styles}
        defaultTitle={props.children}
        emptyText={props.emptyText}
        data={props.items}
        selectedItems={selectedItems}
        uniqueKey={uniqueKey}
        displayKey={displayKey}
      />
    </TouchableOpacity>

    <Modal isVisible={isVisible} style={styles.modal}>
      <SearchHeader onSearch={onSearch} />

      <View style={{ flex: 1, padding: 0 }}>
        {!items.length ? <NoItem /> : null}
        <FlatList
          data={items}
          keyExtractor={(item) => item[uniqueKey]}
          renderItem={({ item }) => {
            return (
              <RenderItem
                item={item}
                title={item[displayKey]}
                value={item[uniqueKey]}
                selectedItems={selectedItems}
                onSelect={onSelect}
              />
            )
          }
          }
        />
      </View>

      <View padder style={{ flexDirection: 'row', margin: 5, marginTop: 0 }}>
        {(selectedItems.length || showSelected)
          ? showSelected
            ? <Button block small onPress={onGetSelected} full style={{ flex: 1, borderRadius: 10, margin: 5, marginBottom: 0 }} success>
              <Text>{selectedTextCount}</Text>
            </Button>
            : <Button block small onPress={onGetSelected} full style={{ flex: 1, borderRadius: 10, margin: 5, marginBottom: 0 }} primary>
              <Text>{selectedTextCount}</Text>
            </Button>
          : null
        }
      </View>

      <Footer onClose={onClose} handleSave={handleSave} />
    </Modal >
  </View >
};

export default memo(Search);