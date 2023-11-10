import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import moment from 'moment';
import {
    Container,
    Icon
} from 'native-base';
import { getHrmEmplyReportSinged } from '../../api/hrmChart';
import BackHeader from '../../components/Header/BackHeader';

const EmployeeSeniorityChart = (props) => {


    const { navigation } = props;


    const [query, setQuery] = useState({});

    const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
    const [endDate, setEndDate] = useState(moment());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const getData = async () => {
        const result = await getHrmEmplyReportSinged()
        console.log('result', result)
    }
    useEffect(() => {
        getData()
    }, []);

    // useEffect(() => {
    //     getAbsentReport(query);
    // }, [query]);

    const updateQuery = () => {
        const newQuery = {
            ...query,

            sort: '-updatedAt',
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
                title="Báo cáo thống kê nhân sự theo thâm niên"
                navigation={navigation}
                rightStyle={{ flex: 0.3 }}
                rightHeader={
                    <Icon name="calendar" type="AntDesign" onPress={() => setShowDatePicker(true)} style={{ color: '#fff', marginHorizontal: 10 }} />
                }
            />
            {/* <Content style={styles.content}>{absentReportData && <BarChart data={absentReportData} />}</Content> */}

            {/* <DateRangePicker
                initialRange={[startDate.toDate(), endDate.toDate()]}
                handleCancel={() => setShowDatePicker(false)}
                onSetDateRange={handleSetDateRange}
                showDatePicker={showDatePicker}
            /> */}
        </Container>
    );
};


const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
    return {

    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(EmployeeSeniorityChart);
