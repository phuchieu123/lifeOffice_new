import React, { useEffect, useState } from 'react';
import { Text } from 'native-base';
import _ from 'lodash';
import LoadingLayout from '../../components/LoadingLayout';
import { FlatList } from 'react-native';

const CustomeList = props => {
    const { uniqueKey = '_id', itemComponent, loadData, data, style, isLoading, ...rest } = props

    const [localData, setLocalData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        reloadData()
    }, [])

    useEffect(() => {
        Array.isArray(data) && setLocalData(data)
    }, [data])

    const reloadData = async () => {
        setLoading(true)
        if (loadData) {
            let result = await loadData()
            Array.isArray(result) && setLocalData(result)
        }
        setLoading(false)
    }

    return <LoadingLayout isLoading={loading || isLoading} style={style}>
        {(isLoading || loading || localData.length) ? null : <Text style={{ textAlign: 'center', margin: 20 }}>Không có dữ liệu</Text>}
        <FlatList
            data={localData}
            refreshing={loading}
            onRefresh={reloadData}
            keyExtractor={item => item[uniqueKey]}
            renderItem={({ item }) => itemComponent({ item })}
            showsVerticalScrollIndicator
        />
    </LoadingLayout>
}
export default CustomeList