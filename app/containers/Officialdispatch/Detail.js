import React, { useState, useEffect } from 'react';
import { Body, Card, CardItem, Container, Content, Icon, Input, Text, View, Label, Item, ListItem, Right, Button, ActionSheet, Tabs, Tab, TabHeading } from 'native-base';
import _ from 'lodash';
import CustomHeader from '../../components/Header';
import CustomInput from '../../components/CustomInput';
import moment from 'moment';
import BackHeader from '../../components/Header/BackHeader';
import DepartmentSelect from '../../components/CustomMultiSelect/DepartmentSelect';
import { API_TASK, API_CUSTOMER, API_DOCUMENTARY, API_USERS, API_ROLE_GROUPS } from '../../configs/Paths';
import { compose } from 'redux';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import { BackHandler, ScrollView } from 'react-native';
import LoadingButton from '../../components/LoadingButton';
import { crmSourceCode, makeSelectViewConfig, makeSelectClientId } from '../App/selectors';
import { MODULE, REQUEST_METHOD } from '../../utils/constants';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Search from '../../components/CustomMultiSelect/Search';
import DateTimePicker from '../../components/CustomDateTimePicker/DateTimePicker';
import FileView from '../../components/FileView';
import { TouchableOpacity } from 'react-native';
import { DeviceEventEmitter } from 'react-native';
import ToastCustom from '../../components/ToastCustom';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import { addFile, } from '../../api/fileSystem';
import DocumentPicker from 'react-native-document-picker'
import * as actions from './actions';
import DetailContent from './DetailContent'
import FabLayout from '../../components/CustomFab/FabLayout';
const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm';
function Officialdispatch(props) {
    useInjectReducer({ key: 'officialdispatch', reducer });
    useInjectSaga({ key: 'officialdispatch', saga });
    const { navigation, route, crmSourceCode, icomingdocumentConfig, docuentaryConfig, clientId, onUpdateOfficialdispatch } = props;
    const { params } = route
    const [error, setError] = useState({});
    const [localData, setLocalData] = useState({})
    const [isComingDoc, setIsComingDoc] = useState()
    const [isUpdate, setIsUpdate] = useState()
    const [showFile, setShowFile] = useState()
    const [code, setCode] = useState()
    const [query, setQuery] = useState({})
    const [saving, setSaving] = useState(false)
    const { id } = _.get(route, 'params') || {}

    useEffect(() => {
        if (params && params.item) {
            setLocalData(params.item)
            setIsUpdate(true)
        }
    }, [params])

    useEffect(() => {
        const backHandlerListener = BackHandler.addEventListener('hardwareBackPress',
          () => {
            navigation.goBack();
            return true;
          }
        );
        return () => {
          backHandlerListener.remove();
        }
    
      }, []);
    const [reload, setReload] = useState(0)
    const handleReload = () => setReload(reload + 1)
    useEffect(() => {
        setIsComingDoc(localData.type === 2)
        const newCode = localData.type === 2 ? 'inComingDocument' : 'outGoingDocument'
        setCode(newCode)

    }, [localData.type])

    // const handleAdd = async () => {
    //     let body = {
    //         ...localData,
    //     }

    //     if (isUpdate) {
    //         updateSchedule(body)
    //     }
    //     else {
    //         getProfile().then(profile => {
    //             body = {
    //                 ...body,

    //             }
    //             saveSchedule(body)
    //         })

    //     }
    // };
    const defaultBody = {
        method: REQUEST_METHOD.POST,
        body: {
            action: "read",
            data: [],
            path: "/",
            showHiddenItems: false,
        },
    }
    const [body, setBody] = useState(defaultBody)
    const handleAdd = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })
            await addFile({ folder: "users", clientId, path: body.body.path, file: res[0], code: code, mid: localData._id, fname: 'root' })
            ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
            handleReload()
        } catch (err) {
            ToastCustom({ text: 'Thêm mới không thành công', type: 'danger' })
        }
    }

    return (

        <Container>
            <BackHeader
                navigation={navigation}
                title={localData.name}
            />
            <Tabs>

                <Tab
                    heading={
                        <TabHeading>
                            <Text>Chi Tiết</Text>
                        </TabHeading>
                    }>
                    <DetailContent localData={localData} params={params.item} navigation={navigation} />
                    {/* <RenderPage api={API_FILE_USERS} folder="users" /> */}
                </Tab>
                <Tab
                    heading={
                        <TabHeading>
                            <Text>Tài Liệu</Text>
                        </TabHeading>
                    }>
                    {/* <RenderPage api={API_FILE_SHARE} folder="share" /> */}

                    <FileView id={localData._id} code={code} visible={true} reload={reload} />
                    <FabLayout onPress={handleAdd}>
                        <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
                    </FabLayout>
                </Tab>
            </Tabs>


        </Container >
    )
}


const mapStateToProps = createStructuredSelector({
    crmSourceCode: crmSourceCode(),
    icomingdocumentConfig: makeSelectViewConfig(MODULE.INCOMINGDOCUMENT),
    docuentaryConfig: makeSelectViewConfig(MODULE.DOCUMENTARY),
    clientId: makeSelectClientId(),
});

function mapDispatchToProps(dispatch) {
    return {
        onUpdateOfficialdispatch: (Officialdispatch) => dispatch(actions.updateOfficialdispatch(Officialdispatch)),
    };

}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(Officialdispatch);

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