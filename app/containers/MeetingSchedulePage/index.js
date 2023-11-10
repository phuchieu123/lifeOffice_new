import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import moment from 'moment';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectMeetingSchedulePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Header, Icon, Container, View, CardItem, Body, Card, Text } from 'native-base';
import ListPage from '../../components/ListPage';
import CustomHeader from '../../components/Header';
import RightHeader from '../../components/CustomFilter/RightHeader';
import FabLayout from '../../components/CustomFab/FabLayout';
import SearchBox from '../../components/SearchBox';
import { MEETING_SCHEDULE } from '../../configs/Paths';
import _ from 'lodash';
import { getProfile } from '../../utils/authen';
import { BackHandler, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { navigate } from '../../RootNavigation';
import * as RootNavigation from '../../RootNavigation';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

export function MeetingSchedulePage(props) {
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
    navigation.addListener(
      'focus', () => {
        setReload((e) => e + 1);
      }
    );
  }, []);

  const handleReload = (e, isReload = false) => {
    if (isReload) onSearchText('');
    else setReload((e) => e + 1);
  };

  const handleEdit = (project) => {
    navigation.navigate('MeetingScheduleDetail', {
      project,
      onGoBack: handleReload,
    });
  };

  const handleAdd = () => {
    RootNavigation.navigate('createNewDatail');
  };

  // const handleFilter = (filter) => {
  //   const { organizationUnitId: selectedOrg, employeeId: selectedEmp, kanbanStatus, startDate, endDate } = filter;
  //   const newQuery = { ...query };

  //   delete newQuery.filter.organizationUnit;
  //   delete newQuery.filter.employeeId;
  //   if (selectedOrg && selectedOrg.length) newQuery.filter.organizationUnit = selectedOrg;
  //   if (selectedEmp && selectedEmp.length) newQuery.filter.employeeId = selectedEmp;

  //   newQuery.filter.startDate.$gte = `${moment(startDate, DATE_FORMAT).toISOString()}`;
  //   newQuery.filter.startDate.$lte = `${moment(endDate, DATE_FORMAT).endOf('day').toISOString()}`;

  //   setQuery(newQuery);
  // };

  // const onSearchText = async (text) => {
  //   const newQuery = { ...query };
  //   delete newQuery.filter.$or;
  //   if (text) {
  //     newQuery.filter.$or = [
  //       {
  //         name: {
  //           $regex: text.trim(),
  //           $options: 'gi',
  //         },
  //       },
  //     ];
  //   }
  //   setTextSearch(text);
  //   setQuery(newQuery);
  //   setReload((e) => e + 1);
  // };
  const [query, setQuery] = useState()
  useEffect(() => {
    getProfile().then(profile => {
      setQuery({
        sort: '-updatedAt',
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

  const customData = ({ data }) => {
    return data.map(item => ({
      ...item,
      timeStartFormatHH: moment(item['timeStart']).format('HH:mm'),
      timeStartFormat: moment(item['timeStart']).format('DD/MM/YYYY'),
      timeEndFormatHH: moment(item['timeEnd']).format('HH:mm'),
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
            return (
              <TouchableOpacity
                key={`${item._id}`}
                onPress={() => navigate('MeetingScheduleDatailPage', { "item._id": item._id, })}
                delayLongPress={3000}
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
                          <Text note style={{ justifyContent: 'center' }}>{item.timeStartFormatHH} {item.timeStartFormat} - {item.timeEndFormatHH} {item.timeEndFormat}</Text>
                        </View>
                      </View>
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            )
          }}
        />
      </View>

      {/* <FabLayout onPress={() => { RootNavigation.navigate('CreateNewDetail') }}> */}
      <FabLayout onPress={() => { RootNavigation.navigate('MeetingScheduleDatailPage', { onSuccess: handleReload }) }}>
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

export default compose(withConnect)(MeetingSchedulePage);
