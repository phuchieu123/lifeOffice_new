import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Body, Container, Content, Icon, List, ListItem, Right, Text } from 'native-base';
import ListPage from '../../components/ListPage';
import CustomHeader from '../../components/Header';
import { API_HRM_WAGE } from '../../configs/Paths';
import { getFilterOr } from '../../utils/common'
import _ from 'lodash';
import { getData } from '../../utils/storage';
import { makeSelectProfile } from '../App/selectors';
import BackHeader from '../../components/Header/BackHeader';
import { DeviceEventEmitter } from 'react-native';

function SalaryPage(props) {

  const { navigation, route } = props;
  const [query, setQuery] = useState({});
  const [reload, setReload] = useState(0);

  useEffect(() => {
    getData('profile').then(profile => {
      setQuery({
        'organizationUnit.organizationUnitId': _.get(profile, 'organizationUnit.organizationUnitId')
      })
    })
  }, []);

  useEffect(() => {
    const updateEvent = DeviceEventEmitter.addListener("updateSalaryPage", (e) => {
      handleReload()
    })
    return () => {
      updateEvent.remove()
    };
  }, []);

  //const handleReload = () => setReload((e) => e + 1)

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
    <Container>
      <BackHeader title="Bảng lương" navigation={navigation} />
      <ListPage
        query={query}
        reload={reload}
        api={API_HRM_WAGE}
        itemComponent={({ item }) => {
          const { month, year } = item

          const inCharge = _.get(item, 'inChargedEmployeeId.name')
          const department = _.get(item, 'organizationUnitId.name')

          return <ListItem onPress={() => navigation.navigate('SalaryPageDetail', { item })}>
            <Body>
              <Text>{`Bảng lương tháng ${month} (${year})`}</Text>
              {inCharge && <Text note numberOfLines={1}>{`Phụ trách: ${inCharge}`}</Text>}
              {department && <Text note numberOfLines={1}>{`Phòng ban: ${department}`}</Text>}
            </Body>
            <Right>
              <Icon name="chevron-right" type="Entypo" />
            </Right>
          </ListItem>
        }}
      />
      <FabLayout>
        <Icon type="Entypo" name="plus" style={{ color: '#fff' }} onPress={() => navigation.navigate('HrmNewSalaryPage')} />
      </FabLayout>
    </Container>
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
