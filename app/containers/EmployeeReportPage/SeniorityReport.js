import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
    Container,
    Content,
    View
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import { getReportSeniority } from '../../api/hrmEmployee';
import PieChartScreen from '../../components/CustomChartWrapper/PieChartScreen';
import FilterBox from '../../components/CustomFilter/FilterBox';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal from '../App/selectors';
import reducer from './reducer';
import saga from './saga';
import makeSelectSeniorityReport from './selectors';


const DATE = 'YYYY-MM-DD'

const SeniorityReport = (props) => {
    useInjectReducer({ key: 'timeKeepingReportPage', reducer });
    useInjectSaga({ key: 'timeKeepingReportPage', saga });

    const { navigation } = props;

    const [loading, setLoading] = useState()
    const [data, setData] = useState()

    const onReport = async (query) => {
        setLoading(true)
        try {
            const newQuery = {
                beginWorkStartDate: query.startDate,
                beginWorkEndDate: query.endDate,
            }
            if (query.organizationUnitId) newQuery.department = organizationUnitId

            const res = await getReportSeniority(newQuery)
            console.log('res', res)
            if (res) {

                const newObject = [{

                    label: 'Dưới 1 tháng',
                    value: res.Total1T,
                    color: '#C0FF8C'
                    ,

                    label: 'Từ 1 đến 3 tháng',
                    value: res.Total1_3T,
                    color: '#FFF78C'
                    ,

                    label: 'Từ 3 đến 6 tháng',
                    value: res.Total3_6T,
                    color: '#FFD08C'
                    ,

                    label: 'Từ 6 đến 12 tháng',
                    value: res.Total6_12T,
                    color: '#8CEAFF'
                    ,

                    label: 'Hơn 12 tháng',
                    value: res.Total12T,
                    color: '#FF8C9D'

                }]

                setData(newObject)
            }
        } catch (error) {
            console.log('error', error)
        }
        setLoading(false)
    }

    return (
        <Container>
            <BackHeader
                title="Báo cáo theo thâm niên"
                navigation={navigation}
            />
            <Content>
                <FilterBox
                    // enableFilterOrg
                    enableDayPicker
                    enableFilterOrg
                    onSave={onReport}
                    loading={loading}
                />
                <View style={{ height: 400 }}>
                    <PieChartScreen data={data} description='Báo cáo theo thâm niên' />
                </View>
            </Content>
        </Container>
    );
};


const mapStateToProps = createStructuredSelector({
    timeKeepingReportPage: makeSelectSeniorityReport(),
    global: makeSelectGlobal(),
});

function mapDispatchToProps(dispatch) {
    return {
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(SeniorityReport);











