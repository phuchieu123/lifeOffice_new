import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { cleanup, getWaterIndicatorsLists } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectWaterIndicatorsListPage from './selectors';

import { Button, Header, Icon, Input, Item, Text } from 'native-base';
import { FlatList } from 'react-native';
import BackHeader from '../../components/Header/BackHeader';
import LoadingLayout from '../../components/LoadingLayout';
import WaterIndicatorsListCard from '../../components/WaterIndicatorCard';
import { getProfile } from '../../utils/authen';

const WaterIndicatorsListPage = props => {
    useInjectReducer({ key: 'waterIndicatorsListPage', reducer });
    useInjectSaga({ key: 'waterIndicatorsListPage', saga });

    const [isSeaching, setIsSearching] = useState(false);
    const [textSearch, setTextSearch] = useState('');
    const [query, setQuery] = useState({ filter: {} });
    const { waterIndicatorsListPage, navigation, route, onCleanup, ongetWaterIndicatorsLists } = props;
    const { waterIndicatorsList, isLoading, isLoadingMore } = waterIndicatorsListPage;
    const { params } = route;

    useEffect(() => {
        initView();
        return () => {
            onCleanup();
        };
    }, [params]);

    const initView = async () => {
        const newQuery = await resetQuery();
        if (params) {
            newQuery.filter = { ...newQuery.filter, isWaterIndicatorsList: false, ...params };
            let status = {
                todo: false,
                stop: false,
                inProcess: false,
                complete: false,
            };
            if (params.taskStatus === 1) {
                status = {
                    ...status,
                    todo: true,
                };
            } else if (params.taskStatus === 2) {
                status = {
                    ...status,
                    inProcess: true,
                };
            } else {
                status = {
                    ...status,
                    complete: true,
                };
            }

            setTaskStatus(status);
            setIsWaterIndicatorsList(false);
        } else {
            setTaskStatus({
                todo: true,
                stop: true,
                inProcess: true,
                complete: true,
            });
        }
        setQuery(newQuery);
        ongetWaterIndicatorsLists(newQuery, false);
    };

    const handleReload = useCallback(
        (e, isReload = false) => {
            // const newQuery = {
            //     ...query,
            //     skip: 0,
            //     limit: 10,
            // };
            // if (isReload) {
            setTextSearch('');
            //     delete newQuery.filter.name;
            // } else {
            //     if (textSearch !== '') {
            //         newQuery.filter.name = {
            //             $regex: textSearch,
            //             $options: 'gi',
            //         };
            //     }
            // }
            // setQuery(newQuery);
            // ongetWaterIndicatorsLists(newQuery);
        },
        [textSearch, query],
    );

    // const handleAddWaterIndicatorsList = () => {
    //     navigation.navigate('AddWaterIndicatorsList', { onGoBack: handleReload });
    // };

    const handleLoadMore = () => {
        if (waterIndicatorsList && waterIndicatorsList.length >= 10) {
            const newQuery = {
                ...query,
                skip: query.skip + 10,
                limit: 10,
            };
            setQuery(newQuery);
            ongetWaterIndicatorsLists(newQuery, true);
        }
    };

    const renderFooter = () => {
        if (isLoadingMore) {
            return <Spinner />;
        }
        return null;
    };

    const resetQuery = async () => {
        const profile = await getProfile();
        const newQuery = {
            filter: {
                isWaterIndicatorsList: isWaterIndicatorsList,
                $or: [
                    { createdBy: profile ? profile._id : '5d7b1bed6369c11a047844e7' },
                    { inCharge: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
                    { viewable: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
                    { join: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
                    { support: { $in: profile ? profile._id : '5d7b1bed6369c11a047844e7' } },
                ],
            },
            sort: '-createdAt',
            limit: 10,
            skip: 0,
        };

        return newQuery;
    };

    const IsCloseToBottom = useCallback(({ layoutMeasurement, contentOffset, contentSize }) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
    }, []);

    const handleAdd = () => {
        navigation.navigate('AddWaterIndicatorPage', { onGoBack: handleReload });
    };

    return <>
        {isSeaching ? (
            <Header searchBar rounded hasTabs>
                <Item>
                    <Button transparent onPress={handleReload}>
                        <Icon name="search" />
                    </Button>
                    <Input placeholder="Tìm kiếm" value={textSearch} onChangeText={(text) => setTextSearch(text)} />
                    <Button iconLeft transparent onPress={() => setTextSearch("")}>
                        <Icon name="remove" type="MaterialIcons" />
                    </Button>
                    <Button transparent onPress={() => setIsSearching(false)}>
                        <Text>Hủy</Text>
                    </Button>
                </Item>
            </Header>
        ) : <BackHeader
            navigation={navigation}
            title="Danh sách chỉ số nước"
            rightHeader={<>
                <Icon name="search" type="FontAwesome" onPress={()=>setIsSearching(true)} style={{ color: '#fff' , marginHorizontal:10 }} />
                {/* <Button transparent onPress={() => setIsSearching(true)}>
                    <Icon name="search" type="FontAwesome" />
                </Button> */}
                {/* <Button transparent>
                    <Icon type="FontAwesome" name="filter" />
                </Button> */}
                
                {/* <Button transparent onPress={handleAdd} >
                    <Icon type="FontAwesome" name="plus-circle" />
                </Button> */}
                <Icon type="FontAwesome" name="plus-circle" onPress={handleAdd} style={{ color: '#fff' , marginHorizontal:10 }}  />
            </>
            }
        />
        }

        <LoadingLayout isLoading={isLoading}>
            <FlatList
                refreshing={isLoading}
                // onRefresh={handleReload}
                data={waterIndicatorsList || []}
                keyExtractor={(item) => item._id}
                ListFooterComponent={renderFooter}
                scrollEventThrottle={16}
                onMomentumScrollEnd={({ nativeEvent }) => {
                    if (IsCloseToBottom(nativeEvent)) {
                        handleLoadMore();
                    }
                }}
                renderItem={({ item }) => (
                    <WaterIndicatorsListCard waterIndicatorsList={item} />
                )}
            />
        </LoadingLayout>
    </>

}

const mapStateToProps = createStructuredSelector({
    waterIndicatorsListPage: makeSelectWaterIndicatorsListPage(),
});

function mapDispatchToProps(dispatch) {
    return {
        ongetWaterIndicatorsLists: () => dispatch(getWaterIndicatorsLists()),
        onCleanup: () => dispatch(cleanup()),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(WaterIndicatorsListPage);