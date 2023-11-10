import React, { useEffect, useState } from 'react';
import { Icon, Container, Item, Label, Input, Content, Spinner, View, Text } from 'native-base';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from '../../../utils/injectSaga';
import { useInjectReducer } from '../../../utils/injectReducer';
import BackHeader from '../../../components/Header/BackHeader';
import SingleAPISearch from '../../../components/CustomMultiSelect/SingleAPISearch';
import { API_APPROVE_GROUP, API_DYNAMIC_FORM, API_FIELD } from '../../../configs/Paths';
import makeSelectAddApproveProject from '../selectors';
import reducer from '../reducer';
import saga from '../saga';
import _ from 'lodash';
import ToastCustom from '../../../components/ToastCustom';
import { addApprove, cleanup } from '../actions';
import { MODULE } from '../../../utils/constants';
import { makeSelectClientId } from '../../App/selectors';
import { navigate } from '../../../RootNavigation';
import APISearch from '../../../components/CustomMultiSelect/APISearch';
import { autoLogout } from '../../../utils/autoLogout';

const RenderInfo = props => {
    const { code, value } = props

    if (value) {
        switch (code) {
            case MODULE.TASK:
                return <Icon name='information-circle-outline' type='Ionicons' onPress={() => navigate('ProjectDetail', { project: { _id: value._id } })} />
            case MODULE.DOCUMENTARY:
                return < Icon name='information-circle-outline' type='Ionicons' onPress={() => navigate('DetailsOfficialDispatch', { item: value })} />
            case MODULE.ADVANCE_REQUIRE:
                return < Icon name='information-circle-outline' type='Ionicons' onPress={() => navigate('InTernalFinance', { project: { _id: value } })} />
            case MODULE.CONTRACT:
                return < Icon name='information-circle-outline' type='Ionicons' onPress={() => navigate('ContractDetails', { item: value })} />
        }
    }

    return null
}

