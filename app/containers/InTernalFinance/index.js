import React, { useEffect, useState, memo } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Text, View, ScrollView, TextInput } from 'react-native';
import { compose } from 'redux';
import moment from 'moment';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeInternalFinancePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import CustomHeader from '../../components/Header';
import { Header, Container, Card, CardItem, Item, Icon, Form, Label, Input, Button, Textarea, Content } from 'native-base';
import { TouchableWithoutFeedback } from 'react-native';
import CustomDateTimePicker from '../../components/CustomDateTimePicker';
import ToastCustom from '../../components/ToastCustom';
import * as actions from './actions';
import _ from 'lodash';
import CustomInput from '../../components/CustomInput';
const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';

export function InTernalFinance(props) {
    useInjectReducer({ key: 'internalFinace', reducer });
    useInjectSaga({ key: 'internalFinace', saga });



    const { navigation, mapFinance, internalFinancePage } = props;
    const { internal } = internalFinancePage;


    useEffect(() => {
        mapFinance(props)
    }, [])

    // useEffect(() => {
    //     const url = async () => {
    //         let result = ` ${await API_TASK_TASKS()}`;
    //     }
    //     url();
    // }, []);






    // useEffect(() => {
    //     const url = async () =>  {   
    //         let result = `${await MEETING_SCHEDULE()}` ; 
    //     } 
    //     url()

    // }, []);
    return (
        <Container>
            <CustomHeader
                title="Chi tiết tạm ứng"
                navigation={navigation}
            />
            {/* {meetingDetailPage.map((item)=>{ */}

            <ScrollView >
                <View style={{ display: 'flex', justifyContent: 'center' }}>
                </View>
                <Card style={{ marginHorizontal: 5 }} >
                    <Content >



                        <CustomInput inlineLabel label={'Tên tạm ứng:'}>
                            <Input value={_.get(internal, 'businessOpportunities.name')} style={styles.input} />
                            {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                        </CustomInput>

                        <CustomInput inlineLabel label={'Mã:'}>
                            <Input value={_.get(internal, 'code')} style={styles.input} />
                            {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                        </CustomInput>
                        <CustomInput inlineLabel label={'Người tạo:'}>
                            <Input value={_.get(internal, 'createdBy.name')} style={styles.input} />
                            {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                        </CustomInput>
                        <CustomInput inlineLabel label={'Ngày thanh toán:'}>
                            <Input value={moment(_.get(internal, 'advanceDate')).format(DATETIME_FORMAT)} style={styles.input} />
                            {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                        </CustomInput>
                        <CustomInput inlineLabel label={'Ngày tạm ứng:'}>
                            <Input value={moment(_.get(internal, 'advanceDate')).format(DATETIME_FORMAT)} style={styles.input} />
                            {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                        </CustomInput>
                        <CustomInput inlineLabel label={'Tên nhân viên:'}>
                            <Input value={_.get(internal, 'advancePerson.name')} style={styles.input} />
                            {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                        </CustomInput>
                        <CustomInput inlineLabel label={'Trạng thái:'}>
                            <Input value={_.get(internal, '')} style={styles.input} />
                            {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                        </CustomInput>
                        <CustomInput inlineLabel label={'Mã lệnh'}>
                            <Input value={_.get(internal, '')} style={styles.input} />
                            {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} /> */}
                        </CustomInput>

                        

                        <TouchableWithoutFeedback >
                            <Item inlineLabel style={{}} underline={false}>
                                <Label style={{ marginTop: 10 }}>Ghi Chú:</Label>
                            </Item>
                            <View  >
                                <Textarea
                                    rowSpan={5}
                                    bordered
                                    // onChangeText={(val) => handleChange('content', val)}
                                    style={{ width: '100%', alignSelf: 'center' }} />
                            </View>
                        </TouchableWithoutFeedback>



                    </Content>
                    {/* <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <LoadingButton handlePress={handleAdd} style={{ flex: 1, borderRadius: 10, marginLeft: 5 }}>
                                <Icon name="check" type="Feather" style={{ marginLeft: '48%' }} />
                            </LoadingButton>
                        </View> */}
                </Card>
            </ScrollView>
            {/* }) */}





            {/* <FabLayout onPress={handleAdd}>
                <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
            </FabLayout> */}
        </Container>



    );

}

const mapStateToProps = createStructuredSelector({
    internalFinancePage: makeInternalFinancePage()

});

function mapDispatchToProps(dispatch) {

    return {
        mapFinance: (props) => dispatch(actions.getAdvanceRequire(props)),
    };

}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(InTernalFinance);


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
    }
}