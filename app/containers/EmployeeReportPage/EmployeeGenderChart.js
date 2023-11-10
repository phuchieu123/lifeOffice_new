import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import DateRangePicker from '../../components/DateRangePicker';

import {
  Container,
  Icon,
  View
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import reducer from './reducer';
import saga from './saga';
import makeSelectEmployeeFillterDepartment from './selectors';

import PieChart from '../../components/CustomChart/PieChart';
import _ from 'lodash';
import moment from 'moment';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal from '../App/selectors';
import { getHrmEmplyeReportHrmCount } from './actions';
const EmployeeGenderChart = (props) => {
  useInjectReducer({ key: 'employeeReportPage', reducer });
  useInjectSaga({ key: 'employeeReportPage', saga });

  const { navigation, employeeReportPageData, getEmployeeReportSkill } = props;
  const { employFeillterDepartment, fillterDepartment } = employeeReportPageData;

  const [query, setQuery] = useState({});

  const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fillterFemale, setFillterFemale] = useState([])
  const [fillterMale, setFillterMale] = useState([])
  const [localData, setLocalData] = useState({})
  const [fillterChartFemale, setFillterChartFemale] = useState()
  const [fillterChartMale, setFillterChartMale] = useState()




  const pieData = [{
    amount: fillterChartMale,
    svg: { fill: '#67b7dc' },
    title: 'Nhân viên nam',
  }, {
    amount: fillterChartFemale, svg: { fill: '#6794dc' },
    title: 'Nhân viên Nữ',
  }]

  useEffect(() => {
    if (fillterDepartment) {
      setLocalData({ ...fillterDepartment })
    } else setLocalData({})
  }, [fillterDepartment])


  useEffect(() => {

    if (_.has(localData, 'data')) {
      const fillterFemaleAll = localData.data.map((value) => {
        return value.totalFemale
      })
      setFillterFemale(fillterFemaleAll)
      const fillterMaleAll = localData.data.map((value) => {
        return value.totalMale
      })
      setFillterMale(fillterMaleAll)
    }

  }, [_.has(localData, 'data')])

  useEffect(() => {

    if (fillterFemale !== null || fillterFemale !== 'undefined') {

      const sumFillterFemaleAll = fillterFemale.reduce((value, total) => {
        return value + total
      }, 0)
      setFillterChartFemale(sumFillterFemaleAll)
    }


    if (fillterMale !== null || fillterMale !== 'undefined') {

      const sumFillterMaleAll = fillterMale.reduce((value, total) => {
        return value + total
      }, 0)
      setFillterChartMale(sumFillterMaleAll)
    }




  }, [fillterFemale])
  useEffect(() => {
    updateQuery(query);
  }, []);

  useEffect(() => {
    getEmployeeReportSkill(query);
  }, [query]);

  const updateQuery = () => {
    const newQuery = {
      ...query,
      filter: {
        createdAt: {
          $gte: `${startDate.format()}`,
          $lte: `${endDate.endOf('day').format()}`,
        },
      },
    };
    setQuery(newQuery);
  };

  const handleSetDateRange = (start, end) => {
    setShowDatePicker(false);
    setStartDate(moment(start));
    setEndDate(moment(end));
    updateQuery();
  };


  return (
    <Container>
      <BackHeader
        title="Theo giới tính"
        navigation={navigation}
        rightStyle={{ flex: 0.3 }}
        rightHeader={
          <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff', marginHorizontal: 10 }} />
        }
      />
      <>
        <View style={{ height: '100%', marginTop: 30 }}>
          <PieChart style={{ height: 200, }} data={pieData} />
        </View>
      </>

      <DateRangePicker
        initialRange={[startDate.toDate(), endDate.toDate()]}
        handleCancel={() => setShowDatePicker(false)}
        onSetDateRange={handleSetDateRange}
        showDatePicker={showDatePicker}
      />
    </Container>
  );
};

const mapStateToProps = createStructuredSelector({
  employeeReportPageData: makeSelectEmployeeFillterDepartment(),
  global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
  return {
    getEmployeeReportSkill: (query) => dispatch(getHrmEmplyeReportHrmCount(query)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(EmployeeGenderChart);
