import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { TouchableOpacity, FlatList } from 'react-native';
import { ListItem, Text, View, Button, Radio, Icon } from 'native-base';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { makeSelectDepartmentsByLevel } from '../../containers/App/selectors';
import Footer from './components/Footer'
import ToggleIcon from './components/ToggleIcon';
import SearchHeader from './components/SearchHeader';
import { getListById } from '../../utils/common';
import _ from 'lodash';
import styles from './styles';
import Modal from 'react-native-modal';
import NoItem from './components/NoItem';

const DepartmentSelect = (props) => {
  const {
    departments,
    selectedItems,
    handleSelectItems,
    handleSelectObjectItems,
  } = props;

  const displayKey = 'name'
  const uniqueKey = '_id'
  const single = true

  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState([]);
  const [items, setItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (Array.isArray(departments)) {
      let id = departments.map(e => e._id)
      let newData = departments.filter(e => !e.parent || !id.includes(e.parent))
      if (newData.length === 1) newData = [...newData, ...departments.filter(e => e.parent === newData[0]._id)]
      setItems(newData)
    }
  }, [departments]);

  useEffect(() => {
    if (Array.isArray(selectedItems)) setDataId(selectedItems);
    else setDataId([]);
  }, [selectedItems]);

  useEffect(() => {
    const result = departments.filter(item => dataId.includes(item[uniqueKey]));
    setData(result)
  }, [dataId]);

  const onSelect = (selected) => {
    if (!selected.length) return

    if (single) {
      const result = [...selected].pop()
      if (result) setDataId([result])
      else setDataId([])
    } else setDataId(selected)
  }

  const handleSave = () => {
    setIsVisible(false)
    if (handleSelectItems) handleSelectItems(dataId);
    else if (handleSelectObjectItems) handleSelectObjectItems(data);
  }

  const onClose = () => {
    setDataId(Array.isArray(props.selectedItems) ? props.selectedItems : props.selectedItems ? [props.selectedItems] : []);
    setIsVisible(false)
  }

  const onOpen = () => {
    setIsVisible(true)
  }

  return <View style={styles.view}>
    <ShowValue onOpen={onOpen} data={data} single={single} displayKey={displayKey} />
    <Modal isVisible={isVisible} style={styles.modal}>
      {/* <SearchHeader {...{ onSearch, loading, setLoading }} /> */}
      <View style={{ flex: 1, padding: 0 }}>
        <ListItem itemHeader itemDivider style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <Text>Phòng ban/đơn vị</Text>
        </ListItem>
        {!items.length ? <NoItem /> : null}
        <FlatList
          data={items}
          keyExtractor={(item) => item[uniqueKey]}
          renderItem={({ item }) =>
            <RenderItem
              single
              item={item}
              title={item[displayKey]}
              value={item[uniqueKey]}
              selectedItems={dataId}
              onSelect={onSelect}
              setItems={setItems}
              items={items}
              departments={departments}
            />}
        />
      </View>

      <Footer onClose={onClose} handleSave={handleSave} />
    </Modal >
  </View >
};

const mapStateToProps = createStructuredSelector({
  departments: makeSelectDepartmentsByLevel(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(DepartmentSelect);

const ShowValue = (props) => {
  const { onOpen, data, single, displayKey } = props

  return <TouchableOpacity style={styles.button} onPress={onOpen}>
    {data.length
      ? <Text style={{ marginRight: 10, textAlignVertical: 'center', textAlign: 'right' }}>{single ? data[0][displayKey] : `(${data.length} đã chọn)`}</Text>
      : <Text style={{ marginRight: 10, textAlignVertical: 'center', textAlign: 'right', color: '#666' }}>Tất cả</Text>
    }
    <ToggleIcon />
  </TouchableOpacity>
}










const RenderItem = ({ item, title, value, selectedItems, onSelect, items, departments, setItems }) => {
  const [selected, setSelected] = useState(false)
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    const result = selectedItems.includes(value)
    if (result !== selected) setSelected(result)
  }, [value, selectedItems, selected])


  useEffect(() => {
    const found = items.find(e => e.parent === value) ? true : false
    if (found !== isShow) setIsShow(found)
  }, [value, items, isShow])

  const onItemPress = () => {
    if (!item.hasChild) return

    let newItems = []
    if (isShow) {
      let found = false
      let done = false
      let level

      items.forEach(item => {
        const { name: title } = item
        if (done) newItems.push(item)
        else if (found) done = level === (title.length - title.trimLeft().length)
        else if (item._id === value) {
          found = true
          level = title.length - title.trimLeft().length
          newItems.push(item)
        }
      });
    } else {
      let showId = items.map(e => e._id)
      showId = [...showId, ...departments.filter(e => e.parent === value).map(e => e._id)]
      newItems = departments.filter(e => showId.includes(e._id))
    }
    setItems(newItems)
  }

  const onRemove = () => {
    onSelect(selectedItems.filter(e => e !== value))
  }

  const onAdd = () => {
    onSelect([...selectedItems, value])
  }

  return <ListItem style={{ flex: 1, flexDirection: 'row', width: '93%' }} onPress={onItemPress}>
    <Text>{' '.repeat(title.length - title.trimLeft().length)}</Text>
    {item.hasChild
      ? isShow
        ? <Icon name='chevron-down' type='Entypo' />
        : <Icon name='chevron-right' type='Entypo' />
      : <Text>      </Text>}
    <Text style={{ flex: 1 }}>{title.trimLeft()}</Text>
    <View style={{ flexDirection: 'row' }}>
      <Radio selected={true} onPress={onRemove} style={{ display: selected ? 'flex' : 'none' }} />
      <Radio selected={false} onPress={onAdd} style={{ display: selected ? 'none' : 'flex' }} />
    </View>
  </ListItem >
}