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
import makeSelectOrgReport from './selectors';
import reducer from './reducer';
import saga from './saga';
import styles from './styles';
import makeSelectGlobal from '../App/selectors';
import BackHeader from '../../components/Header/BackHeader';
import moment from 'moment';
import { getReportByOrg } from '../../api/hrmEmployee';
import PieChartOrg from '../../components/CustomChart/PieChartOrg';
import LoadingButton from '../../components/LoadingButton';
import DepartmentSelect from '../../components/CustomMultiSelect/DepartmentSelect';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import _ from 'lodash'

const DATE = 'YYYY-MM-DD'
const DATE_FORMAT = 'DD/MM/YYYY'

const OrgReport = (props) => {
    useInjectReducer({ key: 'timeKeepingReportPage', reducer });
    useInjectSaga({ key: 'timeKeepingReportPage', saga });

    const { navigation, organizationUnitId, taskConfig, } = props;

    const [date, setDate] = useState(new Date());
    const [oneDate, setOneDate] = useState();
    const [show, setShow] = useState(false);

    const [selectedOrg, setSelectedOrg] = useState(organizationUnitId ? [organizationUnitId] : []);

    const [query, setQuery] = useState({});
    const [loading, setLoading] = useState();

    const [startDate, setStartDate] = useState(moment().subtract(30, 'days'));
    const [endDate, setEndDate] = useState(moment());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [dataOrg, setDataOrg] = useState([]);

    const randomRgb = () => {
        const red = Math.floor((Math.random() * 256));
        const green = Math.floor((Math.random() * 256));
        const blue = Math.floor((Math.random() * 256));

        return `rgb(${red}, ${green}, ${blue})`;
    };

    const handleChangeOrg = (org) => {
        const result = org.map(e => e._id)
        setSelectedOrg(result)
    };

    const showPicker = useCallback((value) => setShow(value), []);

    const onValueChange = useCallback(
        (newDate) => {
            try {
                const selectedDate = newDate || date;

                showPicker(false);
                setDate(selectedDate);

                console.log(moment(selectedDate).format('YYYY-MM-DD'))
                setOneDate(moment(selectedDate).format('YYYY-MM-DD'))

            } catch (error) {
                console.log(error)
            }
        },
        [date, showPicker],
    );

    const onReport = async () => {
        setLoading(true)
        try {
            const newQuery = {
                oneDate: `${moment(oneDate).format(DATE)}`,
            }

            if (selectedOrg.length) newQuery.organizationUnitId = selectedOrg[0]

            const res = await getReportByOrg(newQuery)
            if (res) {
                setDataOrg([...(res.data).map((value) => Object.assign(value, { "svg": { "fill": randomRgb() } }))])
            }

        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }

    return (
        <Container>
            <BackHeader
                title="Báo cáo số lượng nhân sự theo phòng ban"
                navigation={navigation}
            />
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <ListItem onPress={() => setShowDatePicker(true)}>
                    <Body>
                        <Item style={{ alignSelf: 'flex-end', color: "black", fontSize: 16 }}>
                            <DateTimePicker
                                mode="date"
                                onSave={(e) => onValueChange(e)}
                                value={moment(date).format(DATE_FORMAT)}
                            />
                        </Item>

                    </Body>
                </ListItem>
                <ListItem>
                    <DepartmentSelect
                        single
                        handleSelectObjectItems={handleChangeOrg}
                        selectedItems={selectedOrg}
                        onRemoveSelectedItem={() => setSelectedOrg([])}
                        emptyText='Tất cả phòng ban'
                    />
                </ListItem>

                <View padder style={{ flexDirection: 'row' }}>
                    <LoadingButton isBusy={loading} block onPress={onReport} style={{ borderRadius: 10, flex: 1 }}>
                        <Text>Xem báo cáo</Text>
                    </LoadingButton>
                </View>
            </View >

            <Content style={styles.content}>{<PieChartOrg data={dataOrg} />}</Content>
        </Container>
    );
};


const mapStateToProps = createStructuredSelector({
    timeKeepingReportPage: makeSelectOrgReport(),
    global: makeSelectGlobal(),
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect, memo)(OrgReport);
