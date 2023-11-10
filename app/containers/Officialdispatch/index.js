import React, { useState, useEffect } from 'react';
import { Body, Card, CardItem, Container, Content, Icon, Text, View } from 'native-base';
import CustomHeader from '../../components/Header';
import ListPage from '../../components/ListPage';
import { INCOMING_DOCUMENT } from '../../configs/Paths';
import moment from 'moment';
import { navigate } from '../../RootNavigation';
import { BackHandler, DeviceEventEmitter, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { DATE_FORMAT } from '../../utils/constants';
import RightHeader from '../../components/CustomFilter/RightHeader';
import SearchBox from '../../components/SearchBox'
import _ from "lodash";
import { getFilterOr } from '../../utils/common';
import { autoLogout } from '../../utils/autoLogout';


export default function Officialdispatch(props) {

    const { navigation, route } = props;
    const { params } = route
    const { type } = params;

    const [query, setQuery] = useState()

    const [reload, setReload] = useState(0)
    const [isSeaching, setIsSearching] = useState(false);

    useEffect(() => {
        const updateEvent = DeviceEventEmitter.addListener("updateOfficialdispatchSuccess", (e) => {
            handleReload()
        })
        return () => {
            updateEvent.remove()
        };
    }, []);

    useEffect(() => {
        setQuery({
            sort: '-updatedAt',
            filter: {
                type
            },
        })
    }, [type])

    useEffect(() => {
        navigation.addListener(
            'focus', () => {
                autoLogout()
            }
        );

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

    const handleReload = () => setReload((e) => e + 1)

    const customData = ({ data }) => {
        return data.map(item => ({
            ...item,
            sendTimeCustom: moment(item['toDate']).format(DATE_FORMAT.DATE_TIME),
            receiveTimeCustom: moment(item['receiveTime']).format(DATE_FORMAT.DATE_TIME),
        }))
    }

    const handleFilter = (obj) => {
        if (!obj.employeeId && obj.organizationUnitId) {
            setQuery(e => ({
                sort: '-updatedAt',
                filter: {
                    type,
                    organizationUnitId: obj.organizationUnitId,
                },
            }))
        } else if (obj.employeeId && !obj.organizationUnitId) {
            setQuery(e => ({
                sort: '-updatedAt',
                filter: {
                    type,
                    createdBy: obj.employeeId,
                },
            }))
        } else if (obj.startDate && obj.endDate && !obj.employeeId && !obj.organizationUnitId) {
            setQuery(e => ({
                sort: '-updatedAt',
                filter: {
                    type,
                    ["toDate"]: {
                        "$gte": `${moment(obj.startDate).toISOString()}`,
                        "$lte": `${moment(obj.endDate).toISOString()}`,
                    }
                },
            }))
        } else if (obj.startDate && obj.endDate && obj.employeeId && obj.organizationUnitId) {
            setQuery(e => ({
                sort: '-updatedAt',
                filter: {
                    type,
                    organizationUnitId: obj.organizationUnitId,
                    createdBy: obj.employeeId,
                    ["toDate"]: {
                        "$gte": `${moment(obj.startDate).toISOString()}`,
                        "$lte": `${moment(obj.endDate).toISOString()}`,
                    }
                },
            }))
        }

    }

    const onSearchText = async (text) => {
        let newQuery = { ...query };
        newQuery = getFilterOr(newQuery, text, ['name'])
        if (text.trim() !== '') {
            newQuery.filter.$or = [
                {
                    name: {
                        $regex: text.trim(),
                        $options: 'gi',
                    },
                },
            ];
        }
        setQuery(newQuery);

    };


    return (
        <Container>
            {isSeaching && <SearchBox isSeaching={isSeaching} onChange={onSearchText} setIsSearching={setIsSearching} />}
            <CustomHeader
                navigation={navigation}
                title={type === 1 ? 'Công văn đi' : type === 2 ? 'Công văn đến' : ''}
                rightHeader={
                    <RightHeader
                        children={<Icon name="search" type="FontAwesome" onPress={() => setIsSearching(true)} style={{ color: '#fff', marginHorizontal: 10 }} />}
                        enableFilterModal
                        enableFilterOrg
                        organizationUnitId={_.get(query, 'filter.organizationUnit')}
                        employeeId={_.get(query, 'filter.employeeId')}
                        enableFilterEmp
                        enableDatePicker
                        startDate={_.get(query, 'filter.startDate.$gte') && moment(query.filter.startDate.$gte).format(DATE_FORMAT)}
                        endDate={_.get(query, 'filter.startDate.$lte') && moment(query.filter.startDate.$lte).format(DATE_FORMAT)}
                        onSave={handleFilter}
                    />
                }
            />
            <View style={{ flex: 1, marginHorizontal: 5 }}>
                {console.log(query)}
                <ListPage
                    reload={reload}
                    query={query}
                    api={INCOMING_DOCUMENT}
                    customData={customData}
                    itemComponent={({ item }) => {
                        return <TouchableWithoutFeedback onPress={() => navigate('DetailsOfficialDispatch', { item })}>
                            <Card style={{ borderRadius: 10 }}>
                                <CardItem style={{ borderRadius: 10 }}>
                                    <Body>
                                        <View style={styles.view}>
                                            <View style={{ flex: 1 }}>
                                                <Text numberOfLines={1}>{item.name}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.view}>
                                            <View style={{ flex: 1 }}>
                                                <Text note>{item.receivingUnitName}</Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text note>{item.code}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.view}>
                                            <View style={{ flexDirection: "row", flex: 1 }}>
                                                <Icon name='arrow-up' type='Entypo' style={styles.icon} />
                                                <Text note style={{ justifyContent: 'center' }}>{item.sendTimeCustom}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", alignItems: 'flex-end' }}>
                                                <Icon name='arrow-down' type='Entypo' style={styles.icon} />
                                                <Text note>{item.receiveTimeCustom}</Text>
                                            </View>
                                        </View>
                                    </Body>
                                </CardItem>
                            </Card></TouchableWithoutFeedback>
                    }}
                />
            </View>

            <FabLayout onPress={() => navigate('CreatDocumentary', { type })}>
                <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
            </FabLayout>
        </Container >
    )
}

const styles = {
    view: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 2
    },
    icon: {
        fontSize: 18,
        opacity: 0.4,
        marginTop: 0
    }
}