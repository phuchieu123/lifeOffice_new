import React, {memo, useEffect, useState} from 'react';
import { View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import {connect} from 'react-redux';
import {compose} from 'redux';
import {createStructuredSelector} from 'reselect';
import {useInjectReducer} from '../../utils/injectReducer';
import {useInjectSaga} from '../../utils/injectSaga';
import {navigate} from '../../RootNavigation';
import {getTaskById} from '../../api/tasks.js';
import BackHeader from '../../components/Header/BackHeader';
import ToastCustom from '../../components/ToastCustom';
import {makeSelectClientId} from '../App/selectors';
import DetailTab from './Tabs/DetailTab';
import {DocumentTab} from './Tabs/DocumentTab';
import ProcessTab from './Tabs/ProcessTab';
import {
  changeTransferType,
  cleanup,
  getProject,
  getProjectFiles,
  getProjectTransfer,
  updateProject,
  updateProjectProgress,
  updateTransfer,
  uploadFile,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectProjectDetailPage from './selectors';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator;
// import { makeSelectRoleDepartmentBos, makeSelectUserRoleTask } from '../App/selectors';
export function ProjectDetailPage(props) {
  useInjectReducer({key: 'projectDetailPage', reducer});
  useInjectSaga({key: 'projectDetailPage', saga});

  const {
    navigation,
    route,
    projectDetailPage,
    onUpdateProject,
    onUpdateProjectProgress,
    onUploadFile,
  } = props;

  const {isLoadingTranfer, projectFiles, projects} = projectDetailPage;

  const [projectDetail, setProjectDetail] = useState({});
  const [id, setID] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const backHandlerListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true;
      },
    );
    return () => {
      backHandlerListener.remove();
    };
  }, []);

  const getData = async () => {
    try {
      const {project} = route.params;
      if (project && project._id) {
        const res = await getTaskById(project._id);
        setID(project._id);
        if (res._id) setProjectDetail(res);
        else {
          ToastCustom({text: 'Có lỗi xảy ra', type: 'danger'});
          navigation.goBack();
        }
      }
    } catch (error) {
      ToastCustom({text: 'Có lỗi xảy ra', type: 'danger'});
      navigation.goBack();
    }
    setIsLoading(false);
  };

  return (
    <View>
      <BackHeader
        title={projectDetail && projectDetail.name}
        navigation={navigation}
        rightHeader={
          <Icon
            style={{color: 'white'}}
            name="checklist"
            type="Octicons"
            onPress={() => navigate('AddApproveProject', {item: projectDetail})}
          />
        }
      />
      <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: 'rgba(46, 149, 46, 1)', // Màu nền của toàn bộ thanh tab
            borderTopWidth: 0.5,
            borderTopColor: '#aaa',
          },
          activeTintColor: 'white', // Màu chữ của tab đang được chọn
          inactiveTintColor: 'white', // Màu chữ của tab không được chọn
          indicatorStyle: {
            backgroundColor: 'white', // Màu của thanh dưới chữ khi tab được chọn
          },
        }}>
        <Tab.Screen
          name="Chi tiết"
          component={() => {
            return (
              <DetailTab
                projectDetail={projectDetail || {}}
                projectFiles={projectFiles || {}}
                isLoading={isLoading}
                onUpdateProject={onUpdateProject}
                onUploadFile={onUploadFile}
                id={id || {}}
                navigation={navigation}
              />
            );
          }}
        />
        <Tab.Screen
          name="Tiến độ"
          component={() => {
            return (
              <ProcessTab
                projectDetail={projectDetail || {}}
                projects={projects || []}
                isLoading={isLoading}
                onUpdateProjectProgress={onUpdateProjectProgress}
                navigation={navigation}
              />
            );
          }}
        />

        {/* <Tab
          heading={
            <TabHeading>
              <Text>Hợp Đồng</Text>
            </TabHeading>
          }>
          <ContractTab projectDetail={projectDetail || {}} />
        </Tab> */}
        <Tab.Screen
          name="tài liệu"
          component={() => {
            return <DocumentTab projectDetail={projectDetail || {}} clientId />;
          }}
        />

        {/* <Tab
          heading={
            <TabHeading>
              <Text>Phê duyệt</Text>
            </TabHeading>
          }>
          <ApprovedTab projectDetail={projectDetail || {}} isLoading={false} onUpdateProject={onUpdateProject} isBusy={isBusy}/>
        </Tab> */}
        {/* <Tab
          heading={
            <TabHeading>
              <Text>Chuyển việc</Text>
            </TabHeading>
          }>
          <TransferWorkTab
            projectDetail={projectDetail || {}}
            projectTransfer={projectTransfer || []}
            isLoading={isLoading}
            transferType={transferType}
            onUpdateTransfer={onUpdateTransfer}
            setTransferType={setTransferType}
            isBusy={isBusy}
            employeesOption={employeesOption}
          />
        </Tab> */}
      </Tab.Navigator>
    </View>
  );
}

const mapStateToProps = createStructuredSelector({
  projectDetailPage: makeSelectProjectDetailPage(),
  clientId: makeSelectClientId(),
  // userRoleTask: makeSelectUserRoleTask(),
  // roleDepartmentBos: makeSelectRoleDepartmentBos(),
});

function mapDispatchToProps(dispatch) {
  return {
    onUpdateProject: project => dispatch(updateProject(project)),
    onUpdateProjectProgress: progress =>
      dispatch(updateProjectProgress(progress)),
    onUpdateTransfer: data => dispatch(updateTransfer(data)),
    onUploadFile: data => dispatch(uploadFile(data)),
    onGetProjectDetail: project => dispatch(getProject(project)),
    onGetProjectTranfer: id => dispatch(getProjectTransfer(id)),
    onGetProjectFiles: id => dispatch(getProjectFiles(id)),
    onCleanup: () => dispatch(cleanup()),
    onChangeTransferType: index => dispatch(changeTransferType(index)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect, memo)(ProjectDetailPage);
