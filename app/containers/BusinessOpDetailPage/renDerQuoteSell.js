import React, { memo, useEffect, useState } from 'react';
import { Content, Button, Icon, Card, CardItem, Form, Item, Label, Input, View, Textarea, Left, Body, Text } from 'native-base';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';



import _, { parseInt } from 'lodash';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import { API_CUSTOMER, API_DYNAMIC_FORM, API_INVENTORY, API_INVENTORY_SERVICE, API_USERS } from '../../configs/Paths';
import { navigate } from '../../RootNavigation';
import { TouchableOpacity, TextInput, Image, DeviceEventEmitter, Dimensions, ScrollView } from 'react-native';
import ListPage from '../../components/ListPage';
import { FlatList } from 'react-native';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import * as actions from './actions';
import { getProfile } from '../../utils/authen';
import FabLayout from '../../components/CustomFab/FabLayout';
import BackHeader from '../../components/Header/BackHeader';
import { crmSourceCode, makeSelectClientId, makeSelectViewConfig } from '../App/selectors';
import { DATE_FORMAT, MODULE } from '../../utils/constants';
import ToastCustom from '../../components/ToastCustom';
import { onSalle } from '../../api/quotation';
import theme from '../../utils/customTheme'
import { checkedRequireForm, currencyFormat } from '../../utils/common';
import images from '../../images';
import LoadingButton from '../../components/LoadingButton';
import moment from 'moment';
import CollapseView from '../../components/CustomView/CollapseView';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
export function renDerQuoteSell(props) {
    const { isLoading, projects, projectDetail, onUpdateProjectProgress, isBusy, taskRole, taskConfig, navigation, clientId, route, salesQuoctation } = props;
    const { params } = route
    const [data, setData] = useState({})
    const [plus, setplus] = useState(0)
    const [profile, setProfile] = useState()
    const [error, setError] = useState({})
    const [dataIn, setDataIn] = useState({})
    const [cartData, setCartData] = useState({})
    const [sumQuote, setSumQuote] = useState()
    const [saving, setSaving] = useState(false)
    const [newBillDate, setNewBillDate] = useState(new Date())
    const date = new Date().valueOf()
    const nowDate = new Date().toISOString().slice(0, 9)
    const [putAuth, setPutAuth] = useState(false)

    useEffect(() => {
        if (params && params.item) {
            const newData = { ...params.item }
            setData({ ...newData, code: `BGBH${date}`, })
            setPutAuth(true)
        } else {
            setData({ code: `BGBH${date}`, })
        }
    }, [params])

    useEffect(() => {
        let sumCard = 0
        let sumdiscount
        const { percentageDiscount = "0" } = data
        if (cartData) {
            const sumListCart = Object.values(cartData)
            for (let i = 0; i < sumListCart.length; i++) {
                sumCard += sumListCart[i]
            }
            setSumQuote(sumCard)
            data.priceDiscount ? sumdiscount = sumCard - (sumCard * percentageDiscount / 100) - (sumCard * data.priceDiscount / 100) : sumdiscount = sumCard - (sumCard * percentageDiscount / 100)
            setSumQuote(sumdiscount)
        }


    }, [cartData, data])

    const checkValid = () => {

        let updateList = 'code, customer, deliveryDate, expiredDate, billDate, salesDate, commissionGroup, products, percentageDiscount, service, template, name, ratio'
            .replace(/ /g, '').split(',').reduce((a, v) => ({ ...a, [v]: v }), {})
        const { isValid, errorList, firstMessage } = checkedRequireForm(salesQuoctation, data, updateList)
        let valid = isValid
        let msg = firstMessage
        let err = errorList

        if (!data.template) {
            valid = valid && data.template;
            ToastCustom({ text: 'Không được để trống trường Biểu mẫu', type: 'danger' })
            err.template = true
        }

        if (!data.ratio) {
            valid = valid && data.ratio;
            ToastCustom({ text: 'Không được để trống trường Tỷ lệ', type: 'danger' })
            err.ratio = true
        }

        if (!data.customer) {
            valid = valid && data.customer;
            ToastCustom({ text: 'Không được để trống trường Khách hàng', type: 'danger' })
            err.customer = true
        }
        if (!data.deliveryDate || !(moment(data.deliveryDate).format(DATE_FORMAT.DATE)).length) {
            valid = valid && data.deliveryDate;
            ToastCustom({ text: 'Không được để trống trường Ngày giao hàng', type: 'danger' })
            err.deliveryDate = true
        }

        if (!data.expiredDate || !(moment(data.expiredDate).format(DATE_FORMAT.DATE)).length) {
            valid = valid && data.expiredDate;
            ToastCustom({ text: 'Không được để trống trường Ngày hết hạn', type: 'danger' })
            err.expiredDate = true
        }

        if (!data.products || !data.products.length) {
            valid = valid && data.template || valid && dataIn.template;
            ToastCustom({ text: 'Cần lựa chọn danh sách sản phẩm', type: 'danger' })
            err.template = true
        }

        valid = !Object.keys(errorList).length ? true : false
        if (!valid && msg) ToastCustom({ text: msg, type: 'danger' })
        setError(err)
        return valid;
    }

    const handleSubmit = async () => {
        let { code, customer, deliveryDate, expiredDate, billDate, salesDate, commissionGroup, products, percentageDiscount, service, template, name, ratio } = data
        let { priceDiscount = 0, } = dataIn

        setSaving(true)
        try {
            if (checkValid()) {


                let dataAll = {
                    name: name.trim(),
                    billDate: billDate,
                    businessOpportunities: params.localData ? params.localData._id : null,
                    code: code,
                    customer: customer,
                    deliveryDate: deliveryDate ? deliveryDate : nowDate,
                    expiredDate: expiredDate ? expiredDate : nowDate,
                    salesDate: salesDate,
                    commissionGroup: commissionGroup,
                    //Tên dự toán chi phi chưa có trường
                    costEstimate: null,
                    products: products,
                    percentageDiscount: percentageDiscount,
                    priceDiscount: priceDiscount,
                    salePoint: profile && profile.organizationUnit.organizationUnitId,
                    kanbanStatus: params && params.kanban._id,
                    template: template,
                    service: service,
                    totalAmount: sumQuote,
                    rate: ratio,
                    typeOfSalesQuotation: "1",
                    salesman: profile
                }
                const res = await onSalle(dataAll)
                if (_.get(res, 'success')) {
                    ToastCustom({ text: 'Thêm mới thành công', type: 'success' });
                    DeviceEventEmitter.emit('addQuoteSellSuccess', { project: dataAll.template, res: res })
                    navigation.goBack()
                } else {
                    ToastCustom({ text: `Thêm mới thất bại: ${res.message}`, type: 'danger' });
                }
            }
        }
        catch (err) {
            console.log('err', err)
        }
        setSaving(false)

    };

    useEffect(() => {
        getProfile().then(setProfile)
    }, [])

    const handleChange = (key, value) => {
        console.log(value);
        let newData = {}
        newData[key] = value
        // if (key && key === 'disCount' && value > 100 || value < 0) return
        setData({ ...data, ...newData });
    };


    return (

        <>
            <BackHeader
                navigation={navigation}
                title={params.item ? 'Thông tin báo giá sản phẩm' : 'Thêm mới báo giá sản phẩm'}
            />
            <ScrollView>
                <Card>
                    <CardItem>
                        <Form style={{ flex: 1, backgroundColor: 'white' }}>
                            <Item inlineLabel error={error.name} >
                                <Label>Tên BG/BH*:</Label>
                                <Input
                                    style={{ textAlign: 'left', minHeight: 45, paddingTop: 10 }}
                                    value={data.name}
                                    onChangeText={(val) => handleChange('name', val)}
                                    disabled={putAuth}
                                />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                            </Item>

                            <Item inlineLabel >
                                <Label >Mã BG/BH:</Label>
                                <Input
                                    value={data.code}
                                    style={{ textAlign: 'right', minHeight: 45, paddingTop: 10 }}
                                    disabled={true}
                                    multiline={true}
                                    onChangeText={(val) => handleChange('code', val)}
                                />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                            </Item>
                            <Item inlineLabel error={error.customer}>
                                <Label >Khách hàng*:</Label>
                                <SingleAPISearch
                                    API={API_CUSTOMER}
                                    onSelectedItemObjectsChange={(value) => handleChange('customer', _.get(value, '[0]'))}
                                    selectedItems={data.customer ? [data.customer] : data.customer}
                                    disabled={putAuth}
                                />
                                <Icon
                                    name="user-circle"
                                    type="FontAwesome"
                                    style={{ fontSize: 20, marginLeft: 5, color: '#ccc' }}
                                    onPress={() => navigate('AddCustomer')}

                                />
                            </Item>


                            <Item inlineLabel>
                                <Label >Dịch vụ:</Label>
                                <SingleAPISearch

                                    API={API_INVENTORY_SERVICE}
                                    selectedItems={data.service ? [data.service] : data.service}
                                    onSelectedItemsChange={(value) => handleChange('service', _.get(value, '[0]'))}
                                    disabled={putAuth}
                                // onRemove={() => setCustomer(null)}
                                // filterOr={['name', 'customerCif', 'phoneNumber']}
                                />

                            </Item>
                            <Item inlineLabel >
                                <Label >Nhân viên bán hàng: </Label>
                                <Input
                                    style={{ textAlign: 'right', minHeight: 45, paddingTop: 10 }}
                                    disabled={true}
                                    multiline={true}
                                    value={profile ? profile.username : null}

                                />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                            </Item>

                            <Item inlineLabel >
                                <Label >Giảm giá:</Label>
                                <Input
                                    value={data.percentageDiscount}
                                    style={{ textAlign: 'left', minHeight: 45, flex: 2 }}
                                    multiline={false}
                                    onChangeText={(val) => handleChange('percentageDiscount', val)}
                                    keyboardType="decimal-pad"
                                    maxLength={3}
                                    disabled={putAuth}
                                />

                                <Label >Đơn vị:</Label>
                                <TouchableOpacity  >
                                    <Icon style={{ alignSelf: 'center', fontSize: 18 }} name='percent' type='FontAwesome' />
                                </TouchableOpacity>

                            </Item>
                            <Item inlineLabel error={error.ratio} >
                                <Label >Tỷ Lệ*:</Label>
                                <Input
                                    style={{ textAlign: 'right', minHeight: 45, paddingTop: 10 }}
                                    value={data ? data.ratio : null}
                                    multiline={true}
                                    onChangeText={(val) => handleChange('ratio', val)}
                                    keyboardType="decimal-pad"
                                    disabled={putAuth}
                                />
                                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
                            </Item>



                            <Item inlineLabel>
                                <Label >Nhóm nhận hoa hồng:</Label>
                                <MultiAPISearch
                                    API={API_USERS}
                                    selectedItems={Array.isArray(data.commissionGroup) ? data.commissionGroup.map(e => e._id) : []}
                                    onSelectedItemObjectsChange={(e) => { handleChange('commissionGroup', e) }}
                                    onRemove={() => handleChange('commissionGroup', [])}
                                    disabled={putAuth}
                                // onRemove={() => setCustomer(null)}
                                // filterOr={['name', 'customerCif', 'phoneNumber']}
                                />
                            </Item>
                            <Item style={{ flexDirection: 'row' }} >
                                <Label style={{ alignSelf: 'center' }}>Tổng tiền thanh toán: </Label>
                                <Input
                                    value={sumQuote ? currencyFormat(sumQuote) : ''}
                                    style={{ textAlign: 'center', minHeight: 45, paddingTop: 10 }}
                                    multiline={true}
                                    disabled={true}
                                />
                            </Item>


                            <CollapseView title='Tùy chọn thêm'>
                                <Item inlineLabel >
                                    <Label>Ngày giao hàng:</Label>
                                    <DateTimePicker
                                        mode="date"
                                        onSave={(e) => handleChange('deliveryDate', e)}
                                        value={data.deliveryDate && moment(data.deliveryDate).format(DATE_FORMAT.DATE)}
                                        disabled={putAuth}
                                    />
                                </Item>
                                <Item inlineLabel >
                                    <Label>Ngày hết hạn:</Label>
                                    <DateTimePicker
                                        mode="date"
                                        onSave={(e) => handleChange('expiredDate', e)}
                                        value={data.expiredDate && moment(data.expiredDate).format(DATE_FORMAT.DATE)}
                                        disabled={putAuth}
                                    />
                                </Item>
                                <Item inlineLabel>
                                    <Label>Ngày Thanh toán:</Label>
                                    <DateTimePicker
                                        mode="date"
                                        onSave={(e) => handleChange('billDate', e)}
                                        value={data.billDate && moment(data.billDate).format(DATE_FORMAT.DATE)}
                                        disabled={putAuth}
                                    />
                                </Item>
                            </CollapseView>


                            <CollapseView title='Thay đổi ngày bán hàng'>

                                <Item inlineLabel>
                                    <Label>Ngày bán:</Label>
                                    <DateTimePicker
                                        mode="date"
                                        onSave={(e) => handleChange('salesDate', e)}
                                        value={data.salesDate && moment(data.salesDate).format(DATE_FORMAT.DATE)}
                                        disabled={putAuth}
                                    />
                                </Item>

                            </CollapseView>




                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <MultiAPISearch
                                    API={API_INVENTORY}
                                    selectedItems={Array.isArray(data.products) ? data.products.map(e => e._id) : []}
                                    onSelectedItemObjectsChange={(e) => { handleChange('products', e) }}
                                    onRemove={() => handleChange('products', [])}
                                    disabled={putAuth}
                                >
                                    <Text style={{ marginVertical: 10, fontSize: 18, color: theme.brandPrimary }}>Danh sách sản phẩm <Icon type="Entypo" name='plus' style={{ fontSize: 18, color: theme.brandPrimary }} /></Text>
                                </MultiAPISearch>
                            </View>

                            {data && data.products ? <ScrollView>
                                {data && data.products.map((item) => {
                                    return (
                                        <RenderItem item={item}
                                            onGetResult={(id, result, products) => {
                                                setCartData(e => ({ ...e, [id]: result }))
                                                setData({ ...data, products: [products] });
                                            }}
                                            onGetRemove={(id) => {
                                                const resultHenover = data.products.filter((item) =>
                                                    item._id !== id
                                                )
                                                const newData = { ...data, products: resultHenover }
                                                setData(newData)
                                                setCartData(e => ({ ...e, [id]: 0 }))
                                            }}
                                            disabled={putAuth}
                                        />
                                    )
                                })}
                            </ScrollView> : null}

                            <Item inlineLabel error={error.template} >
                                <Label>Biểu mẫu:* </Label>
                                <SingleAPISearch
                                    displayKey='title'
                                    query={{
                                        filter: {
                                            moduleCode: MODULE.SALES_QUOTATION,
                                        },

                                        // clientId,
                                    }}

                                    API={API_DYNAMIC_FORM}
                                    onSelectedItemObjectsChange={(value) => {
                                        // console.log('value', value)
                                        return (
                                            handleChange('template', _.get(value, '[0]'))
                                        )
                                    }}
                                    selectedItems={data.template ? data.template : _.get(data, 'template[0]._id')}
                                    disabled={putAuth}
                                />
                            </Item>

                            {putAuth ? null :
                                <LoadingButton isBusy={saving} block handlePress={handleSubmit}>
                                    <Icon name="check" type="Feather" />
                                </LoadingButton>
                            }

                        </Form>

                    </CardItem>

                </Card>

            </ScrollView >

        </>

    );
}

