import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from '../../RootNavigation';
import LoginPage from '../LoginPage';
import AdminStackScreen from './adminStack';
// import SplashScreen from '../SplashScreen';
import LoadingScreen from './LoadingScreen'
import KanbanProjectPage from '../KanbanProjectPage';
import AddProjectPage from '../AddProjectPage';
import ProjectDetailPage from '../ProjectDetailPage';
import ChildProjectPage from '../ProjectPage/ChildProjectPage';
import BusinessOpDetailPage from '../BusinessOpDetailPage';
import DashBoardPage from '../DashBoardPage';
import PersonnelPage from '../PersonnelPage';
import NotificationPage from '../NotificationPage';
import ApprovePage from '../ApprovePage';
import ApproveDetailPage from '../ApprovePage/Detail';
import TimeKeepingPage from '../TimeKeepingPage';
import TimeKeepingHistoryPage from '../TimeKeepingPage/TimeKeepingHistoryPage';
import VerifyTimeKeepingHistoryPage from '../TimeKeepingPage/VerifyTimeKeepingHistoryPage';
import FailureTimeKeepingHistoryPage from '../TimeKeepingPage/FailureTimeKeepingHistoryPage';
import TimeKeepingBoardPage from '../TimeKeepingPage/TimeKeepingBoardPage';
import OvertimePage from '../TimeKeepingPage/OvertimePage';
import AddOvertimePage from '../TimeKeepingPage/components/AddOvertimePage';
import DaysOffBoardPage from '../TimeKeepingPage/DaysOffBoardPage';
import TimeKeepingTable from '../TimeKeepingPage/TimeKeepingTable';
import HrmReportPage from '../HrmReportPage';
import TimeKeepingReportPage from '../TimeKeepingReportPage';
import TimeKeepingChart from '../TimeKeepingReportPage/TimeKeepingChart';
import EquipmentChart from '../TimeKeepingReportPage/EquipmentChart';
import LateEarlyChart from '../TimeKeepingReportPage/LateEarlyChart';
import NoTimeKeepingChart from '../TimeKeepingReportPage/NoTimeKeepingChart';
import EmployeeReportPage from '../EmployeeReportPage';
import EmployeeAgeChart from '../EmployeeReportPage/EmployeeAgeChart';
import EmployeeBirthChart from '../EmployeeReportPage/EmployeeBirthChart';
import EmployeeContractChart from '../EmployeeReportPage/EmployeeContractChart';
import EmployeeGenderChart from '../EmployeeReportPage/EmployeeGenderChart';
import EmployeeSkillChart from '../EmployeeReportPage/EmployeeSkillChart';
import EmployeeSituationChart from '../EmployeeReportPage/EmployeeSituationChart';
import AddApprovePage from '../AddApprovePage';
import AddApproveContract from '../AddApprovePage/AddApproveContract';
import AddApproveDocumentary from '../AddApprovePage/AddApproveDocumentary';
import AddApproveOverTime from '../AddApprovePage/AddApproveOverTime';
import AddApprovePrice from '../AddApprovePage/AddApprovePrice';
import AddApproveProject from '../AddApprovePage/AddApproveProject';
import AddApproveSalaryAdvance from '../AddApprovePage/AddApproveSalaryAdvance';
import AddApproveTakeLeave from '../AddApprovePage/AddApproveTakeLeave';
import AddApproveWorkOut from '../AddApprovePage/AddApproveWorkOut';
import LifeDriver from '../LifeDriver';
import TextManagement from '../TextManagement';
import TextDetail from '../TextManagement/TextDetail';
import TextComplete from '../TextManagement/TextComplete';
import TextOpinion from '../TextManagement/TextOpinion';
import CreateNewDetail from '../MeetingSchedulePage/CreateNewDetail';
import Message from '../Message';
import LifetekTab from '../LifetekPage';
import TaskInvite from '../TaskInvite';
import DetailsOfficialDispatch from '../Officialdispatch/Detail';
import Officialdispatch from '../Officialdispatch';
import MeetingSchedulePage from '../MeetingSchedulePage';
import MeetingScheduleDatailPage from '../MeetingSchedulePage/MeetingScheduleDatailPage';
import WorkingSchedulePage from '../WorkingSchedulePage';
import WorkingScheduleDetailPage from '../WorkingSchedulePage/Detail';
import MessageChat from '../Message/Chat';
import SettingPage from '../SettingPage';
import CreateWorkingSchedule from '../WorkingSchedulePage/CreateWorkingSchedule';
import InTernalFinance from '../InTernalFinance';
import ContractDetails from '../ContractDetails';
import PDFViewer from '../PDFViewer';
import ViewScreenImg from '../ViewScreenImg';
import CustomerDetails from '../CustomerDetails';
import AddCustomer from '../CustomerDetails/add';
import CreatDocumentary from '../Officialdispatch/CreatDocumentary';
import DetailsPersonnel from '../PersonnelPage/DetailsPersonnel';
import UpdatePersonnel from '../PersonnelPage/UpdatePersonnel';
import AddPersonnel from '../PersonnelPage/AddPersonnel';
import ListFilePersonnel from '../PersonnelPage/ListFilePersonnel';
import RenderPagePersonnel from '../PersonnelPage/RenderPagePersonnel';
// import CheckTheFace from '../CheckTheFace';
import SmallJob from '../ProjectPage/SmallJob';
import ScannerPage from '../LifeDriver/ScannerPage';
import DetailContent from '../Officialdispatch/DetailContent';
import FingerprintUser from '../DashBoardPage/FingerprintUser';
import FillterDepartment from '../EmployeeReportPage/FillterDepartment';
import SalaryPage from '../SalaryPage';
import SalaryPageDetail from '../SalaryPage/Detail';
import HrmSalaryPage from '../HrmSalaryPage';
import HrmSalaryPageDetail from '../HrmSalaryPage/Detail';
import QuoteSell from '../BusinessOpDetailPage/QuoteSell';
import renDerQuoteSell from '../BusinessOpDetailPage/renDerQuoteSell';
import BusinessContract from '../BusinessOpDetailPage/BusinessContract';
import CallPage from '../CallPage';
import ReceiveCallPage from '../CallPage/ReceiveCallPage';
import HrmNewSalaryPage from '../HrmNewSalaryPage';
import NewDaysOffBoardPage from '../TimeKeepingPage/components/NewDaysOffBoardPage';
import AddTimeKeepingTablePage from '../TimeKeepingPage/components/AddTimeKeepingTablePage';
import AddApproveDaysOffBoardPage from '../TimeKeepingPage/components/AddApproveDaysOffBoardPage';
import DetailsDaysOffBoardPage from '../TimeKeepingPage/components/DetailsDaysOffBoardPage';
import EmployeeSeniorityChart from '../EmployeeReportPage/EmployeeSeniorityChart';
import SeniorityReport from '../EmployeeReportPage/SeniorityReport';
import MyCall from '../CallPage/MyCall';
import OrgReport from '../EmployeeReportPage/OrgReport';
import RecCostReport from '../EmployeeReportPage/RecCostReport';
import EmployeeWordChart from '../EmployeeReportPage/EmployeeWordChart';
import EmployeePositionChart from '../EmployeeReportPage/EmployeePositionChart';
import Sign from '../TextManagement/components/Sign';





