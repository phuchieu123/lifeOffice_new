import React, { useState, useEffect, useRef } from 'react';
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
    onRemoveSelectedItem,
    canRemove = true,
  } = props;

  const displayKey = 'name'
  const uniqueKey = '_id'
  const single = true

  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState([]);
  const [items, setItems] = useState([]);
  const [parentId, setParentId] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (Array.isArray(departments)) {
      let id = departments.map(e => e._id)
      let newData = departments.filter(e => !e.parent || !id.includes(e.parent))
      // if (newData.length === 1) newData = [...newData, ...departments.filter(e => e.parent === newData[0]._id)]
      setParentId(newData.map(e => e._id))
    }
  }, [departments]);

  useEffect(() => {
    if (Array.isArray(departments) && Array.isArray(parentId)) {
      const found = departments.filter(e => dataId.includes(e._id))
      let id = getListById(found, departments)
      id = [...id, ...parentId]
      setItems(departments.filter(e => id.includes(e._id)))
    }
  }, [departments, parentId, dataId]);

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
    <TouchableOpacity style={styles.button} onPress={onOpen}>
      {data.length
        ? <Text style={{ marginRight: 10, textAlignVertical: 'center' }}>{single ? data[0][displayKey] : `(${data.length} đã chọn)`}</Text>
        : <Text style={{ marginRight: 10, textAlignVertical: 'center' }}>Tất cả</Text>
      }
      <ToggleIcon />
    </TouchableOpacity>

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

const RenderItem = ({ item, title, value, selectedItems, onSelect }) => {
  const [selected, setSelected] = useState(false)

  useEffect(() => {
    if (Array.isArray(selectedItems)) {
      const result = selectedItems.find(e => e === value)
      if (result !== selected) {
        setSelected(result)
      }
    }
  }, [value, selectedItems])

  const onRemove = () => {
    onSelect(selectedItems.filter(e => e !== value))
  }

  const onAdd = () => {
    onSelect([...selectedItems, value])
  }

  const onItemPress = () => {
    if (selected) onRemove()
    else onAdd()
  }

  return <ListItem style={{ flex: 1, flexDirection: 'row', width: '93%' }} onPress={onItemPress}>
    <Text>{' '.repeat(title.length - title.trimLeft().length)}</Text>
    {item.hasChild
      ? selected
        ? <Icon name='chevron-down' type='Entypo' />
        : <Icon name='chevron-right' type='Entypo' />
      : <Text>      </Text>}
    <Text style={{ flex: 1 }}>{title.trimLeft()}</Text>
    <View style={{ flexDirection: 'row' }}>
      <Radio selected={true} onPress={onItemPress} style={{ display: selected ? 'flex' : 'none' }} />
      <Radio selected={false} onPress={onItemPress} style={{ display: selected ? 'none' : 'flex' }} />
    </View>
  </ListItem >
}