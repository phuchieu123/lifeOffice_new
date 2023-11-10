import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { Modal, StyleSheet, Alert, Dimensions, Touchable, TouchableOpacity, DeviceEventEmitter } from 'react-native';
import moment from 'moment';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import makeSelectApprovePage from './selectors';
import reducer from './reducer';
import saga from './saga';
import { getApprove, updateApprove, cleanup } from './actions';
import { getProfile, getAppInfo } from '../../utils/authen';
import {
    Text,
    Container,
    CardItem,
    View,
    Button,
    Right,
    Tab,
    TabHeading,
    Tabs,
    ScrollableTab,
    Textarea,
    Body,
    Accordion,
    ListItem,
    Icon,
    Card,
    Title,
    Label,
    Item
} from 'native-base';
import BackHeader from '../../components/Header/BackHeader';
import { makeSelectClientId, makeSelectProfile, makeSelectViewConfig } from '../App/selectors';
import { MODULE } from '../../utils/constants';
import { getById, update } from '../../api/approve';
import LoadingLayout from '../../components/LoadingLayout';
import customTheme from '../../utils/customTheme';
import _ from 'lodash';
import { convertLabel } from '../../utils/common';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import { API_CUSTOMER } from '../../configs/Paths';
import { navigate } from '../../RootNavigation';
import ToastCustom from '../../components/ToastCustom';

const ApproveDetailPage = props => {
    const { navigation, route, onUpdateApprove, onCleanup, approvePage, clientId, profile } = props
    const { taskConfig, bosConfig } = props
    const { params } = route || {}

    const [showReason, setShowReason] = useState();
    const [approve, setApprove] = useState(params.approve || {});
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(params.approveId ? true : false);

    useEffect(() => {
        if (params.approve) getData()

        return () => {
            onCleanup()
        }
    }, [])

    useEffect(() => {
        if (approve && profile && Array.isArray(approve.groupInfo)) {
            const data = approve.groupInfo.find((person) => person.person === profile.userId);
            data && data.approve === 0 && setShowReason(true);
        }
    }, [approve, profile])

    const getData = async () => {
        const res = await getById(params.approve._id)
        if (res._id) {
            setApprove(res)
            setIsLoading(false)
        } else navigation.goBack()
    }

    const checkValidUser = (item) => {
        if (item.groupInfo && profile) {
            const approveTurn = item.groupInfo.find((d) => d.order === item.approveIndex);

            if (approveTurn && profile.userId === approveTurn.person && approveTurn.approve === 0) {
                return true;
            }
        }

        return false;
    };

    const checkValidApprove = (approveStatus) => {
        if (!reason || !reason.trim()) {
            Alert.alert(
                'Thông báo',
                'Bạn chưa nhập lý do. Tiếp tục phê duyệt?',
                [
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => handleUpdateApprove(approveStatus),
                    },
                ],
                { cancelable: false },
            );
        } else handleUpdateApprove(approveStatus);
    };

    const handleUpdateApprove = async (approveStatus) => {
        const data = {
            reason: reason,
            approveCommand: approveStatus,
            clientId,
        };
        const res = await update(approve._id, data)
        console.log(res, "resssss");
        if (res.status === 1) {
            DeviceEventEmitter.emit('approveSuccess', { approveStatus })
            ToastCustom({ text: 'Phê duyệt thành công', type: 'success' })
            navigation.goBack()
        } else {
            ToastCustom({ text: 'Phê duyệt không thành công', type: 'danger' })
        }
        // onUpdateApprove(approve, data);
    };

    const getInfo = () => {
        if (approve.collectionCode === MODULE.TASK) navigation.navigate('ProjectDetail', { project: { _id: approve.dataInfo._id } });
        if (approve.collectionCode === MODULE.BOS) navigation.navigate('BusinessOpDetail', { businessOp: approve.dataInfo });
    }

    function renderInfomation() {
        let view;
        switch (approve.collectionCode) {
            case MODULE.TASK:
            case MODULE.BOS:
                return view = (
                    <Card>
                        <Accordion
                            dataArray={['ThongTinChiTiet']}
                            renderHeader={(key) => {
                                return (
                                    <CardItem key={key} bordered>
                                        <Body style={{ flex: 1 }}>
                                            <Text>
                                                Thông tin chi tiết
                                            </Text>
                                        </Body>
                                        <Right style={{ width: 200 }}>
                                            <Icon name='chevron-down' type='Entypo' />
                                        </Right>
                                    </CardItem>
                                );
                            }}
                            renderContent={() => <RenderContent moduleCode={approve.collectionCode} data={approve.dataInfo} taskConfig={taskConfig} bosConfig={bosConfig} />}
                            expanded={[0]}
                        />
                    </Card>
                )
            case MODULE.TAKE_LEAVE:
                return view = (
                    <Card>
                        <Accordion
                            dataArray={['ThongTinChiTiet']}
                            renderHeader={(key) => {
                                return (
                                    <CardItem key={key} bordered>
                                        <Body style={{ flex: 1 }}>
                                            <Text>
                                                Thông tin chi tiết
                                            </Text>
                                        </Body>
                                        <Right style={{ width: 200 }}>
                                            <Icon name='chevron-down' type='Entypo' />
                                        </Right>
                                    </CardItem>
                                );
                            }}
                            renderContent={() => <RenderContentOther data={approve.dataInfo} />}
                            expanded={[0]}
                        />
                    </Card>
                )
            default:
                break;
        }

        return view;
    }

    return <Container>
        <BackHeader navigation={navigation} title="Thông tin phê duyệt" />
        <Container padder style={styles.modalView}>
            <LoadingLayout isLoading={isLoading}>
                {renderInfomation()}

                <Card>
                    {!Array.isArray(approve.groupInfo) ? null : (
                        <Accordion
                            dataArray={approve.groupInfo}
                            renderHeader={(person) => {
                                return (
                                    <CardItem key={person._id} bordered>
                                        <Body style={{ flex: 1 }}>
                                            {profile && <Text>
                                                {Number(person.order) + 1}. {person.person === profile.userId ? profile.name : person.name}
                                            </Text>}
                                        </Body>
                                        <Right style={{ width: 200 }}>
                                            <Text>
                                                {person.approve === 0 && 'Chờ phê duyệt'}
                                                {person.approve === 1 && 'Đã phê duyệt'}
                                                {person.approve === 2 && 'Không phê duyệt'}
                                            </Text>
                                        </Right>
                                    </CardItem>
                                );
                            }}
                            renderContent={(item) => {
                                return !item.approve ? null :
                                    <Text style={{ paddingVertical: 10, paddingHorizontal: 20, color: 'gray' }}>
                                        Lý do: {item.reason}
                                    </Text>
                            }}
                            expanded={[]}
                        />
                    )}
                </Card>

                {showReason ? <Textarea value={reason} onChangeText={setReason} bordered placeholder="Nhập lý do" rowSpan={5} /> : null}
                <View style={{ height: 100, flexDirection: 'column' }}>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 20, paddingHorizontal: 10 }}>
                        {checkValidUser(approve) && (
                            <>
                                <Button
                                    // small
                                    style={{ flex: 1, marginRight: 10 }}
                                    rounded
                                    block
                                    onPress={() => checkValidApprove(1)}>
                                    <Text>Phê duyệt</Text>
                                </Button>
                                <Button
                                    // small
                                    danger
                                    style={{ flex: 1, marginLeft: 10 }}
                                    rounded
                                    block
                                    onPress={() => checkValidApprove(2)}>
                                    <Text>Không phê duyệt</Text>
                                </Button>
                            </>
                        )}
                    </View>
                </View>
            </LoadingLayout>
        </Container>
    </Container >
}


