import React, { useEffect, useState } from 'react';
import { View, List, ListItem, Text, Icon, Button, Body, Right } from 'native-base';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Modal from 'react-native-modal';
import APISearch from '../../../components/CustomMultiSelect/MultiAPISearch';
import { API_USERS } from '../../../configs/Paths';
import _ from 'lodash'
import ToastCustom from '../../../components/ToastCustom';

const ShareModal = (props) => {
    const [localData, setLocalData] = useState()
    const {
        isVisible,
        onClose, onSave, data
    } = props;
    useEffect(() => {
        if (data) setLocalData(data)
    }, [data])
    const [selectedEmp, setSelectedEmp] = useState([]);
    const handleChangeEmployee = (emp) => {
        setSelectedEmp(emp);
    };

    const handleSave = () => {
        if (selectedEmp.length) {
            onClose();
            onSave({
                ...data,
                users: selectedEmp,
            });
            // ToastCustom({ text: 'Chia sẻ thành công', type: 'success' })
        }
        else {
            // ToastCustom({ text: 'Chọn người muốn chia sẻ', type: 'danger' })
        }
    };
    //console.log("SELECTED", selectedEmp);


    return (
        <Modal isVisible={isVisible} style={{ height: 'auto' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
                <List>
                    <View>
                        <ListItem itemHeader itemDivider style={{ borderRadius: 10 }}>
                            <Text>Chia sẻ</Text>
                        </ListItem>
                        <ListItem>
                            <APISearch
                                API={API_USERS}
                                selectedItems={selectedEmp.map(e => e._id)}
                                onSelectedItemObjectsChange={handleChangeEmployee}
                                onRemove={() => setSelectedEmp([])}
                                filterOr={['name', 'code']}
                            />
                        </ListItem>
                    </View>
                </List>
                <View padder style={{ flexDirection: 'row' }}>
                    <Button block onPress={handleSave} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
                        {/* <Icon name="check" type="Feather" /> */}
                        <Icon name="share-social-outline" type="Ionicons" />
                    </Button>
                    <Button block onPress={onClose} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
                        <Icon name="close" type="AntDesign" />
                    </Button>
                </View>
            </View>
        </Modal >
    );
};

const mapStateToProps = createStructuredSelector({
});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(ShareModal);
