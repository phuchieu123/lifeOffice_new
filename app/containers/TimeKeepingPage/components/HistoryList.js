import moment from 'moment';
import React from 'react';
import { StyleSheet, TouchableOpacity,Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const DATE = 'DD/MM/YYYY';

const Tab = createMaterialTopTabNavigator();
export default HistoryList = (props) => {
  const { item, onPress, index } = props
  const { date, faceTk, fingerTk, name } = item;
  const dd = moment(date).isoWeekday();
  let weekday = dd === 1 ? weekday = 'Chủ nhật, ' : weekday = `Thứ ${dd}, `
  const time = moment(date).subtract(1, 'day').format(DATE)

  return (
    <>
      <View style={styles.container}>
        <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: 'rgba(46, 149, 46, 1)', // Màu nền của toàn bộ thanh tab
            borderTopWidth: 0.5,
            borderTopColor:'#aaa',
          },
          activeTintColor: 'white', // Màu chữ của tab đang được chọn
          inactiveTintColor: 'white', // Màu chữ của tab không được chọn
          indicatorStyle: {
            backgroundColor: 'white', // Màu của thanh dưới chữ khi tab được chọn
          },
        }} >
          <Tab.Screen
            name="Chấm công khuôn mặt"
            // tabStyle={{ backgroundColor: 'white', textAlign: 'center' }}
            // textStyle={{ color: 'black' , textAlign: 'center' }}
            // activeTabStyle={{ backgroundColor: 'white', textAlign: 'center'  }}
            // activeTextStyle={{ color: 'black', fontWeight: 'normal', textAlign: 'center'  }}
            // style={{ ...styles.tabs, height: faceTk.length <= 0 || faceTk.length <= 0 ? 150 : 'auto' }}
            component={() => <View >
              <Text style={styles.date}>{weekday}{time}</Text>
              {faceTk && faceTk.map((e, index) => {
                return (
                  <View key={index}>
                    {e.in && <View style={styles.outIn}>
                      <Text style={styles.text}>Chấm công vào:</Text>
                      <TouchableOpacity onPress={() => onPress({ ...e, date, name })}>
                        <Text style={e.in ? styles.timeIn : {}} >{e.in}</Text>
                      </TouchableOpacity>

                    </View>
                    }
                  </View>
                )
              })}
              <View style={styles.viewCheckIn}></View>
              {faceTk && faceTk.length > 0 ? faceTk.map((e, index) => {
                return (
                  <View key={index}>
                    {e.out &&
                      <View style={styles.outIn}>
                        <Text style={styles.text}>Chấm công ra:</Text>
                        <TouchableOpacity onPress={() => onPress({ ...e, date, name })}>
                          <Text style={e.out ? styles.timeOut : {}}>{e.out}</Text>
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                )
              }) :
                <View style={{ paddingTop: 50 }} >
                  <Text style={{ textAlign: "center", alignContent: "center" }} >
                    Không có dữ liệu chấm công
                  </Text>
                </View>
              }
            </View>}
          />

          <Tab.Screen
            name="Chấm công vân tay"
            // tabStyle={{ backgroundColor: 'white', textAlign: 'center'  }}
            // textStyle={{ color: 'black', textAlign: 'center'  }}
            // activeTabStyle={{ backgroundColor: 'white', textAlign: 'center'  }}
            // activeTextStyle={{ color: 'black', fontWeight: 'normal' , textAlign: 'center' }}
            // style={styles.tabs}
              component={()=> <View>
              <Text style={styles.date}>{weekday}{time}</Text>
              {fingerTk && fingerTk.map((e, index) => {
                return (
                  <View key={index} >
                    {e.in &&
                      <View style={styles.outIn}>
                        <Text style={styles.text}>Chấm công vào:</Text>
                        <Text style={styles.timeInFinger}>{e.in}</Text>
                      </View>}
                  </View>
                )
              })}
              <View style={styles.viewCheckIn}></View>
              {fingerTk && fingerTk.length > 0 ? fingerTk.map((e, index) => {
                return (
                  <View key={index} >
                    {e.out &&
                      <View style={styles.outIn}>
                        <Text style={styles.text}>Chấm công ra:</Text>
                        <Text style={styles.timeOutFinger}>{e.out}</Text>
                      </View>}
                  </View>
                )
              }) :
                <View style={{ paddingTop: 50 }} >
                  <Text style={{ textAlign: "center", alignContent: "center" }} >
                    Không có dữ liệu chấm công
                  </Text>
                </View>}
            </View>}
         />
          
        </Tab.Navigator>

      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 5,
    marginBottom: 6,
    borderRadius: 15,
  },
  tabs: {
    backgroundColor: 'white',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  tab: {
    borderRadius: 15,
    backgroundColor: '#fff',
  },
  textHeader: {
    fontSize: 11,
    color: '#000',
  },
  date: {
    textAlign: 'center',
    marginVertical: 5,
  },
  viewCheckIn: {
    borderBottomColor: '#b9b9b9',
    borderBottomWidth: 1,
    marginHorizontal: 20,
  },
  outIn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3
  },
  text: {
    color: '#000',
    marginLeft: 20,
  },
  timeIn: {
    marginRight: 20,
    backgroundColor: '#66ff33',
    borderRadius: 16,
    paddingHorizontal: 10
  },

  timeOut: {
    marginRight: 20,
    backgroundColor: '#ff6666',
    borderRadius: 16,
    paddingHorizontal: 10
  },
  timeInFinger: {
    marginRight: 20,
    backgroundColor: '#66ff33',
    borderRadius: 16,
    paddingHorizontal: 10
  },

  timeOutFinger: {
    marginRight: 20,
    backgroundColor: '#ff6666',
    borderRadius: 16,
    paddingHorizontal: 10
  },


});
