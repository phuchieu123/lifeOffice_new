import React, { useEffect, useState, useRef } from 'react';
import { BackHandler, DeviceEventEmitter, Linking } from 'react-native'
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { API_PERSONNEL } from '../../configs/Paths';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectPersonnelPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import * as actions from './actions';
import { Container, Icon, View, ListItem, Left, Body, Text, Spinner, Button, List, Right, Content } from 'native-base';
import images from '../../images';
import CustomThumbnail from '../../components/CustomThumbnail';
import theme from '../../utils/customTheme';
import ListPage from '../../components/ListPage';
import { Header } from 'native-base';
import CustomHeader from '../../components/Header';
import SearchBox from '../../components/SearchBox';
import _ from 'lodash';
import { navigate } from '../../RootNavigation';
import moment from 'moment';
import FabLayout from '../../components/CustomFab/FabLayout';
import RightHeader from '../../components/CustomFilter/RightHeader';

export function PersonnelPage(props) {
  useInjectReducer({ key: 'personnelPage', reducer });
  useInjectSaga({ key: 'personnelPage', saga });
  const { navigation, route } = props;
  const { params } = route;
  const { PUT } = params;
  const [query, setQuery] = useState({ sort: '-updatedAt' });
  const [isSeaching, setIsSearching] = useState(false);
  const [reload, setReload] = useState(0)
  const onChangeText = (text) => {
    const newQuery = { ...query };
    if (!newQuery.filter) newQuery.filter = {}
    delete newQuery.filter.$or
    if (text.trim() !== '') {
      newQuery.filter.$or = [
        {
          name: {
            $regex: text.trim(),
            $options: 'gi',
          },
        },
        {
          code: {
            $regex: text.trim(),
            $options: 'gi',
          }
        }
      ];
    }

    setQuery(newQuery)
  }


  const handleReload = () => {
    setReload(e => e + 1)
  }

  useEffect(() => {
    const addEvent = DeviceEventEmitter.addListener("onAddCustomer", (e) => {
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

  const handleFilter = (obj) => {
    const { organizationUnitId } = obj
    setQuery(e => ({
      ...e,
      filter: {
        ...e.filter,
        organizationUnit: organizationUnitId
      }
    }))
  }

  return (
    <Container>
      {isSeaching && <SearchBox isSeaching={isSeaching} onChange={onChangeText} setIsSearching={setIsSearching} />}
      <CustomHeader title="Nhân sự" navigation={navigation}
        rightHeader={
          <RightHeader
            children={<Icon name="search" type="FontAwesome" onPress={() => setIsSearching(true)} style={{ color: '#fff', marginHorizontal: 10 }} />}
            organizationUnitId={_.get(query.filter, 'organizationUnit.organizationUnitId')}
            enableFilterModal
            enableFilterOrg
            onSave={handleFilter}
          />
        }
      />
      <View style={{ flex: 1, backgroundColor: '#eee', padding: 10 }}>
        <View padder style={{ flex: 1, backgroundColor: '#fff', borderRadius: 20 }}>
          <ListPage
            reload={reload}
            query={query}
            api={async () => `${await API_PERSONNEL()}`}
            itemComponent={({ item }) => <RenderItem user={item} PUT={PUT} />}
          />
        </View>
      </View>
      <FabLayout onPress={() => navigate('AddPersonnel')} style={{ bottom: 10, right: 10 }}>
        <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
      </FabLayout>
    </Container>
  );
}


const mapStateToProps = createStructuredSelector({
  personnelPage: makeSelectPersonnelPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetDepartment: (query) => dispatch(actions.fetchListDepartment(query)),
    onGetUser: (query) => dispatch(actions.fetchAllUser(query)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(PersonnelPage);


const RenderItem = (props) => {
  const { user, PUT } = props
  const makeCall = (phoneNumber) => {
    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phoneNumber}`;
    } else {
      phoneNumber = `telprompt:${phoneNumber}`;
    }

    Linking.openURL(phoneNumber);
  }
  const makeEmail = (email) => {
    if (Platform.OS === 'android') {
      email = `mailto:${email}`;
    } else {
      email = `mailto:${email}`;
    }

    Linking.openURL(email);
  }


  return (
    <ListItem onPress={() => navigate('DetailsPersonnel', { id: user._id, PUT: PUT })}>
      <Left>
        <CustomThumbnail image={user.avatar ? { uri: user.avatar } : images.userImage} />
        {/* <Thumbnail source={user.avatar ? { uri: user.avatar } : images.userImage} /> */}
      </Left>
      <Body style={{ flex: 2.5, flexDirection: 'column' }} >
        <View style={{ display: 'flex', flexDirection: 'column' }}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {user.name ?
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={{ color: theme.textTitle, fontWeight: 'bold', marginBottom: 4 }}>
                  {user.name}
                </Text>
              </View> : null}
            <Text style={{ alignSelf: 'flex-end' }}>{user.gender == 0 ? 'Nam' : 'Nữ'}</Text>


          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={{ fontWeight: 'bold', display: 'flex', alignSelf: 'flex-start' }}>{user.code}</Text>
            </View>
            <View style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Text>{user.birthday ? moment(user.birthday).format('DD/MM/YYYY') : ''}</Text>
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {user.position ?
              <View style={{ flex: 1, marginBottom: 4, alignSelf: 'flex-end' }}>
                <Text numberOfLines={1}>{user.position && user.position.title}</Text>
              </View> : null}
          </View>
        </View>

        <View style={{ flex: 1, flexDirection: 'row', }}>
          {user.phoneNumber ?
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', }}>
              <Icon name="phone" type="MaterialCommunityIcons" style={{ paddingRight: 3, fontSize: 25, color: '#0066CC', marginBottom: 4 }} />
              <Text onPress={() => makeCall(user.phoneNumber)} numberOfLines={1} style={{ color: '#0066CC', marginBottom: 4 }} >{user.phoneNumber}</Text>
            </View> : null}
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Icon name="email" type="MaterialCommunityIcons" style={{ fontSize: 16, paddingRight: 3, fontSize: 25, color: '#009900', marginBottom: 8 }} />
            <Text onPress={() => makeEmail(user.email)} numberOfLines={1} style={{ color: '#009900', marginBottom: 4 }} >{user.email}</Text>
          </View>
        </View>
      </Body>
    </ListItem>
  );
};
