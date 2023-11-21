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
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
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
    <View style={{flex: 1}}>
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
              accessible={false} 
              key={`${item._id}`}
              onPress={() => navigate('WorkingScheduleDetailPage', { "item._id": item._id })}
            >
              <View style={{ borderRadius: 10 }}>
                <View style={{ borderRadius: 10 }}>
                  <View>
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
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>)
          }}
        />
         
        <FabLayout style={styles.sty} onPress={() => RootNavigation.navigate('WorkingScheduleDetailPage')}>
          <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
        </FabLayout>
      </View> 
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
  },
  sty:  {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  }
}