import React, { useEffect, useState, memo } from 'react'
import { DeviceEventEmitter, FlatList, Platform } from 'react-native'
import { Body, Icon, Left, ListItem, Right, Text, View } from 'native-base'
import { downloadFile, getFile } from '../../api/fileSystem'
import { navigate } from '../../RootNavigation'
import moment from 'moment'
import { API_FILE } from '../../configs/Paths'
import { TouchableOpacity } from 'react-native';
import { makeSelectClientId } from '../../containers/App/selectors'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { DATE_FORMAT } from '../../utils/constants'

const FileView = props => {
    const { visible, id, code, clientId } = props
    const [data, setData] = useState([])
    const [reload, setReload] = useState(0)
    useEffect(() => {
        code && id && getData()
    }, [id, code])

    const handleReload = () => setReload(reload + 1)
    useEffect(() => {
        getData()
    }, [data])

    const getData = async () => {
        const res = await getFile('company', {
            clientId,
            code,
            id,
        })
        setData(res.filter(e => e.isFile))
    }

    useEffect(() => {

        const addEvent = DeviceEventEmitter.addListener("handleAddFile", (e) => {
            handleReload()
        })
        return () => {
            addEvent.remove()

        };
    }, []);

    const download = async (item) => {
        try {
            const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`
            const title = item.name


            downloadFile(uri, title)
        } catch (error) { }
    }
    const toWatch = async (item) => {
        try {
            if (item.type === '.pdf') {
                const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`
                const title = item.name
                navigate('PDFViewer', {
                    uri: uri,
                    title: title,
                });

            }
            if (item.type === '.jpg' || item.type === '.png' || item.type === '.jpeg') {
                const uri = `${await API_FILE()}/GetImage/${item.clientId}?id=${item._id}`
                const title = item.name
                navigate('ViewScreenImg', {
                    uri: uri,
                    title: title,
                });
            }
        } catch (error) { }
    }
    // const download = async (item) => {

    //     downloadFile(item)
    // }

    return !visible ? null :
        <FlatList
            refreshing={reload}
            data={data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
                const { name, createdAt } = item

                return <ListItem>
                    <Icon type='MaterialCommunityIcons' name='file' />

                    <Body>
                        <TouchableOpacity onPress={() => { toWatch(item) }}>
                            <Text>{name}</Text>
                            <Text style={{ fontSize: 14 }}>Ngày tạo: {moment(createdAt).format(DATE_FORMAT.DATE_TIME)}</Text>
                        </TouchableOpacity>
                    </Body>

                    <TouchableOpacity onPress={() => { download(item) }}>
                        <Icon type='MaterialCommunityIcons' name='download' style={{ fontSize: 30 }} />
                    </TouchableOpacity>

                </ListItem>
            }}

        />
}


const mapStateToProps = createStructuredSelector({
    clientId: makeSelectClientId()
});

function mapDispatchToProps(dispatch) {
    return {
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(FileView);