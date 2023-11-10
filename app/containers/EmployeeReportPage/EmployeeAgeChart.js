import React, { memo, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
    Content,
    Text,
    Body,
    Container,
    View,
    Label,
    ListItem,
    Item,
} from 'native-base';
import { convertLabel } from '../../utils/common';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectEmployeeAgeChart from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import makeSelectGlobal, { makeSelectDepartmentsByLevel } from '../App/selectors';
import BackHeader from '../../components/Header/BackHeader';
import { getReportByEmployeeAge } from '../../api/hrmEmployee';
import FilterBox from '../../components/CustomFilter/FilterBox';
import _ from 'lodash'
import PieChartScreen from '../../components/CustomChartWrapper/PieChartScreen';
import moment from 'moment';

const ARR = ['< 20', '20 - 30', '30 - 40', '40 - 50', '> 50', 'Khác']

const EmployeeAgeChart = (props) => {
    useInjectReducer({ key: 'timeKeepingReportPage', reducer });
    useInjectSaga({ key: 'timeKeepingReportPage', saga });

    const { navigation, departments } = props;

    const [loading, setLoading] = useState();
    const [data, setData] = useState();

    const onReport = async (query) => {
        const count = (data) => {
            const result = {}
            ARR.forEach(key => result[key] = 0)

            Object.keys(data).forEach(key => {
                if (!Number.isInteger(Number(key))) result['Khác']++
                else if (key < 20) result['< 20']++
                else if (key >= 20 && key < 30) result['20 - 30']++
                else if (key >= 30 && key < 40) result['30 - 40']++
                else if (key >= 40 && key < 50) result['40 - 50']++
                else if (key >= 40 && key < 50) result['> 50']++
            })
            return result
        }

        setLoading(true)
        try {
            const { day, organizationUnitId } = query
            const newQuery = {}

            if (day) newQuery.oneDate = moment(day, 'DD/MM/YYYY').format('YYYY-MM-DD')
            if (organizationUnitId) newQuery.organizationUnitId = organizationUnitId
            const res = await getReportByEmployeeAge(newQuery)
            if (res) {

                const ids = organizationUnitId
                    ? [organizationUnitId]
                    : departments.filter(e => !e.parent).map(e => e._id)

                const all = {}, female = {}, male = {}

                res.forEach(e => {
                    if (ids.includes(e._id)) {
                        const { resultFemale, resultMale, result } = e
                        Object.keys(resultFemale).forEach(key => female[key] = (female[key] || 0) + resultFemale[key])
                        Object.keys(resultMale).forEach(key => male[key] = (male[key] || 0) + resultMale[key])
                        Object.keys(result).forEach(key => all[key] = (all[key] || 0) + result[key])
                    }
                })

                const allCol = count(all)
                const maleCol = count(male)
                const femaleCol = count(female)
                const COLORS = ['#C0FF8C', '#FFF78C', '#FFD08C', '#8CEAFF', '#FF8C9D', '#EEE']
                const data = ARR.map((label, index) => ({
                    label,
                    value: allCol[label],
                    color: COLORS[index]
                }));
                setData(data)
            }

        } catch (error) { }
        setLoading(false)
    }

    return (
        <Container>
            <BackHeader
                title="Báo cáo theo độ tuổi"
                navigation={navigation}
            />
            <Content style={styles.content}>
                <FilterBox
                    enableDayPicker
                    enableFilterOrg
                    onSave={onReport}
                />
                <View style={{ height: 400, marginBottom: 80 }}>
                    <PieChartScreen data={data} description=' ' />
                </View>
            </Content>

            {/* <Content style={styles.content}>{<PieChart data={dataOrg} />}</Content> */}
            {/* <Content style={styles.content}>
                {dataTotal && <BarChart data={dataTotal} />}
            </Content> */}
        </Container>
    );
};


const mapStateToProps = createStructuredSelector({
    timeKeepingReportPage: makeSelectEmployeeAgeChart(),
    global: makeSelectGlobal(),
    departments: makeSelectDepartmentsByLevel(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect, memo)(EmployeeAgeChart);
