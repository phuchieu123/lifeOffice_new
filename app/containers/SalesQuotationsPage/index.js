import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import moment from 'moment';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectSalesQuotationsPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Header, Icon, Container, View, CardItem, Body, Card, Text } from 'native-base';
import ListPage from 'components/ListPage';
import CustomHeader from '../../components/Header';
import RightHeader from '../../components/CustomFilter/RightHeader';
import FabLayout from '../../components/CustomFab/FabLayout';
import SearchBox from '../../components/SearchBox';
import { MEETING_SCHEDULE } from '../../configs/Paths';
import _ from 'lodash';
import { getProfile } from '../../utils/authen';
import { TouchableNativeFeedback } from 'react-native';
import { navigate } from '../../RootNavigation';
import * as RootNavigation from '../../RootNavigation';
const DATE_FORMAT = 'YYYY-MM-DD';

export function SalesQuotationsPage(props) {
  useInjectReducer({ key: 'meetingSchedulePage', reducer });
  useInjectSaga({ key: 'meetingSchedulePage', saga });
  // const DEFAULT_QUERY = {
  //   filter: {
  //     startDate: {
  //       $gte: `${moment().startOf('day').subtract(30, 'days').toISOString()}`,
  //       $lte: `${moment().endOf('day').toISOString()}`,
  //     },
  //   },
  //   sort: '-createdAt',
  // };

  const { navigation } = props;

  const [isSeaching, setIsSearching] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  // const [query, setQuery] = useState(DEFAULT_QUERY);
  const [reload, setReload] = useState(0);

  useEffect(() => {
  }, []);

  const handleReload = (e, isReload = false) => {
    if (isReload) onSearchText('');
    else setReload((e) => e + 1);
  };

  const handleEdit = (project) => {
    navigation.navigate('SalesQuotationsDetail', {
      project,
      onGoBack: handleReload,
    });
  };

  const handleAdd = () => {
    RootNavigation.navigate('createNewDatail');
  };

  const [query, setQuery] = useState()
  useEffect(() => {
    getProfile().then(profile => {
      setQuery({
        sort: 'timeStart',
        filter: {
          typeCalendar: 1,
          people: {
            $in: [{
              _id: profile._id
            }]
          }
        },
      })
    })
  }, [])

  const customData = ({ data }) => {
    return data.map(item => ({
      ...item,
      timeStartFormat: moment(item['timeStart']).format('DD/MM/YYYY'),
      timeEndFormat: moment(item['timeEnd']).format('DD/MM/YYYY'),
    }))
  }

  return (
    <Container>
      {isSeaching ? (
        <Header searchBar rounded hasTabs>
          <SearchBox onSearch={onSearchText} onClose={() => setIsSearching(false)} textSearch={textSearch} />
        </Header>
      ) : null}
      <CustomHeader
        title="Lịch họp"
        navigation={navigation}

      />
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        <ListPage
          reload={reload}
          query={query}
          customData={customData}
          api={MEETING_SCHEDULE}
          itemComponent={({ item }) => {
            return (<TouchableNativeFeedback
              key={`${item._id}`}
              onPress={() => navigate('SalesQuotationsDatailPage', { "item._id": item._id, })}
            >

              <Card style={{ borderRadius: 10 }}>
                <CardItem style={{ borderRadius: 10 }}>
                  <Body>
                    <View style={styles.view}>
                      <View style={{ flex: 1 }}>
                        <Text numberOfLines={1}>{item.name}</Text>
                      </View>
                    </View>
                    {_.has(item, 'roomMetting.name') ? <View style={styles.view}>
                      <View style={{ flex: 1 }}>
                        <Text note>{item.roomMetting.name}</Text>
                      </View>
                    </View> : null}
                    {_.has(item, 'content') ?
                      <View style={styles.view}>
                        <View style={{ flex: 1 }}>
                          <Text note numberOfLines={3}>{item.content}</Text>
                        </View>
                      </View> : null}
                    <View style={styles.view}>
                      <View style={{ flexDirection: "row", flex: 1 }}>
                        <Icon name='calendar' type='AntDesign' style={styles.icon} />
                        <Text note style={{ justifyContent: 'center' }}>{item.timeStartFormat} - {item.timeEndFormat}</Text>
                      </View>
                    </View>
                  </Body>
                </CardItem>
              </Card>
            </TouchableNativeFeedback>
            )
          }}
        />
      </View>

      {/* <FabLayout onPress={() => { RootNavigation.navigate('CreateNewDetail') }}> */}
      <FabLayout onPress={() => { RootNavigation.navigate('SalesQuotationsDatailPage', { onSuccess: handleReload }) }}>
        <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
      </FabLayout>
    </Container>
  );
}

const mapStateToProps = createStructuredSelector({
});

function mapDispatchToProps(dispatch) {
  return {
  };
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
    marginTop: 1,
    marginRight: 4
  }
}
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(SalesQuotationsPage);
