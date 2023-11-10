import React, { memo, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import moment from 'moment';
import {
    Container,
    Content,
    View
} from 'native-base';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import { getReportPostion } from '../../api/hrmEmployee';
import PieChartScreen from '../../components/CustomChartWrapper/PieChartScreen';
import FilterBox from '../../components/CustomFilter/FilterBox';
import BackHeader from '../../components/Header/BackHeader';
import makeSelectGlobal, { makeSelectDepartmentsByLevel } from '../App/selectors';
import reducer from './reducer';
import saga from './saga';
import makeSelectSeniorityReport from './selectors';


const DATE = 'YYYY-MM-DD'

const EmployeePositionChart = (props) => {
    useInjectReducer({ key: 'timeKeepingReportPage', reducer });
    useInjectSaga({ key: 'timeKeepingReportPage', saga });

    const { navigation, departments } = props;
    const [loading, setLoading] = useState()
    const [data, setData] = useState()
    function getRandColor(brightness) {

        // Six levels of brightness from 0 to 5, 0 being the darkest
        var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
        var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
        var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) { return Math.round(x / 2.0) })
        return "rgb(" + mixedrgb.join(",") + ")";
    }
    const onReport = async (query) => {

        setLoading(true)
        try {
            const { day, organizationUnitId } = query
            const newQuery = {}
            if (day) newQuery.oneDate = moment(day, 'DD/MM/YYYY').format('YYYY-MM-DD')
            if (query.organizationUnitId) newQuery.department = organizationUnitId

            const res = await getReportPostion(newQuery)
            const ArrColor = []
            if (res) {
                let newObject = []
                const value = res.map((value) => {
                    newObject = {
                        label: value.data ? value.data.position.title : 'Không có phòng ban',
                        value: value.filterTotal12,
                        color: getRandColor(5),

                    }
                    console.log('newObject', newObject)
                    return newObject
                })
                setData(value)


            }
        } catch (error) {
            console.log('error', error)
        }
        setLoading(false)
    }

    return (
        <Container>
            <BackHeader
                title="Báo cáo theo chức vụ"
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
                <View style={{ height: 500, marginBottom: 80, }}>
                    <PieChartScreen data={data} description='Báo cáo theo chức vụ' />
                </View>
            </Content>
        </Container>
    );
};


const mapStateToProps = createStructuredSelector({
    timeKeepingReportPage: makeSelectSeniorityReport(),
    global: makeSelectGlobal(),
    departments: makeSelectDepartmentsByLevel(),
});

function mapDispatchToProps(dispatch) {
    return {
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(EmployeePositionChart);











