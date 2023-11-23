import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Icon from 'react-native-vector-icons/Entypo';  
import ListPage from '../../components/ListPage';
import CustomHeader from '../../components/Header';
import { API_HRM_WAGE } from '../../configs/Paths';
import { getFilterOr } from '../../utils/common'
import _ from 'lodash';
import { getData } from '../../utils/storage';
import { makeSelectProfile } from '../App/selectors';
import BackHeader from '../../components/Header/BackHeader';
import { navigate } from '../../RootNavigation';
import { BackHandler, DeviceEventEmitter, Text , View, TouchableOpacity } from 'react-native';


function SalaryPage(props) {
  const { navigation, route } = props;
  const { params } = route
  const [query, setQuery] = useState({});
  const [reload, setReload] = useState(0);

  useEffect(() => {

    const addEvent = DeviceEventEmitter.addListener("updateSalaryPage", (e) => {
      handleReload()
    })
    return () => {
      addEvent.remove()
    }
  }, [])

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

  const handleReload = (e, isReload = false) => {
    if (isReload) onSearchText('');
    else setReload((e) => e + 1);
  };

  const onSearchText = async (text) => {
    let newQuery = { ...query };
    newQuery = getFilterOr(newQuery, text, ['name'])
    setQuery(newQuery);
  };

  return (
    <View style={{flex:1}}>
      <BackHeader title="Bảng lương" navigation={navigation} />
      <ListPage
        query={query}
        reload={reload}
        api={API_HRM_WAGE}
        itemComponent={({ item }) => {
          const { month, year } = item

          const inCharge = _.get(item, 'inChargedEmployeeId.name')
          const department = _.get(item, 'organizationUnitId.name')

          return <TouchableOpacity activeOpacity={1} style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', margin: 10, paddingBottom: 10, borderBottomWidth: 0.75,}}  onPress={() => navigation.navigate('HrmSalaryPageDetail', { item: item }) }>
            <View>
              <Text>{`Bảng lương tháng ${month} năm ${year}`}</Text>
              {inCharge && <Text note numberOfLines={1}>{`Phụ trách: ${inCharge}`}</Text>}
              {department && <Text note numberOfLines={1}>{`Phòng ban: ${department}`}</Text>}

            </View>
            <View>
              <Icon name="chevron-right" type="Entypo" />
            </View>
          </TouchableOpacity>
        }}
      />
      <FabLayout style={styles}>
        <Icon type="Entypo" name="plus" style={{ color: '#fff' }} onPress={() => navigate('HrmNewSalaryPage')} />
      </FabLayout>
    </View>
  );
}

const mapStateToProps = createStructuredSelector({
  profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SalaryPage);

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
