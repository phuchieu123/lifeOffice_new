import React, { memo, useEffect, useState } from 'react';
import { Content, Button, Icon, Card, CardItem, Form, Item, Label, Input, View, Textarea, Left, Body, Text } from 'native-base';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';



import _ from 'lodash';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import { API_CUSTOMER, API_DYNAMIC_FORM, API_INVENTORY, API_INVENTORY_SERVICE, API_SALES_QUOTATION } from '../../configs/Paths';
import { navigate } from '../../RootNavigation';
import { Alert, DeviceEventEmitter, TouchableOpacity } from 'react-native';
import ListPage from '../../components/ListPage';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import * as actions from './actions';
import { getProfile } from '../../utils/authen';
import FabLayout from '../../components/CustomFab/FabLayout';
import { Modal } from 'react-native-paper';
import LoadingButton from '../../components/LoadingButton';
import RenderHTML from 'react-native-render-html';
import { convertTemplate } from '../../api/quotation';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from "react-native-file-viewer";
import { getViewConfig } from '../../api/configs';
import { crmSourceCode } from '../App/selectors';
import { ScrollView } from 'react-native';
export function QuoteSell(props) {
    const { localData, kanban, crmSourceCode } = props;
    const [reload, setReload] = useState(0);
    const [hendalProps, setHendalProps] = useState()
    const [data, setData] = useState()
    const [isDisplay, setDisplay] = useState(true)
    const [renderContent, setRenderContent] = useState({})
    const [covnertPdf, setConvertPdf] = useState()
    const [viewConfig, setViewConfig] = useState()

    const handleAddProject = () => {
        navigate('renDerQuoteSell', { localData: localData, kanban: kanban });
    };



    const handleReload = () => setReload(reload + 1)
    useEffect(() => {

        const addEvent = DeviceEventEmitter.addListener("addQuoteSellSuccess", (e) => {
            if (e) {
                setData(e)
                setHendalProps(true)
                setDisplay(false)
            }
            else setHendalProps(false)
            setDisplay(true)
            handleReload()
        })
        return () => {
            addEvent.remove()

        };
    }, []);

    const creatPdf = async () => {

        let options = {
            html: renderContent,
            fileName: `${'BGBH' + new Date().valueOf()}`,
            directory: 'Download',
            base64: true
        };

        let file = await RNHTMLtoPDF.convert(options)
        Alert.alert(
            'Thông báo',
            'Tiếp tục xem và tải về dưới dạng pdf',
            [
                {
                    text: 'Hủy',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => openFile(file.filePath),
                },
            ],
            { cancelable: false },
        );
    }

    const openFile = (filePath) => {
        const path = filePath

        FileViewer.open(path) // absolute-path-to-my-local-file.
            .then(() => {
                // success
            })
            .catch((error) => {
                // error
            });
    }



    useEffect(() => {
        try {
            (async () => {
                if (data && data.project.content && data.res.data) {
                    const awesome_value = await convertTemplate({ content: data && data.project.content, data: data && data.res.data, code: 'SalesQuotation', viewConfig: viewConfig, crmSource: crmSourceCode })
                    setRenderContent(awesome_value)
                }


            })();
        } catch (err) {
            console.log('err', err)
        }
    }, [data]);

    useEffect(() => {
        getViewConfig().then((e) => setViewConfig(e))
    }, [])




    // useEffect(() => {
    //     (async () => {
    //         const convertPdf = await RNHTMLtoPDF.convert(renderContent)
    //         setConvertPdf(convertPdf)
    //     })();
    // }, [renderContent]);

    // console.log('covnertPdf', covnertPdf)
    return (
        <>
            <ListPage
                query={{
                    filter: {
                        businessOpportunities: localData._id
                    },
                    skip: 0
                }}
                api={API_SALES_QUOTATION}
                reload={reload}
                itemComponent={({ item }) => {

                    return (
                        <TouchableOpacity
                            key={`${item._id}`}
                            onPress={() => navigate('renDerQuoteSell', { "item": item }, { 'kanban': kanban }, { '_id': localData._id })}
                        >
                            <View>
                                <Card>
                                    <CardItem>
                                        <Form style={{ flex: 1, backgroundColor: 'white'}}>
                                            {/* <Item inlineLabel > */}
                                                <Label>Tên BG/BH: </Label>
                                                <Input
                                                    style={{ textAlign: 'left', minHeight: 45, paddingTop: 10 }}
                                                    multiline={true}
                                                    value={item.name}
                                                    disabled={true}
                                                />
                                            {/* </Item> */}
                                            {/* <Item inlineLabel > */}
                                                <Label >Mã BG/BH: </Label>
                                                <Input
                                                    style={{ textAlign: 'left', minHeight: 45, paddingTop: 10 }}
                                                    disabled={true}
                                                    multiline={true}
                                                    onChangeText={(val) => handleChange('code', val)}
                                                    value={item.code}
                                                />
                                                {/* <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} /> */}
                                            {/* </Item> */}
                                            {/* <Item inlineLabel > */}
                                                <Label>Tên cơ hội kinh doanh: </Label>
                                                <Input
                                                    style={{ textAlign: 'left', minHeight: 45, paddingTop: 10 }}
                                                    disabled={true}
                                                    multiline={true}
                                                    value={localData.name}
                                                />
                                            {/* </Item> */}
                                            {/* <Item inlineLabel > */}
                                                <Label>Loại báo giá/Bán hàng: </Label>
                                                <Input
                                                    style={{ textAlign: 'left', minHeight: 45, paddingTop: 10 }}
                                                    disabled={true}
                                                    multiline={true}
                                                    value={item.typeOfSalesQuotation}
                                                />
                                            {/* </Item> */}
                                        </Form>
                                    </CardItem>
                                </Card>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
            <Modal visible={hendalProps} style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                padding: 0,
                alignSelf: 'center',
                zIndex: 39,
            }}>
                <View style={{ height: '100%', width: '100%', }}>
                    <ScrollView>
                        <View style={{ flex: 1 }}>
                            <RenderHTML contentWidth={'auto'} source={{ html: renderContent }} />

                        </View>
                    </ScrollView>


                    <View style={{ position: 'absolute', left: 0, width: '100%', bottom: 0 }}>

                        <View padder style={{ flexDirection: 'row' }}>
                            <Button block onPress={creatPdf} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
                                <Icon name="check" type="Feather" />
                            </Button>
                            <Button block onPress={() => setHendalProps(false)} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
                                <Icon name="close" type="AntDesign" />
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>



            {isDisplay ? <FabLayout onPress={handleAddProject}>
                <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
            </FabLayout> : null}
        </>

    );
}

const mapStateToProps = createStructuredSelector({
    crmSourceCode: crmSourceCode(),
});
function mapDispatchToProps(dispatch) {
    return {
        onSalle: (log) => dispatch(actions.salleLog(log)),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);


export default compose(withConnect, memo)(QuoteSell);
