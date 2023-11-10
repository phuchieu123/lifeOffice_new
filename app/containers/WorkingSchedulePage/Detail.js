import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Text, View, ScrollView, TextInput, BackHandler } from 'react-native';
import { compose } from 'redux';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import FabLayout from '../../components/CustomFab/FabLayout';
import { Header, Container, Card, CardItem, Item, Icon, Form, Label, Input, Button, Textarea, Right, Tabs, TabHeading, Tab } from 'native-base';
import ToastCustom from '../../components/ToastCustom';
import * as actions from './actions';
import _ from 'lodash';
import makeSelectMeetingSchedulePage from './selectors';
import BackHeader from '../../components/Header/BackHeader';
import FileView from '../../components/FileView';
import { MODULE, REQUEST_METHOD } from '../../utils/constants';
import { makeSelectUserRole, makeSelectViewConfig, makeSelectProfile } from '../App/selectors'
import DocumentPicker from 'react-native-document-picker'
import { addFile } from '../../api/fileSystem';
import CalenderForm from './components/CalenderForm';
import { get } from '../../api/metting';

export function MeetingScheduleDetailPage(props) {
    useInjectReducer({ key: 'workingSchedulePage', reducer });
    useInjectSaga({ key: 'workingSchedulePage', saga });

    const { navigation, route } = props;
    const { params } = route

    const [localData, setLocaldata] = useState({})
    const [reload, setReload] = useState(0)
    const [loading, setLoading] = useState()
    const [body, setBody] = useState({
        method: REQUEST_METHOD.POST,
        body: {
            action: "read",
            data: [],
            path: "/",
            showHiddenItems: false,
        },
    })

    const id = _.get(params, 'item._id')

    useEffect(() => {
        if (id) {
            setLoading(true)
            get(id).then(res => {
                setLocaldata(res)
                setLoading(false)
            })
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

    const handleReload = () => setReload(reload + 1)

    const handleAddFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })
            await addFile({ folder: "users", clientId: '20_CRM', path: body.body.path, code: 'Calendar', file: res[0], id, fname: 'root' })
            ToastCustom({ text: 'Thêm mới thành công', type: 'success' })
            handleReload()
        } catch (err) {
            ToastCustom({ text: 'Thêm mới không thành công', type: 'danger' })
        }
    }

    return (
        <Container>
            <BackHeader
                title={id ? localData.name : 'Thêm mới lịch công tác'}
                navigation={navigation}
            />
            {!id
                ? <CalenderForm />
                : <Tabs>
                    <Tab
                        heading={
                            <TabHeading>
                                <Text style={{ color: '#fff', fontWeight: '700' }}>Chi Tiết</Text>
                            </TabHeading>
                        }>
                        <CalenderForm id={id} meeting={localData} loading={loading} />
                    </Tab>
                    <Tab
                        heading={
                            <TabHeading>
                                <Text style={{ color: '#fff', fontWeight: '700' }}>Tài Liệu</Text>
                            </TabHeading>
                        }>
                        <FileView id={id} code={'Calendar'} visible={true} reload={reload} />
                        <FabLayout onPress={() => loading ? "" : handleAddFile()}>
                            <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
                        </FabLayout>
                    </Tab>
                </Tabs>
            }
        </Container >
    );
}

const mapStateToProps = createStructuredSelector({
    meetingDetailPage: makeSelectMeetingSchedulePage(),
    calendarConfig: makeSelectViewConfig(MODULE.CALENDAR),
    calenderRole: makeSelectUserRole(MODULE.CALENDAR),
    profile: makeSelectProfile(),
});

function mapDispatchToProps(dispatch) {
    return {
        mapMeeting: (props) => dispatch(actions.getMeetingSchelude(props)),
        onClean: () => dispatch(actions.onClean()),
    };

}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(MeetingScheduleDetailPage);