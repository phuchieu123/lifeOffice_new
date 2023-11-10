import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Body, Container, Content, Icon, List, ListItem, Right, Text } from 'native-base';
import _ from 'lodash';
import { getData } from '../../utils/storage';
import { makeSelectProfile } from '../App/selectors';
import BackHeader from '../../components/Header/BackHeader';
import { getPayCheckById, confirmSalary } from '../../api/timekeeping';
import { getAttributeFormulaById } from '../../api/attributeformula';
import { FlatList, View } from 'react-native';
import LoadingButton from '../../components/LoadingButton';
import ToastCustom from "../../components/ToastCustom";
var FormulaParser = require('hot-formula-parser').Parser;
var parser = new FormulaParser();

function SalaryPageDetail(props) {

  const { navigation, route } = props;
  const { params } = route
  const { item } = params

  const [data, setData] = useState();
  const [formulaArr, setFormulaArr] = useState();
  const [title, setTitle] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (item) {
      const { month, year } = item
      setTitle(`Chi tiết phiếu lương tháng ${month} - ${year}`)
    }
  }, [item]);

  const loadData = async () => {
    const profile = await getData('profile')
    setProfile(profile)
    let data2;
    const [data1, formulaArr] = await Promise.all([getPayCheckById(item._id), getAttributeFormulaById(item.formula._id)])
    data1 ? data2 = data1.filter(item => { return item.hrmEmployeeId._id === profile.hrmEmployeeId }) : data2;
    data2 && setData(data2[0].dataSource);
    setFormulaArr(formulaArr)
  }

  function calAttributes(dataSource, attributes = []) {
    const results = {
      ...dataSource,
    };
    const formatCurrency = number => {
      const newNumber = number && Number(number);
      if (typeof newNumber === 'number') {
        return newNumber.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      }
      return number;
    };
    const newData = {};
    attributes.forEach(att => {
      if (!att.formula) {
        newData[att.code] = {
          name: att.name,
          value: results[att.code],
          code: att.code,
        };
      } else {
        let formula = att.formula;
        Object.keys(newData).map(it => {
          formula = formula.replace(`($${it})`, newData[it].value);            
        });

        // tim nhung code khong ton tai trong cong thuc tinh = 0
        const rex = /\(\$[\d\w\b]*\)/g;
        const arrFormula = formula.match(rex);
        if (Array.isArray(arrFormula) && arrFormula.length) {
          arrFormula.forEach(item => {
            formula = formula.replace(item, 0); 
          });
        }
        // tinh toan
        const result = parser.parse(`${formula}`);

        newData[att.code] = {
          name: att.name,
          value: result.result || 0,
          formula: att.formula,
          code: att.code,
        };
      }
    });
    Object.keys(newData).map(key => {
      newData[key].value = formatCurrency(newData[key].value);
    });

    return newData;
  }

  const dataSource = calAttributes(data, formulaArr)

  const onConfirm = async () => {
    try {
      const body = {
        month: item.month,
        year: item.year,
        hrmEmployeeId: profile.hrmEmployeeId,
        confirmed: true
      }
      const res = await confirmSalary(body)

      if (res.status === 1) {
        ToastCustom({ text: res.message, type: 'success' });
        navigation.goBack()
        // DeviceEventEmitter.emit('updateSalaryPage')
      } else {
        ToastCustom({ text: res.message, type: 'danger' });
      }

    } catch (err) {
      ToastCustom({ text: err, type: 'danger' });
      console.log('err', err)
    }
  }

  return (
    <Container>
      <BackHeader title={title} navigation={navigation} />
      {data ? <FlatList
        data={Object.values(dataSource)}
        renderItem={({ item }) => {
          return <ListItem>
            <Body>
              <Text>{item.name}</Text>
            </Body>
            <Right>
              <Text>{item.value}</Text>
            </Right>
          </ListItem>
        }}
        keyExtractor={item => item.code}
      /> : <Text style={{ textAlign: 'center', marginTop: 10 }} >Không có dữ liệu</Text>}
      {data ? <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <LoadingButton style={{ flex: 1, borderRadius: 10, marginLeft: 5}} handlePress={() => onConfirm()}>
          <Body style={{ flexDirection: 'row', flex: 1, justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, alignSelf: 'center', color: '#fff',}}>
              Xác nhận phiếu lương
            </Text>
          </Body>
        </LoadingButton>
      </View> : null}
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

export default compose(withConnect)(SalaryPageDetail);
