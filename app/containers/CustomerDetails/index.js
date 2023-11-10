import React, { Fragment, useEffect, useState } from 'react';
import { Icon, Container, CardItem, Body, View, Text, Button, Card, } from 'native-base';
import { ImageBackground, TouchableOpacity, Image, TouchableWithoutFeedback, DeviceEventEmitter, BackHandler } from 'react-native';
import CustomHeader from '../../components/Header';
import { navigate } from '../../RootNavigation';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';
import moment from 'moment';
import images from '../../images';
import ProgressCircle from 'react-native-progress-circle';
import ListPage from '../../components/ListPage';
import { API_CUSTOMER } from '../../configs/Paths';
import BackHeader from '../../components/Header/BackHeader';
import { getAvatar } from '../../utils/common';
import RightHeader from '../../components/CustomFilter/RightHeader';
import theme from '../../utils/customTheme';
import SearchBox from '../../components/SearchBox';
import { getFilterOr } from '../../utils/common';
import { MODULE } from '../../utils/constants';
import {
    makeSelectKanbanTaskConfigs,
    makeSelectKanbanData,
    makeSelectKanbanBosConfigs,
    makeSelectUserRole,
} from '../App/selectors';
import { autoLogout } from '../../utils/autoLogout';
export function CustomerDetails(props) {
    const DEFAULT_QUERY = {
        filter: {
            status: 1
        },
        sort: '-updatedAt',
    };
    const [query, setQuery] = useState(DEFAULT_QUERY);
    const { navigation, customerRole } = props;
    const [isSeaching, setIsSearching] = useState(false);
    const [reload, setReload] = useState(0);

    useEffect(() => {
        const addEvent = DeviceEventEmitter.addListener("onAddCustomer", (e) => {
            handleReload()
        })
        const addEventReload = DeviceEventEmitter.addListener("onUpdateCustomer", (e) => {
            handleReload()
        })
        return () => {
            addEvent.remove()
            addEventReload.remove()
        }
    }, [])

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

    const handleReload = () => setReload(e => e + 1)

    const handleFilter = (filter) => {
        const { organizationUnitId: selectedOrg, employeeId: selectedEmp } = filter;
        const newQuery = { ...query };
        delete newQuery.filter.organizationUnit;
        delete newQuery.filter.employeeId;
        if (selectedOrg) newQuery.filter.organizationUnitId = selectedOrg;
        if (selectedEmp) newQuery.filter.employeeId = selectedEmp;
        setQuery(newQuery);
    };

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
    // const onChangeText = (text) => {
    //     const newQuery = { ...query };
    //     if (!newQuery.filter) newQuery.filter = {}
    //     delete newQuery.filter.$or
    //     if (text.trim() !== '') {
    //       newQuery.filter.$or = [
    //         {
    //           name: {
    //             $regex: text.trim(),
    //             $options: 'gi',
    //           },
    //         },
    //         {
    //           code: {
    //             $regex: text.trim(),
    //             $options: 'gi',
    //           }
    //         }
    //       ];
    //     }

    //     setQuery(newQuery)
    //   }
    // useEffect(async () => {
    //     const url = `${await API_PERSONNEL()}
    //   }, []);
    // const convertGender = (gender) => {
    //     if (gender === 'female' || gender === 'f') return 2
    //     if (gender === 'male' || gender === 'm') return 1
    //     return 0;
    // }


    return (
        <Container>
            {isSeaching && <SearchBox isSeaching={isSeaching} onChange={onSearchText} setIsSearching={setIsSearching} />
            }
            <CustomHeader
                navigation={navigation}
                title="Khách hàng"
                rightHeader={
                    <RightHeader
                        children={<Icon name="search" type="FontAwesome" onPress={() => setIsSearching(true)} style={{ color: '#fff', marginHorizontal: 10 }} />}
                        enableFilterModal
                        enableFilterOrg
                        organizationUnitId={_.get(query, 'filter.organizationUnit')}
                        employeeId={_.get(query, 'filter.employeeId')}
                        enableFilterEmp
                        onSave={handleFilter}
                    />
                }
            />
            <ListPage
                reload={reload}
                query={query}
                api={async () => `${await API_CUSTOMER()}`}
                // api={API_CUSTOMER}
                itemComponent={({ item }) => {
                    return (
                        <TouchableWithoutFeedback onPress={() => navigate('AddCustomer', { id: item._id })}>
                            <Card style={{ borderRadius: 16 }}>
                                <ImageBackground
                                    // source={images.customer}
                                    style={{ height: 100, width: '100%', flex: 1 }}
                                    imageStyle={{ borderRadius: 10 }}
                                >
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <View style={{ height: 100, alignSelf: 'center', justifyContent: 'center', padding: 10, paddingHorizontal: 20 }}>
                                            <Image
                                                resizeMode="contain"
                                                source={getAvatar(item.avatar, item.gender)}
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    alignSelf: 'center',
                                                    resizeMode: 'cover',
                                                    borderRadius: 60,
                                                }}
                                            />
                                        </View>

                                        <View style={{ flex: 1, justifyContent: 'space-evenly', }}>
                                            {item.name ? <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderColor: '#000', marginRight: 10 }}>
                                                <Icon type="FontAwesome5" name="user-alt" style={{ marginRight: 10, fontSize: 14, color: theme.brandPrimary }} />
                                                <Text style={{ fontSize: 14, }} numberOfLines={2}>{item.name}</Text>
                                            </View> : null}

                                            {item.phoneNumber ? <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderColor: '#000', marginRight: 10 }}>
                                                <Icon type="FontAwesome5" name="phone-alt" style={{ marginRight: 10, fontSize: 14, color: theme.brandPrimary }} />
                                                <Text style={{ fontSize: 14, }} numberOfLines={2}>{item.phoneNumber}</Text>
                                            </View> : null}
                                            {item.address ? <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0.5, borderColor: '#000', marginRight: 10 }}>
                                                <Icon type="FontAwesome" name="home" style={{ marginRight: 10, fontSize: 14, color: theme.brandPrimary }} />
                                                <Text style={{ fontSize: 14, }} numberOfLines={2}>{item.address}</Text>
                                            </View> : null}
                                        </View>

                                    </View>
                                </ImageBackground>
                            </Card>
                        </TouchableWithoutFeedback>
                    )
                }}
            />

            {!customerRole.POST ? null :
                <FabLayout onPress={() => navigate('AddCustomer')}>
                    <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
                </FabLayout>
            }
        </Container>
    );
}


export default connect(
    createStructuredSelector({

        customerRole: makeSelectUserRole(MODULE.CUSTOMER),
    }),
)(CustomerDetails);

