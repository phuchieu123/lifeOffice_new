import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import theme from 'utils/customTheme';

const DepartmentSelect = (props) => {
  const {
    departments,
    selectedItems,
    handleSelectItems,
    handleSelectObjectItems,
    emptyText = "Lựa chọn"
  } = props;

  const single = true

  const [data, setData] = useState([]);
  const [items, setItems] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const dataId = useRef([])
  const showId = useRef([])

  useEffect(() => {
    if (Array.isArray(departments)) {
      let id = departments.map(e => e._id)
      let newData = departments.filter(e => !e.parent || !id.includes(e.parent))
      if (newData.length === 1) newData = [...newData, ...departments.filter(e => e.parent === newData[0]._id)]
      setItems(newData)
    }
  }, [departments]);

  const handleSave = () => {
    setIsVisible(false)
    if (handleSelectItems) handleSelectItems(dataId);
    else if (handleSelectObjectItems) handleSelectObjectItems(data);
  }

  const onClose = () => {
    // setDataId(Array.isArray(props.selectedItems) ? props.selectedItems : props.selectedItems ? [props.selectedItems] : []);
    setIsVisible(false)
  }

  const onOpen = () => {
    setIsVisible(true)
  }

  const onSelect = (item, select) => {
    if (select) dataId.current = single ? [item._id] : [...dataId.current, item._id]
    else dataId.current = dataId.current.filter(e => e._id === item._id)
    setData(departments.filter(e => dataId.current.includes(e._id)))
  }

  const onShow = (item, show) => {
    const { _id, level } = item
    let newItems = []
    if (show) {
      let arr = items.map(e => e._id)
      arr = [...arr, ...departments.filter(e => e.parent === _id).map(e => e._id)]
      newItems = departments.filter(e => arr.includes(e._id))
      showId.current.push(_id)
    } else {
      let found = false
      let done = false

      items.forEach(it => {
        if (found && !done) {
          done = level === it.level
          if (!done) return
        }
        else if (!found && it._id === _id) found = true
        newItems.push(it)
        showId.current = showId.current.filter(e => e !== _id)
      });
    }
    setItems(newItems)
  }

  const renderItem = useCallback(({ item }) => {
    return <RenderItem
      item={item}
      onSelect={onSelect}
      onShow={onShow}
      items={items}
      departments={departments}
      isShow={showId.current.includes(item._id)}
      selected={dataId.current.includes(item._id)}
    />
  }, [items])

  return <View style={styles.view}>
    <ShowValue onOpen={onOpen} data={data} single={single} displayKey={'name'} emptyText={emptyText} />
    <Modal isVisible={isVisible} style={styles.modal}>
      {/* <SearchHeader {...{ onSearch, loading, setLoading }} /> */}
      <View style={{ flex: 1, padding: 0 }}>
        <ListItem itemHeader itemDivider style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
          <Text>Phòng ban/đơn vị</Text>
        </ListItem>
        {!items.length ? <NoItem /> : null}
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
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
  const { onOpen, data, single, displayKey, emptyText } = props

  return <TouchableOpacity style={styles.button} onPress={onOpen}>
    {data.length
      ? <Text style={{ marginRight: 10, textAlignVertical: 'center', textAlign: 'right' }}>{single ? data[0][displayKey] : `(${data.length} đã chọn)`}</Text>
      : <Text style={{ marginRight: 10, textAlignVertical: 'center', textAlign: 'right', color: '#666' }}>{emptyText}</Text>
    }
    <ToggleIcon />
  </TouchableOpacity>
}

const RenderItem = ({ item, onShow, onSelect, isShow, selected }) => {
  const { _id, name, level, hasChild } = item

  const onItemPress = () => {
    if (!hasChild) toggleRadio()
    else onShow(item, !isShow)
  }

  const toggleRadio = () => {
    onSelect(item, !selected)
  }

  return <ListItem style={{ flex: 1, flexDirection: 'row', width: '93%' }} onPress={onItemPress}>
    <Text>{' '.repeat(name.length - name.trimLeft().length)}</Text>
    {hasChild
      ? isShow
        ? <Icon name='chevron-down' type='Entypo' />
        : <Icon name='chevron-right' type='Entypo' />
      : <Text>      </Text>}
    <Text style={{ flex: 1 }}>{name.trimLeft()}</Text>
    <View style={{ flexDirection: 'row' }}>
      <Radio selected={true} onPress={toggleRadio} color={theme.brandPrimary} selectedColor={theme.brandPrimary} style={{ display: selected ? 'flex' : 'none' }} />
      <Radio selected={false} onPress={toggleRadio} color={theme.brandPrimary} style={{ display: selected ? 'none' : 'flex' }} />
    </View>
  </ListItem >
}