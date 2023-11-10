import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { Button, Text, Right, View } from 'native-base';
import styles from './styles';
import _ from 'lodash';
import { verifyTimekeeping } from '../../../api/timekeeping';
import moment from 'moment';
import { getProfile } from '../../../utils/authen';

export default HistoryCard = (props) => {
  const { item, onPress } = props
  const { name, date, detail, faceTk } = item;

  const [profile, setProfile] = useState({})
  const [startTime, setStartTime] = useState({})
  const [endTime, setEndTime] = useState({})

  useEffect(() => {
    getProfile().then(setProfile)
  }, [])

  return (
    <Button transparent style={{ marginBottom: 5, height: 'auto', padding: 5, width: '100%', flexDirection: 'row', borderRadius: 5 }}>
      <>
        <View
          onPress={() => onPress && onPress({ ...e, name })}
          style={{
            flex: 1,
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 10,
          }}
        >
          <Text style={{ fontSize: 15 }}>Ngày {moment(date).format('DD')}</Text>
        </View>

        <Button
          primary
          style={{ margin: 5, height: 45, width: 'auto', flexDirection: 'row', borderRadius: 5 }}
          onPress={() => {
          }}
        >
          <Text>8:00</Text>
        </Button>

        <Button
          danger
          style={{ margin: 5, height: 45, width: 'auto', flexDirection: 'row', borderRadius: 5 }}
          onPress={() => { }}
        >
          <Text>15:30</Text>
        </Button>

        <Button
          warning
          style={{ margin: 5, height: 45, flexDirection: 'row', borderRadius: 5 }}
          onPress={() => {
            const data = {
              hrmEmployeeId: profile.hrmEmployeeId,
              tableId: item._id,
              dayIndex: true,
            }
            verifyTimekeeping(data)
          }}
        >
          <Text>XN</Text>
        </Button>
      </>
    </Button >
  );
};
