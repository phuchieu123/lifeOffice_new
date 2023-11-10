import React, { useState, useEffect, Fragment } from 'react';
import { BackHandler, DeviceEventEmitter, Text, View } from 'react-native';
import { Button, ListItem, List, Right, Body } from 'native-base';
import { INCOMING_DOCUMENT, API_INCOMMING_DOCUMENT } from '../../configs/Paths';
import { handleSearch, serialize } from '../../utils/common';
import LoadingLayout from '../../components/LoadingLayout';
import moment from 'moment';
import _ from 'lodash';
import * as RootNavigation from '../../RootNavigation';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default ManageDocument = (props) => {
    const { navigation, incomingData, outgoingData } = props;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();

    useEffect(() => {
        getData()
    }, []);

    useEffect(() => {
        const backHandlerListener = BackHandler.addEventListener('hardwareBackPress',
          () => {
            navigation.goBack();
            return true;
          }
        );
        return () => {
          backHandlerListener.remove();
        }
    
      }, []);

    const getData = async () => {
        setLoading(true)

        const newQuery = {
            sort: '-receiveTime',
            filter: {
                type: 2
            },
            limit: 3,
            skip: 0,
        }
        const url = `${await API_INCOMMING_DOCUMENT()}?${serialize(newQuery)}`;

        await handleSearch(url, (e) => {
            if (Array.isArray(e)) {
                let newData = [...e]
                newData = newData.map(item => ({
                    ...item,
                    time: moment(item['receiveTime']).format('DD/MM/YYYY HH:mm'),
                    customHour: moment(item['receiveTime']).format('HH:mm'),
                    customDate: moment(item['receiveTime']).format('DD/MM/YY'),
                }))
                setData(newData)
            }
        })

        setLoading(false)
    }

    return (
        <>
            <View style={styles.view}>
                <Button small rounded block style={{ width: '100%', marginVertical: 2, marginBottom: 5 }} onPress={getData} >
                    <Text style={{ textAlign: 'center' }}>Điều hành văn bản</Text>
                    <Ionicons type='Ionicons' name='reload' style={{ position: 'absolute', right: 0, color: '#fff' }} />
                </Button>
            </View>
            <LoadingLayout isLoading={loading}>
                <View style={styles.vision}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TextManagement', { typeText: 0 })} >
                        <MaterialCommunityIcons
                            name="clipboard-arrow-down"
                            type="MaterialCommunityIcons"
                            style={{ textAlign: 'center', fontSize: 40, color: 'green', margin: 10 }}
                        />
                        <Text style={{ color: 'black', margin: 10, textAlign: 'center' }}>Văn bản đến</Text>
                        <Badge count={incomingData} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TextManagement', { typeText: 1 })}>
                        <MaterialCommunityIcons
                            name="clipboard-arrow-up"
                            type="MaterialCommunityIcons"
                            style={{ textAlign: 'center', fontSize: 40, color: 'green', margin: 10 }}
                        />
                        <Text style={{ color: 'black', margin: 10, textAlign: 'center' }}>Văn bản đi</Text>
                        <Badge count={outgoingData} />
                    </TouchableOpacity>
                </View>
                {/* <View style={{ backgroundColor: '#fff', borderRadius: 10, marginBottom: 5 }}>
                    <List>
                        {data.length === 0 ?
                            <ListItem>
                                <Body>
                                    <Text >Không có công văn đến</Text>
                                </Body>
                            </ListItem>
                            :
                            <>
                                {data.map((item, index) => {
                                    return <TouchableNativeFeedback key={`CVD_${item._id}`} onPress={() => { RootNavigation.navigate('DetailsOfficialDispatch', { item }) }}>
                                        <ListItem >
                                            <Body>
                                                <Text >{item.name}</Text>
                                                <Text note>{item.receivingUnitName}</Text>
                                            </Body>
                                            <Right>
                                                <Text note>{item.customHour}</Text>
                                                <Text note>{item.customDate}</Text>
                                            </Right>
                                        </ListItem>
                                    </TouchableNativeFeedback>
                                })}
                            </>
                        }
                        <TouchableNativeFeedback onPress={() => RootNavigation.navigate('Officialdispatch', { type: 2 })}>
                            <ListItem >
                                <Body>
                                    <Text>Xem tất cả</Text>
                                </Body>
                                <Right>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </ListItem>
                        </TouchableNativeFeedback>
                    </List>
                </View> */}
            </LoadingLayout>
        </>
    );
};

const Badge = ({ count }) => {
    return !count ? null :
      <View style={{ position: 'absolute', bottom: 80, right: 0, backgroundColor: 'red', padding: 0, borderRadius: 20, color: '#fff', width: 40, alignItems: 'center', height: 25, top: 0 }}>
        <Text style={{ color: '#fff' }}>{count <= 99 ? count : '99+'}
        </Text>
      </View>
}

const styles = {
    view: {
        flex: 1,
        flexDirection: 'row',
    },
    vision: {
        // flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        flex: 1,
        flexDirection: 'column',
        height: 'auto',
        borderRadius: 15,
        backgroundColor: 'white',
        margin: 3,
        paddingVertical: 5,
      },
};
