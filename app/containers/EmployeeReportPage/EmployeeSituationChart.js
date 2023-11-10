import React, { memo, useState, useCallback, useEffect } from 'react';
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
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectEmployeeAgeChart from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import makeSelectGlobal, { makeSelectDepartmentsByLevel } from '../App/selectors';
import BackHeader from '../../components/Header/BackHeader';
import { getReportSituation, getReportPeopleCheckin } from '../../api/hrmEmployee';
import _ from 'lodash'
import PieChartScreen from '../../components/CustomChartWrapper/PieChartScreen';
import CustomMonthYearPicker from "../../components/CustomMonthYearPicker";
import LoadingButton from '../../components/LoadingButton';
import LoadingLayout from '../../components/LoadingLayout';
import moment from "moment";

const EmployeeSituationChart = (props) => {
    useInjectReducer({ key: 'timeKeepingReportPage', reducer });
    useInjectSaga({ key: 'timeKeepingReportPage', saga });

    const { navigation } = props;

    const [loading, setLoading] = useState();
    const [data, setData] = useState();
    const [date, setDate] = useState(new Date());
    const [localData, setLocalData] = useState({ year: moment(new Date()).year(), month: (moment(new Date()).month() + 1) })
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    console.log('~ isLoading', isLoading)

    useEffect(() => {
        onReport({
            month: localData.month,
            year: localData.year,
        });
      }, []);

    const onReport = async (query) => {
        let arrayKey = []
        const count = (data) => {
            const result = {}
            arrayKey.forEach(key => {
                return result[key] = 0
            })
            Object.keys(data).forEach(key => {
                result[key] = data[key]
            })
            return result
        }

        setLoading(true)
        try {
            const { month, year } = query
            const res = await getReportSituation()
            const res1 = await getReportPeopleCheckin()
            if (res) {
                if (res && Array.isArray(res) && res.length) {
                    const lsData = Object.keys(res[0])
                    lsData.map((e) => {
                        if (e !== "month" && e !== "year") {
                            arrayKey.unshift(e)
                            
                        }
                    })
                    arrayKey.unshift('Nhân viên vắng mặt', 'Nhân viên đi muộn')
                }
                const all = { 'Nhân viên vắng mặt': res1.hrmLeave, 'Nhân viên đi muộn': res1.hrmLate }
                res.forEach(e => {
                    if ((e.month == month) && (e.year == year)) {
                        Object.keys(e).forEach(key => all[key] = (all[key] || 0) + e[key])
                    }
                })
                const allCol = count(all)
                const COLORS = ['#dc67ab', '#dc67ce', '#c767dc', '#a367dc', '#8067dc', '#6771dc', '#6794dc', '#67b7dc']
                const data = arrayKey.map((label, index) => ({
                    label,
                    value: allCol[label],
                    color: COLORS[index]
                }));
                setData(data)
                setIsLoading(false)
            }
        } catch (error) {
            console.log('error', error)
        }
        setLoading(false)
    }

    const handleSave = () => {
        onReport({
            month: localData.month,
            year: localData.year,
        });

    };

    const showPicker = useCallback((value) => setShow(value), []);

    const onValueChange = useCallback(
        (event, newDate) => {
            try {
                const selectedDate = newDate || date;
                showPicker(false);
                setDate(selectedDate);
            } catch (error) {
                console.log(error)
            }
        },
        [date, showPicker],
    );


    return (
        <Container>
            <BackHeader
                title="Báo cáo tình hình nhân sự"
                navigation={navigation}
            />
            <Content style={{ backgroundColor: '#fff' }}>
                {/* <Item style={{ height: 55 }}>
                    <CustomMonthYearPicker value={date} onChange={(year, month) => setLocalData({ ...localData, year: year, month: month })} />
                </Item> */}
                {/* <View padder style={{ flexDirection: 'row' }}>
                    <LoadingButton isBusy={loading} block onPress={handleSave} style={{ borderRadius: 10, flex: 1 }}>
                        <Text>Xem báo cáo</Text>
                    </LoadingButton>
                </View> */}
                <LoadingLayout isLoading={isLoading} />
                <View style={{ height: 400, marginBottom: 80 }}>
                    <PieChartScreen data={data} description=' ' />
                </View>
            </Content>
        </Container>
    );
};


const mapStateToProps = createStructuredSelector({
    timeKeepingReportPage: makeSelectEmployeeAgeChart(),
    global: makeSelectGlobal(),
    departments: makeSelectDepartmentsByLevel(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect, memo)(EmployeeSituationChart);