const mapStateToProps = createStructuredSelector({
    approvePage: makeSelectApprovePage(),
    clientId: makeSelectClientId(),
    taskConfig: makeSelectViewConfig(MODULE.TASK),
    bosConfig: makeSelectViewConfig(MODULE.BOS),
    profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
    return {
        onGetApprove: () => dispatch(getApprove()),
        onUpdateApprove: (approve, data) => dispatch(updateApprove(approve, data)),
        onCleanup: () => dispatch(cleanup()),
    };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(ApproveDetailPage);

const styles = {
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        //alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        backgroundColor: 'white',
        //borderRadius: 20,
        padding: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
};

const RenderContentOther = (props) => {
    const { data } = props;
    const contentData = data[0] ? data[0] : data;
    return (
        <View style={{ marginHorizontal: 15 }}>
            <Label>Tên người tạo: {contentData.createdByName}</Label>
            <Label>Ngày nghỉ phép: {moment(contentData.date).format("DD/MM/YYYY")}</Label>
            <Label>Lý do nghỉ: {contentData.reason}</Label>
            <Label>Phòng ban: {contentData.organizationUnit}</Label>
            <Label>Loại nghỉ phép: {contentData && contentData.type && contentData.type.title}</Label>
        </View>
    )
}

const RenderContent = (props) => {
    const { moduleCode } = props
    const { taskConfig, bosConfig } = props
    const data = _.has(props, 'data._id') ? props.data : _.get(props, 'data', []).length === 1 ? props.data[0] : null
    const getInfo = () => {
        if (moduleCode === MODULE.TASK) navigate('ProjectDetail', { project: data });
        if (moduleCode === MODULE.BOS) navigate('BusinessOpDetail', { businessOp: data });
    }


    if (!data) return null
    else
        switch (moduleCode) {
            case MODULE.TASK:
                return <View style={{ marginHorizontal: 15 }}>
                    <Label>{(_.get(taskConfig, 'name.title')) || 'Tên CV/DA'}: {data.name}</Label>
                    <Label>{(_.get(taskConfig, 'progress.title')) || 'Tiến độ'}: {data.progress}</Label>
                    <Label>{(_.get(taskConfig, 'description.title')) || 'Mô tả'}: {data.description}</Label>
                    <Label>{(_.get(taskConfig, 'level.title')) || 'Cấp độ'}: {data.level}</Label>
                    {/* <Label>{(_.get(taskConfig, 'category.title')) || 'Loại'}: {data.category}</Label> */}
                    <Label>{(_.get(taskConfig, 'priority.title')) || 'Độ ưu tiên'}: {data.priority}</Label>
                    {/* <Label>{(_.get(taskConfig, 'contractCode.title')) || 'Mã hợp đồng'}: {data.contractCode}</Label> */}
                    <Label>{(_.get(taskConfig, 'startDate.title')) || 'Ngày bắt đầu'}: {moment(data.startDate).format('DD-MM-YYYY')}</Label>
                    <Label>{(_.get(taskConfig, 'endDate.title')) || 'Ngày kêt thúc'}: {moment(data.endDate).format('DD-MM-YYYY')}</Label>
                    <Label>{(_.get(taskConfig, 'duration.title')) || 'Thời hạn'}: {data.duration}</Label>
                    {/* <Label>{(_.get(taskConfig, 'inCharge.title')) || 'Người phụ trách'}: {data.inCharge}</Label> */}
                    {/* <Label>{(_.get(taskConfig, 'support.title')) || 'Hỗ trợ'}: {data.support}</Label> */}
                    {/* <Label>{(_.get(taskConfig, 'join.title')) || 'Người tham gia'}: {data.join}</Label> */}
                    {/* <Label>{convertLabel(_.get(taskConfig, 'organizationUnit.title')) || 'Phòng ban'}: {data.organizationUnit}</Label> */}
                    {/* <Label>{convertLabel(_.get(taskConfig, 'planerStatus.title')) || 'Trạng thái kế hoạch'}: {data.planerStatus}</Label>
                <Label>{convertLabel(_.get(taskConfig, 'taskStatus.title')) || 'Trạng thái cv/da'}: {data.taskStatus}</Label> */}
                    {/* <Label>{(_.get(taskConfig, 'customer.title')) || 'Khách hàng'}: {data.customer}</Label> */}
                    {/* {(_.get(taskConfig, 'name.checkShowForm') && _.has(data, 'name')) ? <Text note>{_.get(taskConfig, 'name.title', '')}: {data.name}</Text> : null}
                {(_.get(taskConfig, 'name.checkShowForm') && _.has(data, 'name')) ? <Text note>{_.get(taskConfig, 'name.title', '')}: {data.name}</Text> : null}
                {(_.get(taskConfig, 'name.checkShowForm') && _.has(data, 'name')) ? <Text note>{_.get(taskConfig, 'name.title', '')}: {data.name}</Text> : null}
                {(_.get(taskConfig, 'name.checkShowForm') && _.has(data, 'name')) ? <Text note>{_.get(taskConfig, 'name.title', '')}: {data.name}</Text> : null}
                {(_.get(taskConfig, 'name.checkShowForm') && _.has(data, 'name')) ? <Text note>{_.get(taskConfig, 'name.title', '')}: {data.name}</Text> : null}
                {(_.get(taskConfig, 'name.checkShowForm') && _.has(data, 'name')) ? <Text note>{_.get(taskConfig, 'name.title', '')}: {data.name}</Text> : null}
                {(_.get(taskConfig, 'name.checkShowForm') && _.has(data, 'name')) ? <Text note>{_.get(taskConfig, 'name.title', '')}: {data.name}</Text> : null}
                {(_.get(taskConfig, 'name.checkShowForm') && _.has(data, 'name')) ? <Text note>{_.get(taskConfig, 'name.title', '')}: {data.name}</Text> : null}
                {(_.get(taskConfig, 'name.checkShowForm') && _.has(data, 'name')) ? <Text note>{_.get(taskConfig, 'name.title', '')}: {data.name}</Text> : null}
                {(_.get(taskConfig, 'name.checkShowForm') && _.has(data, 'name')) ? <Text note>{_.get(taskConfig, 'name.title', '')}: {data.name}</Text> : null} */}
                    {/* <TouchableOpacity onPress={getInfo} style={{ alignSelf: 'flex-end', flexDirection: 'row', height: 45, alignItems: 'center' }}>
                        <Text style={{ color: customTheme.brandPrimary }}>Thông tin chi tiết</Text>
                    </TouchableOpacity> */}
                </View>
        }
}