import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Body, Container, Content, Icon, List, ListItem, Right, Text } from 'native-base';
import ListPage from '../../components/ListPage';
import CustomHeader from '../../components/Header';
import { API_HRM_WAGE } from '../../configs/Paths';
import { getFilterOr } from '../../utils/common'
import _, { replace } from 'lodash';
import { getData } from '../../utils/storage';
import { makeSelectProfile } from '../App/selectors';
import BackHeader from '../../components/Header/BackHeader';
import { getPayCheckById } from '../../api/timekeeping';
import LoadingLayout from '../../components/LoadingLayout';
import { getFormula } from '../../api/formula';
import { getAttributeFormulaById } from '../../api/attributeformula';
import { FlatList } from 'react-native';
import CustomeList from '../../components/ListPage/List';

function SalaryPageDetail(props) {

    const { navigation, route } = props;
    const { params } = route
    const { item } = params

    const loadData = async () => {
        const profile = await getData('profile')
        const [data, formulaArr] = await Promise.all([getPayCheckById(item._id), getAttributeFormulaById(item.formula._id)])
        if (data && formulaArr) {
            let result = data.find(e => _.get(e, 'hrmEmployeeId._id') === profile.hrmEmployeeId)
            if (result) {
                result.source = []
                const variable = Object.keys(result.dataSource)
                formulaArr.forEach(({ code, name, formula }) => {
                    let value = null
                    if (_.has(result, `dataSource.${code}`)) {
                        value = result.dataSource[code]
                    } else if (formula) {
                        let newFormula = formula
                        variable.forEach(key => newFormula = newFormula.replace(new RegExp(`\\\(\\\$${key}\\\)`, 'g'), result.dataSource[key]))
                        value = eval(newFormula)
                    }
                    if (value !== null) result.source.push({ code, name, value })
                })
                return result.source
            }
        }
    }

    return (
        <Container>
            <BackHeader title="Bảng lương" navigation={navigation} />
            <CustomeList
                uniqueKey='code'
                loadData={loadData}
                itemComponent={({ item }) => {
                    return <ListItem>
                        <Body>
                            <Text>{item.name}</Text>
                        </Body>
                        <Right>
                            <Text>{item.value}</Text>
                        </Right>
                    </ListItem>
                }}
            />
        </Container>
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
