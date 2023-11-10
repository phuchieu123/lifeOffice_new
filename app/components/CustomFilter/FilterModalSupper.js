import React, { useEffect, useState } from 'react';
import { View, List, ListItem, Text, Icon, Button, Body, Right, Container } from 'native-base';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Modal from 'react-native-modal';
import { makeSelectKanbanTaskConfigs } from '../../containers/App/selectors';
import SingleAPISearch from 'components/CustomMultiSelect/SingleAPISearch';
import { API_USERS } from 'configs/Paths';
import { DateRangePicker } from '../DateRangePicker';
import moment from 'moment';
import DepartmentSelect from '../CustomMultiSelect/DepartmentSelect';
import Search from '../CustomMultiSelect/Search';
import { isEqual } from 'lodash'
import { BackHandler, Dimensions } from 'react-native';
import BackHeader from '../Header/BackHeader';

const DATE = 'YYYY-MM-DD'
const DATE_FORMAT = 'DD/MM/YYYY'

const FilterModalSupper = (props) => {
    const {
        isVisible,                              //
        enableDatePicker,         //
        onClose,
        navigation             // 
    } = props;

    const [start, setStart] = useState([]);
    const [end, setEnd] = useState([]);


    const [showDatePicker, setShowDatePicker] = useState(false);



    const handleOpenDatePicker = () => {
        setShowDatePicker(true)
    }



    const onSetDateRange = (s, e) => {
        setShowDatePicker(false)
        setStart(s)
        setEnd(e)
    }

    const handleSave = () => {
        onClose();
        onSave({
            organizationUnitId: selectedOrg.length ? selectedOrg[0] : null,
            employeeId: selectedEmp.length ? selectedEmp[0] : null,
            startDate: start,
            endDate: end,
            kanbanStatus: kanbanStatus.length ? kanbanStatus[0] : null,
        });
    };






    return (

        <Modal isVisible={isVisible} style={{ height: '100%' }}>
            <View style={{ backgroundColor: '#fff', left: '5%', height: '100%',}}>
                {/* <View style={{ paddingTop: 30, paddingBottom: 30, paddingLeft: 10 }}>
                    <Text style={{ color: '#333', fontSize: 17 }}>Bộ lọc nâng cao</Text>
                </View> */}
                <BackHeader navigation={navigation} title="Bộ lọc nâng cao" />
                <List>
                    {/* {enableDatePicker && <View>
                        <ListItem itemHeader itemDivider style={{ borderRadius: 10 }}>
                            <Text>Thời gian</Text>
                        </ListItem>
                        <ListItem onPress={handleOpenDatePicker}>
                            <Body style={{ alignItems: "flex-end", flex: 1 }}>
                                <Text>{`${moment(start, DATE).format(DATE_FORMAT)} - ${moment(end, DATE).format(DATE_FORMAT)}   `}<Icon type="FontAwesome" name="caret-down" color="red" style={{ fontSize: 16, color: '#000' }} /></Text>
                            </Body>
                        </ListItem>
                    </View>} */}







                </List>
                <View padder style={{ flexDirection: 'row', marginTop: 60, justifyContent: 'flex-end', top: 430 }}>
                    <Button block onPress={handleSave} style={{ marginRight: 8, flex: 0.3 }}>
                        <Icon name="check" type="Feather" />
                    </Button>
                    <Button block onPress={onClose} full style={{ flex: 0.3 }} warning>
                        <Icon name="close" type="AntDesign" />
                    </Button>
                </View>
            </View>


            {showDatePicker && start && end &&
                <DateRangePicker
                    initialRange={[start, end]}
                    handleCancel={() => setShowDatePicker(false)}
                    onSetDateRange={onSetDateRange}
                    showDatePicker={showDatePicker}
                />
            }
        </Modal >

    );
};

const mapStateToProps = createStructuredSelector({
    kanbanTaskConfigs: makeSelectKanbanTaskConfigs()
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(FilterModalSupper);