function DaysOffBoardApproveTemplate(props) {
    useInjectReducer({ key: 'addApprovePage', reducer });
    useInjectSaga({ key: 'addApprovePage', saga });

    const { navigation, title, code, api, label, onAddApprove, onCleanUp, addApprovePage, clientId, customDislayKey, route } = props;
    const { addApproveSuccess, isLoading } = addApprovePage
    const { params } = route

    const [localData, setLocalData] = useState({ subCode: code });
    const [approveData, setApproveData] = useState([]);
    const [error, setError] = useState({});

    useEffect(() => {
        return () => {
            onCleanUp()
        }
    }, [])

    useEffect(() => {
        addApproveSuccess && navigation.goBack()
    }, [addApproveSuccess])

    useEffect(() => {
        if (params && params.item) {
            // setLocalData(e => ({ ...e, dataInfo: params.item }))
            handleChange('dataInfo', [params.item])
        }
    }, [params])

    useEffect(() => {
        navigation.addListener(
            'focus', () => {
                autoLogout()
            }
        );

    }, []);

    const handleChange = (key, value) => {
        let newData = {}
        newData[key] = value

        switch (key) {
            case 'dataInfo':
                if (value.length) {
                    if (code === MODULE.TASK) {
                        const project = value[0]
                        const found = approveData.find(e => e._id === project.projectId)
                        newData.name = (found && found._id !== project._id)
                            ? `Công việc ${project.name} trong dự án ${found ? found.name : project.projectId.name}`
                            : project.isProject
                                ? `Dự án ${project.name}`
                                : `Công việc ${project.name}`
                    }
                    else {
                        newData.name = value[0].name
                    }
                }
                break;
        }
        setLocalData({ ...localData, ...newData });
    };


    const isValid = () => {
        let err = {}, warning = ''
        if (!localData.dataInfo || !localData.dataInfo.length) err.dataInfo = true
        if (!localData.name || !localData.name.trim()) err.name = true
        if (!localData.approveGroup || !localData.approveGroup.length) err.approveGroup = true

        if (err.dataInfo) warning = `Bạn cần chọn ${label}`
        if (err.name) warning = 'Bạn cần nhập Tên phê duyệt'
        else if (err.approveGroup) warning = 'Bạn cần chọn Nhóm phê duyệt'

        setError(err)

        const valid = !Object.keys(err).length
        if (!valid) ToastCustom({ text: warning, type: 'danger' })
        return valid
    }

    const onSendApprove = () => {
        if (!isValid()) return
        let content = '', dynamicForm = '', groupInfo = []

        const approveGroup = localData.approveGroup[0] || {}
        const form = localData.form && localData.form[0]

        approveGroup.group.forEach(item => {
            groupInfo.push({
                order: item.order,
                person: item.person,
                approve: 0,
                reason: '',
            });
        });

        if (form) {
            content = form.content
            dynamicForm = form._id
        }

        const body = {
            approveGroup: approveGroup._id,
            clientId,
            collectionCode: code,
            content,
            convertMapping: "5d832729c252b2577006c5ab",
            dataInfo: Array.isArray(localData.dataInfo) && (localData.dataInfo && localData.dataInfo.length) > 0 ? localData.dataInfo[0] : localData.dataInfo,
            dynamicForm,
            field: _.get(localData, 'field[0]') || '',
            groupInfo,
            name: localData.name,
            subCode: localData.subCode,
        }
        console.log(body);
        onAddApprove(body)
    }

    return (
        <Container>
            <BackHeader
                navigation={navigation}
                title={title}
                rightHeader={
                    isLoading
                        ? <Spinner />
                        : <Icon active name="send" onPress={onSendApprove} style={{ color: '#fff' }} />
                }
            />

            <Content>
                <Item inlineLabel error={error.dataInfo}>
                    <Label>{label}</Label>
                    {params && params.item ?
                        <View style={{ justifyContent: 'center', flex: 1, marginRight: 10, minHeight: 45, justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Text>{params.item.name}</Text>
                        </View>
                        : <APISearch
                            single
                            query={props.query || { sort: '-createdAt' }}
                            API={api}
                            onSelectedItemObjectsChange={(value) => handleChange('dataInfo', value)}
                            selectedItems={_.get(localData, 'dataInfo[0]._id')}
                            getData={setApproveData}
                            customDislayKey={customDislayKey}
                        />
                    }
                    {/* <View style={{ marginTop: 2, marginRight: 5 }}>
                        <RenderInfo code={code} value={_.get(localData, 'dataInfo[0]')} />
                    </View> */}
                </Item>

                <Item inlineLabel error={error.name} >
                    <Label>Tên phê duyệt</Label>
                    <Input multiline value={localData.name} onChangeText={e => handleChange('name', e)} style={styles.input} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </Item>

                <Item inlineLabel error={error.approveGroup} >
                    <Label>Nhóm phê duyệt</Label>
                    <SingleAPISearch
                        query={{
                            filter: {
                                clientId,
                            }
                        }}
                        API={API_APPROVE_GROUP}
                        onSelectedItemObjectsChange={(value) => handleChange('approveGroup', value)}
                        selectedItems={_.get(localData, 'approveGroup[0]._id')}

                    />
                </Item>

                <Item inlineLabel error={error.subCode} >
                    <Label>Tên quy trình</Label>
                    <Input value={localData.subCode} onChangeText={e => handleChange('subCode', e)} style={styles.input} />
                    <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
                </Item>

                <Item inlineLabel error={error.field} >
                    <Label>Trường phê duyệt</Label>
                    <SingleAPISearch
                        query={{ filter: { code } }}
                        API={API_FIELD}
                        onSelectedItemsChange={(value) => handleChange('field', value)}
                        selectedItems={localData.field}
                    />
                </Item>

                <Item inlineLabel error={error.form} >
                    <Label>Biểu mẫu phê duyệt</Label>
                    <SingleAPISearch
                        displayKey='title'
                        query={{ clientId, moduleCode: code }}
                        API={API_DYNAMIC_FORM}
                        onSelectedItemObjectsChange={(value) => handleChange('form', value)}
                        selectedItems={_.get(localData, 'form[0]._id')}
                    />
                </Item>

            </Content>
        </Container>
    );
}

const mapStateToProps = createStructuredSelector({
    addApprovePage: makeSelectAddApproveProject(),
    clientId: makeSelectClientId(),
});

function mapDispatchToProps(dispatch) {
    return {
        onAddApprove: (data) => dispatch(addApprove(data)),
        onCleanUp: () => dispatch(cleanup()),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(DaysOffBoardApproveTemplate);

const styles = {
    input: {
        textAlign: 'right',
        marginRight: 5,
        minHeight: 45
    }
}