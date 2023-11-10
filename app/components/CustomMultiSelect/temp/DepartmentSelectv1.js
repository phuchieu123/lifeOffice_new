import React, { useState, useEffect, useRef } from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { ListItem, Text, View } from 'native-base';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { makeSelectDepartmentsByLevel } from '../../containers/App/selectors';
import Footer from './components/Footer'
import { icons } from './components/common';
import ToggleIcon from './components/ToggleIcon';
import SearchHeader from './components/SearchHeader';
import { getListById } from '../../utils/common';
import _ from 'lodash';

const DepartmentSelect = (props) => {
  const {
    departments,
    selectedItems,
    handleSelectItems,
    handleSelectObjectItems,
    onRemoveSelectedItem,
    canRemove = true,
    disabled,
  } = props;

  const uniqueKey = '_id'
  const single = true

  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState([]);
  const [localItem, setLocalItem] = useState([]);
  const [parentId, setParentId] = useState([]);
  const multi = useRef()

  useEffect(() => {
    if (Array.isArray(departments)) {
      let id = departments.map(e => e._id)
      let newData = departments.filter(e => !e.parent || !id.includes(e.parent))
      if (newData.length === 1) newData = [...newData, ...departments.filter(e => e.parent === newData[0]._id)]
      setParentId(newData.map(e => e._id))
    }
  }, [departments, dataId]);

  useEffect(() => {
    if (Array.isArray(departments) && Array.isArray(parentId)) {
      const found = departments.filter(e => dataId.includes(e._id))
      let id = getListById(found, departments)
      id = [...id, ...parentId]
      setLocalItem(departments.filter(e => id.includes(e._id)))
    }
  }, [departments, parentId, dataId]);

  useEffect(() => {
    Array.isArray(selectedItems) && setDataId(selectedItems);
  }, [selectedItems]);

  const onSelectedItemsChange = (e) => {
    let newData = e
    if (single && newData.length) newData = [newData.pop()]
    if ((!canRemove || !onRemoveSelectedItem) && !newData.length) return
    setDataId(newData);
    setData(localItem.filter(item => newData.includes(item[uniqueKey])));
  };

  const handleSave = () => {
    multi.current._closeSelector()
    handleSelectItems && handleSelectItems(dataId);
    handleSelectObjectItems && handleSelectObjectItems(data);
  }

  return (
    <View style={{ flex: 1 }}>
      <SectionedMultiSelect
        {...props}
        items={localItem}
        selectedItems={dataId}
        disabled={disabled}
        uniqueKey={uniqueKey}
        onSelectedItemsChange={onSelectedItemsChange}
        // onToggleSelector={onToggleSelector}
        ref={multi}
        single={false}
        hideSearch
        hideConfirm
        IconRenderer={icons}
        showChips={false}
        selectText=""
        displayKey={'name'}
        noItemsComponent={<NoItem />}
        noResultsComponent={<NoItem />}
        itemNumberOfLines={1}
        selectLabelNumberOfLines={1}
        styles={styles.sectionedMultiSelect}
        itemFontFamily={{ fontWeight: 'normal' }}
        stickyFooterComponent={<Footer handleSave={handleSave} onClose={() => multi.current._closeSelector()} />}
        // headerComponent={<SearchHeader onSearch={onSearch} />}
        headerComponent={
          <ListItem itemHeader itemDivider style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
            <Text>Phòng ban/đơn vị</Text>
          </ListItem>
        }
        selectToggleIconComponent={
          <ToggleIcon
            allowRemove={!disabled && canRemove && onRemoveSelectedItem && Array.isArray(selectedItems) && selectedItems.length > 0}
            onRemove={onRemoveSelectedItem}
          />
        }
      />
    </View>
  );
};

const NoItem = () => <Text style={{ alignSelf: 'center', opacity: 0.5 }}>Không có dữ liệu</Text>;

const mapStateToProps = createStructuredSelector({
  departments: makeSelectDepartmentsByLevel(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(DepartmentSelect);

const styles = {
  icon: {
    fontSize: 18,
    color: '#000',
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 10,
  },

  icon2: {
    fontSize: 18,
    color: '#FFF',
    paddingLeft: 5,
    paddingRight: 5,
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
  }
};
