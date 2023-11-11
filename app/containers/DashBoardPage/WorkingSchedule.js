import React, {useState, useEffect, Fragment} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import * as RootNavigation from '../../RootNavigation';
import {INCOMING_DOCUMENT, MEETING_SCHEDULE} from '../../configs/Paths';
import {handleSearch, serialize} from '../../utils/common';
import {taskKanbanData} from '../../utils/constants';
import LoadingLayout from '../../components/LoadingLayout';
import moment from 'moment';
import _ from 'lodash';
import {getProfile} from '../../utils/authen';

export default IncomingDocument = props => {
  const {getCount, profile} = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);

    await getProfile().then(async profile => {
      const newQuery = {
        filter: {
          typeCalendar: 2,
          people: {$in: [{_id: profile._id, name: profile.name}]},
        },
        limit: 3,
        skip: 0,
      };
      const url = `${await MEETING_SCHEDULE()}?${serialize(newQuery)}`;

      await handleSearch(
        url,
        e => {
          if (Array.isArray(e)) {
            let newData = [...e];
            newData = newData.map(item => ({
              ...item,
              hourStart: moment(item['timeStart']).format('hh:mm'),
              timeStartFormat: moment(item['timeStart']).format('DD/MM/YY'),
              timeEndFormat: moment(item['timeEnd']).format('DD/MM/YY'),
              // dateFormat: moment(item['timeStart']).format('DD-MM-YY'),
            }));
            setData(newData);
          }
        },
        {
          getResponse: res => {
            res && res.count && getCount && getCount(res.count);
          },
        },
      );
    });

    setLoading(false);
  };

  return (
    <>
      <View style={styles.view}>
        <TouchableOpacity
          small
          block
          style={{
            position: 'relative',
            width: '100%',
            marginVertical: 2,
            borderRadius: 20,
            padding: 0,
            margin: 0,
            backgroundColor: 'rgba(46, 149, 46, 1)',
          }}
          onPress={getData}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              marginBottom: 10,
              marginTop: 10,
            }}>
            Lịch công tác
          </Text>
          <Icon
            name="reload"
            style={{position: 'absolute', right: 10, top: 12, color: '#fff'}}
          />
        </TouchableOpacity>
      </View>
      <LoadingLayout isLoading={loading}>
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            marginBottom: 5,
            marginTop: 5,
          }}>
          <View style={{marginLeft: 10}}>
            {data && data.length === 0 ? (
              <View
                style={{borderBottomColor: '#b2b2b2', borderBottomWidth: 1}}>
                <View style={{padding: 10}}>
                  <Text>Không có lịch họp</Text>
                </View>
              </View>
            ) : (
              <>
                {data &&
                  data.map((item, index) => {
                    return (
                      <TouchableNativeFeedback
                        key={`${item._id}`}
                        onPress={() =>
                          RootNavigation.navigate('WorkingScheduleDetailPage', {
                            'item._id': item._id,
                          })
                        }>
                        <View style={{ paddingLeft: 10, paddingTop:10,paddingBottom:10, borderBottomWidth: 1, borderBottomColor:'#666666'}}>
                          <View>
                            <Text style={styles.textColor}>{item.name}</Text>
                            {_.has(item, 'roomMetting.name') ? (
                              <Text note style={styles.textColor}>{item.roomMetting.name}</Text>
                            ) : null}
                            <Text note numberOfLines={1}  style={styles.textColor}>
                              {item.content}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.textColor} note>{item && item.hourStart}</Text>
                            <Text style={styles.textColor} note>{item && item.timeEndFormat}</Text>
                          </View>
                        </View>
                      </TouchableNativeFeedback>
                    );
                  })}
              </>
            )}
            <TouchableNativeFeedback
              onPress={() => {
                RootNavigation.navigate('WorkingSchedulePage');
              }}>
              <View style={{flexDirection: 'row', justifyContent:"space-between", paddingTop:10,paddingBottom:10,}}>
                <View>
                  <Text style={styles.textColor}>Xem tất cả</Text>
                </View>
                <View style={{paddingRight: 10, color:'#666666'}} >
                  <Icon name="arrow-forward" />
                </View>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </LoadingLayout>
    </>
  );
};

const styles = {
  view: {
    flex: 1,
    flexDirection: 'row',
  },
  textColor:{
    color: 'black'
  }
};
