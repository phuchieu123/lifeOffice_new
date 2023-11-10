import React, {useState, useEffect, Fragment} from 'react';
// import {Button } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import {INCOMING_DOCUMENT} from '../../configs/Paths';
import {handleSearch, serialize} from '../../utils/common';
import LoadingLayout from '../../components/LoadingLayout';
import moment from 'moment';
import _ from 'lodash';
import * as RootNavigation from '../../RootNavigation';
import {
  TouchableNativeFeedback,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

export default IncomingDocument = props => {
  const {} = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);

    const newQuery = {
      sort: '-receiveTime',
      filter: {
        type: 2,
      },
      limit: 3,
      skip: 0,
    };
    const url = `${await INCOMING_DOCUMENT()}?${serialize(newQuery)}`;

    await handleSearch(url, e => {
      if (Array.isArray(e)) {
        let newData = [...e];
        newData = newData.map(item => ({
          ...item,
          time: moment(item['receiveTime']).format('DD/MM/YYYY HH:mm'),
          customHour: moment(item['receiveTime']).format('HH:mm'),
          customDate: moment(item['receiveTime']).format('DD/MM/YY'),
        }));
        setData(newData);
      }
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
          <Text style={{textAlign:'center',
              color: 'white',
              marginBottom: 10,
              marginTop: 10,
              }}>Công văn đến</Text>
          <Icon
            name="reload"
            style={{position: 'absolute', right: 10, top:12, color: '#fff'}}
          />
        </TouchableOpacity>
      </View>
      <LoadingLayout isLoading={loading}>
        <View
          style={{backgroundColor: '#fff', borderRadius: 10, marginBottom: 5, marginTop: 5, }}>
          <View style={{marginLeft: 10}}>
            {data.length === 0 ? (
              <View>
                <View>
                  <Text>Không có công văn đến</Text>
                </View>
              </View>
            ) : (
              <>
                {data.map((item, index) => {
                  return (
                    <TouchableNativeFeedback 
                      key={`CVD_${item._id}`}
                      onPress={() => {
                        RootNavigation.navigate('DetailsOfficialDispatch', {
                          item,
                        });
                      }}   
                      
                      >
                      <View style={{ paddingLeft: 10, paddingTop:10,paddingBottom:10, borderBottomWidth: 1, borderBottomColor:'#666666'}}>
                        <View>
                          <Text style={styles.textColor}>{item.name}</Text>
                          <Text style={styles.textColor} note>{item.receivingUnitName}</Text>    
                        </View>
                        <View>
                          <Text style={styles.textColor} note>{item.customHour}</Text>
                          <Text style={styles.textColor} note>{item.customDate}</Text>
                        </View>
                      </View>
                    </TouchableNativeFeedback>
                  );
                })}
              </>
            )}
            <TouchableNativeFeedback
              onPress={() =>
                RootNavigation.navigate('Officialdispatch', {type: 2})
              }>
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
