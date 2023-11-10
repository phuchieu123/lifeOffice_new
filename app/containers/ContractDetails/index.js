import React, { useEffect, useState, memo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Text, View, ScrollView, TextInput } from 'react-native';
import { compose } from 'redux';
import moment from 'moment';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeContractDetaillsPage from './selectors';
import reducer from './reducer';
import saga from './saga';
import CustomHeader from '../../components/Header';
import { Header, Container, Card, CardItem, Item, Icon, Form, Label, Input, Button, Textarea, Content } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import { API_CUSTOMER, API_USERS } from '../../configs/Paths';
// import ToastCustom from '../../components/ToastCustom';
import * as actions from './actions';
import _ from 'lodash';
import CustomInput from '../../components/CustomInput';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import { crmSourceCode } from '../App/selectors';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

export function ContractDetails(props) {
    useInjectReducer({ key: 'internalFinace', reducer });
    useInjectSaga({ key: 'internalFinace', saga });

    const { navigation, contractDetailsPage, mapContract, route, crmSourceCode } = props
    const { params } = route
    const { item } = params || {}

    const [localData, setLocalData] = useState({})

    useEffect(() => {
        item && setLocalData(item)
    }, [item])

    return (
        <Container>
            <CustomHeader
                title="Thông tin hợp đồng"
                navigation={navigation}
            />
            <Content >
                <CustomInput inlineLabel label={'Mã hợp đồng:'}>
                    <Input value={_.get(localData, 'code')} style={styles.input} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </CustomInput>

                <CustomInput inlineLabel label={'Loại hợp đồng:'}>
                    <CustomMultiSelect
                        single
                        handleSelectItems={(value) => handleChange('catalogContract', value[0])}
                        onRemoveSelectedItem={() => handleChange('catalogContract', null)}
                        selectedItems={localData.catalogContract ? [localData.catalogContract] : []}
                        uniqueKey="value"
                        displayKey="title"
                        items={crmSourceCode['S15']}
                    />
                </CustomInput>
                <CustomInput inlineLabel label={'Tên hợp đồng:'}>
                    <Input value={_.get(localData, 'name')} style={styles.input} multiline={true} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </CustomInput>
                <CustomInput inlineLabel label={'Ngày ký kết hợp đồng:'}>
                    <DateTimePicker
                        onSave={(e) => handleChange('contractSigningDate', e)}
                        value={localData.contractSigningDate && moment(localData.contractSigningDate).format('DD/MM/YYYY')}
                    />
                </CustomInput>
                <CustomInput inlineLabel label={'Ngày hết hạn hợp đồng:'}>
                    <DateTimePicker
                        onSave={(e) => handleChange('expirationDay', e)}
                        value={localData.startDate && moment(localData.expirationDay).format('DD/MM/YYYY')}
                    />
                </CustomInput>
                <CustomInput inlineLabel label={'Thông báo:'}>
                    <Input value={(_.get(localData, 'notice') || '').toString()} style={styles.input} />
                    {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                </CustomInput>
                <CustomInput inlineLabel label={'Loại sản phẩm:'}>
                    <Input value={_.get(localData, 'productType')} style={styles.input} />
                    {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                </CustomInput>
                {/* <CustomInput inlineLabel label={'Khách hàng:'}>
                    <SingleAPISearch
                        API={API_CUSTOMER}
                        selectedItems={localData.customerId ? [localData.customerId] : []}
                        onSelectedItemsChange={(val) => handleChange('customerId', val.length ? val[0] : null)}
                        onRemove={() => handleChange('customerId', null)}
                    // selectedDatas={selectedCustomerAccount}
                    />
                </CustomInput>
                <CustomInput inlineLabel label={'Tên công việc dự án:'}>
                    <Input value style={styles.input} />
                </CustomInput> */}
                <CustomInput inlineLabel label={'Người chịu chách nhiệm:'}>
                    <Input value={_.get(localData, 'responsible[0].name')} style={styles.input} />
                    {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                </CustomInput>
                <CustomInput inlineLabel label={'Chu kỳ:'}>
                    <Input value={(_.get(localData, 'cycle') || '').toString()} style={styles.input} />
                    {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                </CustomInput>
            </Content>
            {/* <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <LoadingButton handlePress={handleAdd} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }}>
                                <Icon name="check" type="Feather" style={{ marginLeft: '48%' }} />
                            </LoadingButton>
                        </View> */}
        </Container >
    );

}

const mapStateToProps = createStructuredSelector({
    contractDetailsPage: makeContractDetaillsPage(),
    crmSourceCode: crmSourceCode(),
});

function mapDispatchToProps(dispatch) {

    return {
        mapContract: (props) => dispatch(actions.getContractDetiails(props)),
    };

}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ContractDetails);


const styles = {
    view: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 2
    },
    icon: {
        fontSize: 18,
        opacity: 0.4,
        marginTop: 0
    },
    input: {
        textAlign: 'right',
        marginRight: 5,
        paddingTop: 10,
    }
}