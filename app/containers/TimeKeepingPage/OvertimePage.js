import React, { useEffect, useState } from 'react';
import { Container, View, Text, Body, ListItem, List, Right, Icon, Content } from 'native-base';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { API_OVERTIME } from '../../configs/Paths';
import ListPage from '../../components/ListPage';
import makeSelectTimeKeepingPage from './selectors';
import BackHeader from '../../components/Header/BackHeader';
import { navigate } from '../../RootNavigation';
import moment from "moment";

export function OvertimePage(props) {
    useInjectReducer({ key: 'timeKeepingPage', reducer });
    useInjectSaga({ key: 'timeKeepingPage', saga });
    const { navigation } = props


    return (
        <Container>
            <BackHeader title="Quản lý thời gian OT" navigation={navigation} />
            <ListPage
                query={{
                    sort: '-updatedAt',
                    filter: {
                        month: moment(new Date()).format("MM"),
                        year: moment(new Date()).format("YYYY"),
                    }
                }}
                api={API_OVERTIME}
                itemComponent={({ item }) => {
                    const { month, year, timeStart, timeEnd, hrmEmployeeId, organizationUnit } = item
                    return <ListItem onPress={() => navigate('AddOvertimePage', { item })}>
                        <Body>
                            <Text>Thời gian OT tháng {month} năm {year}</Text>
                            {timeStart ? <Text note>{`Thời gian bắt đầu: ${timeStart}`}</Text> : null}
                            {timeEnd ? <Text note>{`Thời gian kết thúc: ${timeEnd}`}</Text> : null}
                            {organizationUnit ? <Text note>{`Phòng ban: ${organizationUnit.name}`}</Text> : null}
                            {hrmEmployeeId ? <Text note>{`Nhân viên: ${hrmEmployeeId.name}`}</Text> : null}
                        </Body>
                        <Right>
                            <Icon name="chevron-right" type="Entypo" />
                        </Right>
                    </ListItem>
                }}
            />
            <FabLayout>
                <Icon type="Entypo" name="plus" style={{ color: '#fff' }} onPress={() => navigate('AddOvertimePage')} />
            </FabLayout>
        </Container>
    );
}

const mapStateToProps = createStructuredSelector({
    timeKeepingPage: makeSelectTimeKeepingPage(),
});

function mapDispatchToProps(dispatch) {
    return {

    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(OvertimePage);
