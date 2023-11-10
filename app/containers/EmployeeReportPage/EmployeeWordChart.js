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
import { getReportByEmployeeAge, getReportByEmployeeWord } from '../../api/hrmEmployee';
import FilterBox from '../../components/CustomFilter/FilterBox';
import _, { parseInt } from 'lodash'
import PieChartScreen from '../../components/CustomChartWrapper/PieChartScreen';
import moment from 'moment';
import StackedBarChartScreen from '../../components/CustomChartWrapper/GroupBarChartScreen';
import { processColor } from 'react-native';


const DATE = 'YYYY-MM-DD'
const EmployeeWordChart = (props) => {
    useInjectReducer({ key: 'timeKeepingReportPage', reducer });
    useInjectSaga({ key: 'timeKeepingReportPage', saga });

    const { navigation, departments } = props;

    const [loading, setLoading] = useState();
    const [data, setData] = useState();
    const ARR = ['Nhân Viên Nghỉ', 'Nhân Viên Mới']

    const onReport = async (query) => {


        setLoading(true)
        try {
            const { startDate, organizationUnitId, endDate } = query
            const newQuery = {}
            if (startDate) newQuery.startDate = moment(startDate, 'YYYY-MM-DD').format('YYYY-MM-DD')
            if (endDate) newQuery.endDate = moment(endDate, 'YYYY-MM-DD').format('YYYY-MM-DD')

            if (organizationUnitId) newQuery.organizationUnitId = organizationUnitId

            const res = await getReportByEmployeeWord(newQuery)
            if (res) {
                const ids = organizationUnitId
                    ? [organizationUnitId]
                    : departments.filter(e => !e.parent).map(e => e._id)


                let arr = []
                let obj = {}
                for (let year = moment(startDate, 'YYYY-MM-DD').year(); year <= moment(endDate, 'YYYY-MM-DD').year(); year++) {
                    for (let month = moment(startDate, 'YYYY-MM-DD').month() + 1; month <= moment(endDate, 'YYYY-MM-DD').month() + 1 || year < moment(endDate, 'YYYY-MM-DD').year() && month <= 12; month++) {
                        let key = `${year}-${`${month}`.length === 2 ? month : `0${month}`}`
                        arr.push(key)
                        obj[key] = { new: 0, old: 0 }
                    }
                }

                res.forEach(e => {
                    if (ids.includes(e._id)) {
                        const { filterDataBeginWork, filterDataEndWork } = e
                        Object.keys(filterDataBeginWork).map(k => {
                            if (k.length === 7 && obj[k] && _.isNumber(obj[k].new)) obj[k].new += filterDataBeginWork[k]
                        })

                        Object.keys(filterDataEndWork).map(k => {
                            if (k.length === 7 && obj[k] && _.isNumber(obj[k].old)) obj[k].old += filterDataEndWork[k]
                        })
                    }
                })


                const newObject = {

                    legend: {
                        enabled: true,
                        textSize: 14,
                        form: "SQUARE",
                        formSize: 14,
                        xEntrySpace: 1,
                        yEntrySpace: 1,
                        wordWrapEnabled: true
                    },
                    data: {
                        dataSets: [{
                            values: Object.keys(obj).map((e) => obj[e].new),
                            label: 'Nhân viên mới',
                            config: {
                                drawValues: false,
                                colors: [processColor('green')],
                            }
                        }, {
                            values: Object.keys(obj).map((e) => obj[e].old),
                            label: 'Nhân viên cũ',
                            config: {
                                drawValues: false,
                                colors: [processColor('red')],
                            }
                        }],
                        config: {
                            barWidth: 0.2,
                            group: {
                                fromX: 0,
                                groupSpace: 0.1,
                                barSpace: 0.1,
                            },
                        }
                    },
                    xAxis: {
                        valueFormatter: arr,
                        granularityEnabled: true,
                        granularity: 1,
                        axisMaximum: arr.length,
                        axisMinimum: 0,
                        centerAxisLabels: true
                    },

                    marker: {
                        enabled: true,
                        markerColor: processColor('#F0C0FF8C'),
                        textColor: processColor('white'),
                        markerFontSize: 14,
                    },

                }
                setData(newObject)
            }

        } catch (err) {
            console.log('err', err)
        }
        setLoading(false)
    }

    return (
        <Container>
            <BackHeader
                title="Báo cáo theo ngày làm việc"
                navigation={navigation}
            />
            <Content style={styles.content}>
                <FilterBox
                    enableFilterOrg
                    onSave={onReport}
                    enableDatePicker
                    startDate={'2022-01-01'}
                    endDate={moment().endOf('month').format(DATE)}
                />
                <View style={{ height: 400 }}>
                    <StackedBarChartScreen data={data} description='Báo cáo theo ngày làm việc' />
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

export default compose(withConnect, memo)(EmployeeWordChart);
