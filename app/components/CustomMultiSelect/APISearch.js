import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { Text, Button } from 'native-base';
import Modal from 'react-native-modal';
import _ from 'lodash';

import { handleSearch, serialize, mergeArray, formatDisplayKey, getFilterOr } from '../../utils/common';

import NoItem from './components/NoItem';
import Footer from './components/Footer';
import SearchHeader from './components/SearchHeader';
import ToggleIcon from './components/ToggleIcon';
import { API_ADVANCE_REQUIRE, API_CONTRACT, API_DOCUMENTARY, API_TASK_PROJECT, API_CUSTOMER } from '../../configs/Paths';
import { navigate } from '../../RootNavigation';
import RenderItem from './components/RenderItem';
import styles from './styles';
import DefaultTitle from './components/DefaultTitle';
import LoadingLayout from '../LoadingLayout';

const APISearch = (props) => {
    const {
        single,
        API,
        selectedDatas,
        query = {},
        filterOr = ['name'],
        customDislayKey,
        uniqueKey = '_id',
        limit = 20,
        readOnly,
        buttonStyles,
        disabled
    } = props;

    const displayKey = customDislayKey && customDislayKey.join() || props.displayKey || 'name';

    const [isVisible, setIsVisible] = useState(false);
    const [enableInfo, setEnableInfo] = useState(false);
    const [showSelected, setShowSelected] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState();

    const localItems = useRef([]);
    const data = useRef([]);
    const open = useRef();
    const lastQuery = useRef()
    const component = useRef(true);
    const allowGetData = useRef(false);


    const selectedTextCount = `Đã chọn ${selectedItems.length ? `(${selectedItems.length})` : ''}`

    useEffect(() => {
        component.current = true
        return () => {
            component.current = false;
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(props.selectedItems)) setSelectedItems(props.selectedItems);
        else if (single && props.selectedItems) setSelectedItems([props.selectedItems]);
        else setSelectedItems([]);
    }, [props.selectedItems]);

    useEffect(() => {
        if (readOnly && _.has(selectedDatas, '[0]') && _.has(selectedItems, '[0]')) {
            setItems(selectedDatas.filter(e => selectedItems.includes(e[uniqueKey])))
        }
    }, [selectedDatas, selectedItems]);

    useEffect(() => {
        API && [API_ADVANCE_REQUIRE, API_CONTRACT, API_DOCUMENTARY, API_TASK_PROJECT, API_CUSTOMER].includes(API) && setEnableInfo(true)
    }, [API]);

    useEffect(() => {
        if (!readOnly && isVisible && !allowGetData.current) {
            allowGetData.current = true
            onSearch()
        }
    }, [isVisible]);

    useEffect(() => {
        if (!readOnly && !_.isEqual(lastQuery.current, query)) {
            lastQuery.current = { ...query }
            onSearch();
        }
    }, [query]);

    useEffect(() => {
        if (!readOnly && _.has(selectedDatas, '[0]')) {
            let tmp = [...selectedDatas];
            if (customDislayKey) tmp = formatDisplayKey(tmp, customDislayKey);
            data.current = mergeArray(data.current, tmp, uniqueKey);
            if (!open.current) setItems(data.current);

            const exist = localItems.current.map(e => e[uniqueKey])
            tmp = tmp.filter(e => exist.includes(e[uniqueKey]))
            if (_.has(tmp, '[0]')) localItems.current = mergeArray(localItems.current, tmp, uniqueKey);
        }
    }, [selectedDatas]);

    const getItems = async (newQuery = {}) => {
        if (!allowGetData.current) return
        setLoading(true);
        const url = `${await API()}?${serialize({ ...newQuery, limit, skip: 0 })}`;
        await handleSearch(url, (e) => {
            if (!component.current) return;
            if (Array.isArray(e)) {
                let res = [...e];
                if (props.customData) res = props.customData(res)
                if (customDislayKey) res = formatDisplayKey(res, customDislayKey);
                localItems.current = res;
                if (open.current && !readOnly) setItems(res);
                if (props.getData) props.getData(res);
                data.current = mergeArray(data.current, res, uniqueKey);
            }
            setLoading(false);
        });
    };

    const onSearch = (value = '') => {
        if (showSelected) {

        } else {
            const newQuery = getFilterOr(query, value, filterOr)
            getItems(newQuery);
        }
    };

    const handleSave = () => {
        open.current = false
        setIsVisible(false)
        if (props.onSelectedItemsChange) {
            selectedItems.length
                ? props.onSelectedItemsChange(selectedItems)
                : props.onSelectedItemsChange([])
        }
        if (props.onSelectedItemObjectsChange) {
            selectedItems.length
                ? props.onSelectedItemObjectsChange(data.current.filter(e => selectedItems.includes(e[uniqueKey])))
                : props.onSelectedItemObjectsChange([])
        }
    }

    const onSelect = (selected) => {
        if (single) {
            const result = [...selected].pop()
            if (result) setSelectedItems([result])
            else setSelectedItems([])
        } else setSelectedItems(selected)
    }

    const onOpen = () => {
        if(disabled === false || !disabled){
            open.current = true
            !readOnly && setItems(localItems.current);
            setIsVisible(true)
        }
    }

    const onClose = () => {
        open.current = false
        setSelectedItems(Array.isArray(props.selectedItems) ? props.selectedItems : props.selectedItems ? [props.selectedItems] : []);
        setIsVisible(false)
        !readOnly && setItems(data.current);
    }

    const onInfoPress = (value) => {
        if (value) {
            switch (API) {
                case API_TASK_PROJECT:
                    navigate('ProjectDetail', { project: { _id: value._id } })
                    break;
                case API_DOCUMENTARY:
                    navigate('DetailsOfficialDispatch', { item: value })
                    break;
                case API_ADVANCE_REQUIRE:
                    navigate('InTernalFinance', { project: { _id: value } })
                    break;
                case API_CONTRACT:
                    navigate('ContractDetails', { item: value })
                    break;
                case API_CUSTOMER:
                    navigate('AddCustomer', { id: value._id, view: true })
                    break;
            }
        }
        onClose()
    }

    const onGetSelected = () => {
        setShowSelected(!showSelected)
        if (showSelected) {
            setItems(localItems.current)
        } else {
            setItems(data.current.filter(e => selectedItems.includes(e[uniqueKey])))
        }
    }

    return <View style={styles.view}>
        <TouchableOpacity style={{ ...styles.button, ...buttonStyles }} onPress={onOpen}>
            <DefaultTitle
                emptyText={props.emptyText}
                data={data.current}
                selectedItems={selectedItems}
                uniqueKey={uniqueKey}
                displayKey={displayKey}
                defaultTitle={props.children}
            />
        </TouchableOpacity>

        <Modal isVisible={isVisible} style={styles.modal}>
            <SearchHeader {...{ onSearch, loading, setLoading }} />
            <LoadingLayout isLoading={loading}>
                {!items.length ? <NoItem /> : null}
                <FlatList
                    data={items}
                    keyExtractor={(item) => item[uniqueKey]}
                    renderItem={({ item }) => {
                        return (
                            <RenderItem
                                readOnly={readOnly}
                                enableInfo={enableInfo}
                                item={item}
                                title={item[displayKey]}
                                value={item[uniqueKey]}
                                onSelect={onSelect}
                                onInfoPress={onInfoPress}
                                selectedItems={selectedItems}
                            />
                        )
                    }}

                />
            </LoadingLayout>

            {!single && <View padder style={{ flexDirection: 'row', margin: 5, marginTop: 0 }}>
                {(!readOnly && (selectedItems.length || showSelected))
                    ? showSelected
                        ? <Button block small onPress={onGetSelected} full style={{ flex: 1, borderRadius: 10, margin: 5, marginBottom: 0 }} success>
                            <Text>{selectedTextCount}</Text>
                        </Button>
                        : <Button block small onPress={onGetSelected} full style={{ flex: 1, borderRadius: 10, margin: 5, marginBottom: 0 }} primary>
                            <Text>{selectedTextCount}</Text>
                        </Button>
                    : null
                }
            </View>}
            <Footer onClose={onClose} handleSave={handleSave} readOnly={readOnly} />
        </Modal>
    </View>
};

export default APISearch;
