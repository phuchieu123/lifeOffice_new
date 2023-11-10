import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import moment from 'moment';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectWorkingSchedulePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { Header, Icon, Container, Card, CardItem, Body, View, Text } from 'native-base';
import ListPage from '../../components/ListPage';
import CustomHeader from '../../components/Header';
import RightHeader from '../../components/CustomFilter/RightHeader';
import FabLayout from '../../components/CustomFab/FabLayout';
import SearchBox from '../../components/SearchBox';
import { getProfile } from '../../utils/authen';
import { MEETING_SCHEDULE } from '../../configs/Paths';
import _ from 'lodash';
import { BackHandler, DeviceEventEmitter, TouchableNativeFeedback } from 'react-native';
import { navigate } from '../../RootNavigation';
import * as RootNavigation from '../../RootNavigation';
import { makeSelectProfile } from '../App/selectors';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

export function WorkingSchedulePage(props) {
  useInjectReducer({ key: 'workingSchedulePage', reducer });
  useInjectSaga({ key: 'workingSchedulePage', saga });

  const { navigation, profile } = props;

  const [query, setQuery] = useState({
    sort: '-updatedAt',
    filter: {
      typeCalendar: 2,
      people: {
        $in: [{
          _id: profile._id
        }]
      }
    },
    limit: 10,
    skip: 0
  })
  const [reload, setReload] = useState(0);

  useEffect(() => {
    navigation.addListener(
      'focus', () => {
        setReload((e) => e + 1);
      }
    );
    const addEvent = DeviceEventEmitter.addListener("addCalendarSuccess", () => {
      handleReload()
    })

    return () => {
      addEvent.remove()
    };
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

  const handleReload = () => {
    setReload((e) => e + 1)
  }

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
      {/* {isSeaching ? (
        <Header searchBar rounded hasTabs>
          <SearchBox onSearch={onSearchText} onClose={() => setIsSearching(false)} textSearch={textSearch} />
        </Header>
      ) : null} */}
      <CustomHeader
        title="Lịch công tác"
        navigation={navigation}
      />
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        <ListPage
          query={query}
          reload={reload}
          customData={customData}
          api={MEETING_SCHEDULE}
          itemComponent={({ item }) => {
            return (<TouchableNativeFeedback
              key={`${item._id}`}
              onPress={() => navigate('WorkingScheduleDetailPage', { "item._id": item._id })}
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
            </TouchableNativeFeedback>)
          }}
        />

        <FabLayout onPress={() => RootNavigation.navigate('WorkingScheduleDetailPage')}>
          <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
        </FabLayout>
      </View>
    </Container >
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

export default compose(withConnect)(WorkingSchedulePage);

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