const AppStack = createStackNavigator();
export default Navigator = ({ isLoggedIn }) => {
    return <NavigationContainer ref={navigationRef}>
        <AppStack.Navigator
            initialRouteName="LoadingScreen"
            screenOptions={{ headerShown: false, gestureEnabled: false }}
        >
            <AppStack.Screen name="LoadingScreen" component={LoadingScreen} />
            <AppStack.Screen name="Login" component={LoginPage} />
            <AppStack.Screen name="LifetekTab" component={LifetekTab} />
            {/* <AppStack.Screen name="CallPage" component={CallPage} /> */}
            {/* <AppStack.Screen name="ReceiveCallPage" component={ReceiveCallPage} /> */}
            {isLoggedIn &&
                <>
                    <AppStack.Screen name="App" component={AdminStackScreen} />
                    <AppStack.Screen name="DashBoard" component={DashBoardPage} />
                    <AppStack.Screen name="Personnel" component={PersonnelPage} />
                    <AppStack.Screen name="BusinessOpDetail" component={BusinessOpDetailPage} />
                    <AppStack.Screen name="KanbanProject" component={KanbanProjectPage} />
                    <AppStack.Screen name="AddProject" component={AddProjectPage} />
                    <AppStack.Screen name="ProjectDetail" component={ProjectDetailPage} />
                    <AppStack.Screen name="ChildProjectPage" component={ChildProjectPage} />
                    <AppStack.Screen name="Approve" component={ApprovePage} />
                    <AppStack.Screen name="ApproveDetail" component={ApproveDetailPage} />
                    <AppStack.Screen name="TimeKeepingPage" component={TimeKeepingPage} />
                    <AppStack.Screen name="TimeKeepingTable" component={TimeKeepingTable} />
                    <AppStack.Screen name="TimeKeepingHistoryPage" component={TimeKeepingHistoryPage} />
                    <AppStack.Screen name="VerifyTimeKeepingHistoryPage" component={VerifyTimeKeepingHistoryPage} />
                    <AppStack.Screen name="FailureTimeKeepingHistoryPage" component={FailureTimeKeepingHistoryPage} />
                    <AppStack.Screen name="OvertimePage" component={OvertimePage} />
                    <AppStack.Screen name="AddOvertimePage" component={AddOvertimePage} />
                    <AppStack.Screen name="TimeKeepingBoardPage" component={TimeKeepingBoardPage} />
                    <AppStack.Screen name="DaysOffBoardPage" component={DaysOffBoardPage} />
                    <AppStack.Screen name="HrmReportPage" component={HrmReportPage} />
                    <AppStack.Screen name="TimeKeepingReportPage" component={TimeKeepingReportPage} />
                    <AppStack.Screen name="TimeKeepingChart" component={TimeKeepingChart} />
                    <AppStack.Screen name="EquipmentChart" component={EquipmentChart} />
                    <AppStack.Screen name="LateEarlyChart" component={LateEarlyChart} />
                    <AppStack.Screen name="NoTimeKeepingChart" component={NoTimeKeepingChart} />
                    <AppStack.Screen name="EmployeeReportPage" component={EmployeeReportPage} />
                    <AppStack.Screen name="EmployeeAgeChart" component={EmployeeAgeChart} />
                    <AppStack.Screen name="EmployeeBirthChart" component={EmployeeBirthChart} />
                    <AppStack.Screen name="EmployeeContractChart" component={EmployeeContractChart} />
                    <AppStack.Screen name="EmployeeGenderChart" component={EmployeeGenderChart} />
                    <AppStack.Screen name="EmployeeSkillChart" component={EmployeeSkillChart} />
                    <AppStack.Screen name="EmployeeSituationChart" component={EmployeeSituationChart} />
                    <AppStack.Screen name="AddApprovePage" component={AddApprovePage} />
                    <AppStack.Screen name="AddApproveSalaryAdvance" component={AddApproveSalaryAdvance} />
                    <AppStack.Screen name="AddApproveOverTime" component={AddApproveOverTime} />
                    <AppStack.Screen name="AddApproveWorkOut" component={AddApproveWorkOut} />
                    <AppStack.Screen name="AddApproveTakeLeave" component={AddApproveTakeLeave} />
                    <AppStack.Screen name="AddApproveProject" component={AddApproveProject} />
                    <AppStack.Screen name="AddApprovePrice" component={AddApprovePrice} />
                    <AppStack.Screen name="AddApproveContract" component={AddApproveContract} />
                    <AppStack.Screen name="AddApproveDocumentary" component={AddApproveDocumentary} />
                    <AppStack.Screen name="LifeDriver" component={LifeDriver} />
                    <AppStack.Screen name="TextManagement" component={TextManagement} />
                    <AppStack.Screen name="TextDetail" component={TextDetail} />
                    <AppStack.Screen name="TextComplete" component={TextComplete} />
                    <AppStack.Screen name="TextOpinion" component={TextOpinion} />
                    <AppStack.Screen name="Message" component={Message} />
                    <AppStack.Screen name="NotificationPage" component={NotificationPage} />
                    <AppStack.Screen name="MeetingSchedulePage" component={MeetingSchedulePage} />
                    <AppStack.Screen name="MeetingScheduleDatailPage" component={MeetingScheduleDatailPage} />
                    <AppStack.Screen name="WorkingSchedulePage" component={WorkingSchedulePage} />
                    <AppStack.Screen name="WorkingScheduleDetailPage" component={WorkingScheduleDetailPage} />
                    <AppStack.Screen name="Officialdispatch" component={Officialdispatch} />
                    <AppStack.Screen name="DetailsOfficialDispatch" component={DetailsOfficialDispatch} />
                    <AppStack.Screen name="TaskInvite" component={TaskInvite} />
                    <AppStack.Screen name="MessageChat" component={MessageChat} />
                    <AppStack.Screen name="SettingPage" component={SettingPage} />
                    <AppStack.Screen name="CreateNewDetail" component={CreateNewDetail} />
                    <AppStack.Screen name="CreateWorkingSchedule" component={CreateWorkingSchedule} />
                    <AppStack.Screen name="InTernalFinance" component={InTernalFinance} />
                    <AppStack.Screen name="ContractDetails" component={ContractDetails} />
                    <AppStack.Screen name="PDFViewer" component={PDFViewer} />
                    <AppStack.Screen name="ViewScreenImg" component={ViewScreenImg} />
                    <AppStack.Screen name="CustomerDetails" component={CustomerDetails} />
                    <AppStack.Screen name="AddCustomer" component={AddCustomer} />
                    <AppStack.Screen name="CreatDocumentary" component={CreatDocumentary} />
                    <AppStack.Screen name="DetailsPersonnel" component={DetailsPersonnel} />
                    <AppStack.Screen name="UpdatePersonnel" component={UpdatePersonnel} />
                    <AppStack.Screen name="AddPersonnel" component={AddPersonnel} />
                    <AppStack.Screen name="ListFilePersonnel" component={ListFilePersonnel} />
                    <AppStack.Screen name="RenderPagePersonnel" component={RenderPagePersonnel} />
                    {/* <AppStack.Screen name="CheckTheFace" component={CheckTheFace} /> */}
                    <AppStack.Screen name="SmallJob" component={SmallJob} />
                    <AppStack.Screen name="ScannerPage" component={ScannerPage} />
                    <AppStack.Screen name="DetailContent" component={DetailContent} />
                    <AppStack.Screen name="FingerprintUser" component={FingerprintUser} />
                    <AppStack.Screen name="FillterDepartment" component={FillterDepartment} />
                    <AppStack.Screen name="HrmSalaryPage" component={HrmSalaryPage} />
                    <AppStack.Screen name="HrmSalaryPageDetail" component={HrmSalaryPageDetail} />
                    <AppStack.Screen name="SalaryPage" component={SalaryPage} />
                    <AppStack.Screen name="SalaryPageDetail" component={SalaryPageDetail} />
                    <AppStack.Screen name="QuoteSell" component={QuoteSell} />
                    <AppStack.Screen name="renDerQuoteSell" component={renDerQuoteSell} />
                    <AppStack.Screen name="BusinessContract" component={BusinessContract} />
                    <AppStack.Screen name="CallPage" component={CallPage} />
                    <AppStack.Screen name="ReceiveCallPage" component={ReceiveCallPage} />
                    <AppStack.Screen name="HrmNewSalaryPage" component={HrmNewSalaryPage} />
                    <AppStack.Screen name="NewDaysOffBoardPage" component={NewDaysOffBoardPage} />                   
                    <AppStack.Screen name="AddTimeKeepingTablePage" component={AddTimeKeepingTablePage} />
                    <AppStack.Screen name="AddApproveDaysOffBoardPage" component={AddApproveDaysOffBoardPage} />
                    <AppStack.Screen name="DetailsDaysOffBoardPage" component={DetailsDaysOffBoardPage} />
                    <AppStack.Screen name="EmployeeSeniorityChart" component={EmployeeSeniorityChart} />
                    <AppStack.Screen name="SeniorityReport" component={SeniorityReport} />
                    <AppStack.Screen name="MyCall" component={MyCall} />
                    <AppStack.Screen name="RecCostReport" component={RecCostReport} />
                    <AppStack.Screen name="OrgReport" component={OrgReport} />
                    <AppStack.Screen name="EmployeeWordChart" component={EmployeeWordChart} />
                    <AppStack.Screen name="EmployeePositionChart" component={EmployeePositionChart} />
                    <AppStack.Screen name="Sign" component={Sign} />

                </>
            }
        </AppStack.Navigator >
    </NavigationContainer >
}