const mapStateToProps = createStructuredSelector({
    clientId: makeSelectClientId(),
    salesQuoctation: makeSelectViewConfig(MODULE.SALES_QUOTATION)

});
function mapDispatchToProps(dispatch) {
    return {
        // onSalle: (log) => dispatch(actions.salleLog(log)),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);


export default compose(withConnect, memo)(renDerQuoteSell);

const RenderItem = (props) => {
    const { item = {}, onGetResult, onGetRemove, disabled } = props
    const [localData, setLocalData] = useState({
        price: item.pricePolicy.sourcePrice !== undefined ? String(item.pricePolicy.sourcePrice) : ' ',
        percentageDiscount: item.discount !== undefined ? String(item.discount) : '0',
        amount: item.amount !== undefined ? String(item.amount) : '0',
    })
    const [localState, setLocalState] = useState(item)

    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value
        if (key && key === 'percentageDiscount' && value > 100 || value < 0) return
        else setLocalData({ ...localData, ...newData });
    };

    useEffect(() => {
        if (localData) {
            const { price, amount = "1", percentageDiscount = "0" } = localData
            const result = parseInt(price) * parseInt(amount) * (1 - parseInt(percentageDiscount) / 100)
            onGetResult && onGetResult(item._id, result, localState)
        }
    }, [localData])

    return <View style={{
        flex: 1, borderColor: '#ccc',
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 16, marginBottom: 12
    }}>
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ position: 'absolute', right: 8, top: 8 }} onPress={() => { onGetRemove && onGetRemove(item._id) }} disabled={disabled} ><Icon name='delete' type='AntDesign' /></TouchableOpacity>
            <Image source={{ uri: 'https://bitly.com.vn/bmh2qm' }} style={{ width: 150, height: 150, position: 'absolute', right: 32, top: 22, borderRadius: 30 }} resizeMode="cover" />
            <View style={{ paddingLeft: 10, paddingRight: 20, paddingTop: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', alignSelf: 'flex-end', marginLeft: 6 }}>{item.name}</Text>
                </View>

                <View style={{ flexDirection: 'row', }} >
                    <Text style={{ fontSize: 14, alignSelf: 'flex-end', marginLeft: 6 }}>{item.code}</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center'
                    }}>
                        <Text style={{ color: 'rgba(46, 149, 46, 1)', fontSize: 16 }}>Giá tiền: </Text>
                        <TextInput
                            value={localData ? localData.price : '0'}
                            style={{

                                color: '#555555',
                                paddingRight: 10,
                                paddingLeft: 10,
                                paddingTop: 5,
                                height: '80%',
                                borderColor: '#6E5BAA',
                                borderWidth: 1,
                                borderRadius: 2,
                                alignSelf: 'center',
                                backgroundColor: '#ffffff'
                            }}
                            onChangeText={(val) => {
                                handleChange('price', val);
                                setLocalState({ ...localState, [pricePolicy.sourcePrice]: val })
                            }}
                            keyboardType="decimal-pad"
                            multiline={true}
                            editable={!disabled}
                        />
                        <Text style={{ color: 'rgba(46, 149, 46, 1)' }}> VNĐ</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Label style={{ alignSelf: 'center', color: 'red', fontSize: 16 }}>Chiết khấu: </Label>
                        <TextInput
                            value={localData ? localData.percentageDiscount : '1'}
                            onChangeText={(val) => {
                                handleChange('percentageDiscount', val)
                                setLocalState({ ...localState, discount: val })
                            }}
                            style={{
                                color: '#555555',
                                paddingRight: 10,
                                paddingLeft: 10,
                                paddingTop: 5,
                                height: '80%',
                                borderColor: '#6E5BAA',
                                borderWidth: 1,
                                borderRadius: 2,
                                alignSelf: 'center',
                                backgroundColor: '#ffffff'
                            }}
                            keyboardType="decimal-pad"
                            maxLength={3}
                            multiline={true}
                            editable={!disabled}
                        />
                        <Label style={{ alignSelf: 'center', color: 'black', fontSize: 16 }}> %</Label>

                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <TouchableOpacity style={{
                        marginRight: 4, borderColor: '#ccc',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 16,
                        height: 35,
                        width: 70,
                    }}
                        onPress={() => {
                            setLocalData({ ...localData, amount: parseInt(localData.amount) + 1 })
                            setLocalState({ ...localState, amount: parseInt(localData.amount) + 1 })
                        }}
                        disabled={disabled}

                    >
                        <Icon name='plus' type='Entypo' style={{ textAlign: 'center' }} />
                    </TouchableOpacity>
                    <View>
                        <Input
                            value={String(localData.amount)}
                            onChangeText={(val) => {
                                handleChange('amount', val)
                                setLocalState({ ...localState, amount: val })
                            }}
                            style={{ height: '100%', width: '100%', fontSize: 14, textAlign: 'center' }}
                            multiline={false}
                            keyboardType="decimal-pad"
                            disabled={disabled}
                        />
                    </View>
                    <TouchableOpacity style={{
                        marginLeft: 4, borderColor: '#ccc',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 16,
                        height: 35, width: 70
                    }}
                        onPress={() => {
                            setLocalData({ ...localData, amount: localData.amount > 0 ? parseInt(localData.amount) - 1 : 0 })
                            setLocalState({ ...localState, amount: localData.amount > 0 ? parseInt(localData.amount) - 1 : 0 })
                        }}
                        disabled={disabled}
                    >
                        <Icon name='minus' type='Entypo' style={{ textAlign: 'center' }} />
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    </View >
}