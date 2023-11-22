import React, { memo } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { View, Text , TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/Entypo';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal from '../App/selectors';
import reducer from './reducer';
import saga from './saga';
import makeSelectTimeKeepingReportPage from './selectors';
import styles from './styles';

const TimeKeepingReportPage = (props) => {
  useInjectReducer({ key: 'timeKeepingReportPage', reducer });
  useInjectSaga({ key: 'timeKeepingReportPage', saga });

  const { navigation } = props;

  return (
    <View>
      <BackHeader title="Báo cáo chấm công" navigation={navigation} />
      <View style={styles.content}>
        <View style={styles.content}>
          <View>
            <TouchableOpacity style={{padding: 10, backgroundColor: "rgba(46, 149, 46, 1)", borderRadius: 10, flexDirection: 'row', justifyContent:'space-between',margin: 5, alignItems:'center'}} onPress={() => navigation.navigate('TimeKeepingChart')}>
              <View>
                <Text style={{color: '#fff'}} >Báo cáo nhân sự</Text>
              </View>
              <View>
                <Icon color='#fff' name="chevron-right" type="Entypo" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 10, backgroundColor: "rgba(46, 149, 46, 1)", borderRadius: 10, flexDirection: 'row', justifyContent:'space-between',margin: 5,alignItems:'center'}} onPress={() => navigation.navigate('EquipmentChart')}>
              <View>
                <Text style={{color: '#fff'}}>Thiết bị</Text>
              </View>
              <View>
                <Icon  color='#fff' name="chevron-right" type="Entypo" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 10, backgroundColor: "rgba(46, 149, 46, 1)", borderRadius: 10, flexDirection: 'row', justifyContent:'space-between',margin: 5,alignItems:'center'}} onPress={() => navigation.navigate('LateEarlyChart')}>
              <View>
                <Text style={{color: '#fff'}}>Chấm công trễ sớm</Text>
              </View>
              <View>
                <Icon  color='#fff' name="chevron-right" type="Entypo" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{padding: 10, backgroundColor: "rgba(46, 149, 46, 1)", borderRadius: 10, flexDirection: 'row', justifyContent:'space-between',margin: 5,alignItems:'center'}} onPress={() => navigation.navigate('NoTimeKeepingChart')}>
              <View>
                <Text style={{color: '#fff'}}>Không chấm công</Text>
              </View>
              <View>
                <Icon  color='#fff' name="chevron-right" type="Entypo" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};


const mapStateToProps = createStructuredSelector({
  timeKeepingReportPage: makeSelectTimeKeepingReportPage(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {};
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(TimeKeepingReportPage);
