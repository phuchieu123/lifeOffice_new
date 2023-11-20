import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { API_TIMEKEEPING_TABLE } from '../../configs/Paths';
import ListPage from '../../components/ListPage';
import makeSelectTimeKeepingPage from './selectors';
import BackHeader from '../../components/Header/BackHeader';
import { navigate } from '../../RootNavigation';
import { DeviceEventEmitter } from 'react-native';

export function TimeKeepingTable(props) {
    useInjectReducer({ key: 'timeKeepingPage', reducer });
    useInjectSaga({ key: 'timeKeepingPage', saga });
    const { navigation } = props

    const [reload, setReload] = useState(0);

    const onItemPress = (item) => {
        navigation.navigate('TimeKeepingBoardPage', { timeKeepingData: item })
    }

    useEffect(() => {
        const updateEvent = DeviceEventEmitter.addListener("updateTimeKeepingTable", (e) => {
            handleReload()
        })
        return () => {
            updateEvent.remove()
        };
    }, []);

    const handleReload = () => setReload((e) => e + 1)

    return (
        <View style={{flex: 1}}>
            <BackHeader title="Bảng công" navigation={navigation} />
            <ListPage
                reload={reload}
                query={{ sort: '-updatedAt' }}
                api={API_TIMEKEEPING_TABLE}
                itemComponent={({ item }) => {
                    const { month, year, inChargedEmployeeId, organizationUnitId } = item
                    return <TouchableOpacity onPress={() => onItemPress(item)}>
                        <View>
                            <Text>Bảng công tháng {month} năm {year}</Text>
                            {inChargedEmployeeId ? <Text note>{`Phụ trách: ${inChargedEmployeeId.name}`}</Text> : null}
                            {organizationUnitId ? <Text note>{`Phòng ban: ${organizationUnitId.name}`}</Text> : null}
                        </View>
                        <View>
                            <Icon name="chevron-right" type="Entypo" />
                        </View>
                    </TouchableOpacity>
                }}
            />
            <FabLayout style={styles}>
                <Icon type="Entypo" name="plus" style={{ color: '#fff' }} onPress={() => navigate('AddTimeKeepingTablePage')} />
            </FabLayout>
        </View>
    );
}

const mapStateToProps = createStructuredSelector({
    timeKeepingPage: makeSelectTimeKeepingPage(),
});

function mapDispatchToProps(dispatch) {
    return {

    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(TimeKeepingTable);
const styles = {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  };