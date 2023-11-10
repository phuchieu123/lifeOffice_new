import React, { useEffect, memo, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Content, Container } from 'native-base';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectRecCostReport from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import { getEmployeeReportAge } from './actions';
import makeSelectGlobal from '../App/selectors';
import BackHeader from '../../components/Header/BackHeader';
import moment from 'moment';
import FilterBox from '../../components/CustomFilter/FilterBox';
import { getReportByRecruitmentCost } from '../../api/hrmEmployee';
import BarChart from '../../components/CustomChart/BarChart';

const DATE = 'YYYY-MM-DD'

const RecCostReport = (props) => {
    useInjectReducer({ key: 'timeKeepingReportPage', reducer });
    useInjectSaga({ key: 'timeKeepingReportPage', saga });

    const { navigation } = props;

    const [query, setQuery] = useState({});
    const [loading, setLoading] = useState();

    const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
    const [endDate, setEndDate] = useState(moment());

    const [dataWage, setDataWage] = useState();

    const onReport = async (query) => {
        setLoading(true)
        try {
            const newQuery = {
                beginWorkStartDate: query.startDate,
                beginWorkEndDate: query.endDate,
            }

            const res = await getReportByRecruitmentCost(newQuery)
            if (res) {
                const dataWage = [...(res.data.map(item => item.wage))]

                const data1 = dataWage.map((value) => ({ value }));
                const xData = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'].map((value) => ({ value }));
                const yData = [0, 500, 1000, 1500];
                const barData = [
                    {
                        data: data1,
                        svg: {
                            fill: 'green',
                        },
                    },
                ];
                const legendData = [
                    {
                        title: 'Tổng chi phí dự toán theo nhu cầu tuyển dụng',
                        color: 'green',
                    },
                ];

                const recCostReportData = { xData, yData, barData, legendData }

                setDataWage(recCostReportData)
            }

        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }


    useEffect(() => {
        updateQuery(query);
    }, []);

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

    return (
        <Container>
            <BackHeader
                title="Báo cáo chi phí tuyển dụng"
                navigation={navigation}
            />
            <FilterBox
                enableFilterOrg
                enableDatePicker
                startDate={moment().startOf('month').format(DATE)}
                endDate={moment().endOf('month').format(DATE)}
                onSave={onReport}
                loading={loading}
            />
            <Content style={styles.content}>
                {dataWage && <BarChart data={dataWage} />}
            </Content>
        </Container>
    );
};


const mapStateToProps = createStructuredSelector({
    timeKeepingReportPage: makeSelectRecCostReport(),
    global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
    return {
        getEmployeeReportAge: (query) => dispatch(getEmployeeReportAge(query)),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(RecCostReport);
