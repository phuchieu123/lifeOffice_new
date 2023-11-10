/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * BusinessOpDetailPage
 *
 */

import React, { useEffect, useState } from 'react';
import { BackHandler, DeviceEventEmitter } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
// import DocumentPicker from 'react-native-document-picker';
import {
  Button,
  Container,
  Content,
  Icon,
  Input,
  Item,
  Label,
  Tab,
  TabHeading,
  Tabs,
  Text,
  View
} from 'native-base';
import { TouchableWithoutFeedback } from 'react-native';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import { navigate } from '../../RootNavigation';
import BackHeader from '../../components/Header/BackHeader';
import LoadingButton from '../../components/LoadingButton';
import LoadingLayout from '../../components/LoadingLayout';
import {
  API_CUSTOMER,
  API_USERS
} from '../../configs/Paths';
import { convertLabel } from '../../utils/common';
import { MODULE } from '../../utils/constants';
import { crmSourceCode, makeSelectKanbanBosConfigs, makeSelectViewConfig } from '../App/selectors';
import CustomerInfo from './CustomerInfo';
import * as actions from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectBusinessOpDetailPage from './selectors';

import ToastCustom from '../../components/ToastCustom';
import _ from 'lodash';
import theme from '../../utils/customTheme';
import MultiAPISearch from '../../components/CustomMultiSelect/MultiAPISearch';
import Search from '../../components/CustomMultiSelect/Search';
import SingleAPISearch from '../../components/CustomMultiSelect/SingleAPISearch';
import CommentView from '../CommentView';

import { BusinessContract } from './BusinessContract';
import QuoteSell from './QuoteSell';
export function BusinessOpDetailPage(props) {
  useInjectReducer({ key: 'businessOpDetailPage', reducer });
  useInjectSaga({ key: 'businessOpDetailPage', saga });

  const {
    businessOpDetailPage,
    navigation,
    onCreateLog,
    onCreateBusinessOp,
    onUpdateBusinessOp,
    onGetBusinessOpLogs,
    onCleanup,
    route,
    crmSourceCode,
    fieldConfig,
    kanbanStatus,
  } = props;

  const {
    isBusinessLoading,
    createBusinessOpSuccess,
    updateBusinessOpSuccess,
    businessOpLogs,
    isLoading,
    isLogLoading,
    productNameOption,
  } = businessOpDetailPage;

  const { businessOp, kanban, onGoBack, onCreateSuccess } = route.params || {};

  const [showCustomerInfo, setShowCustomerInfo] = useState(false);
  const [showMoreComment, setShowMoreComment] = useState(false);
  const [showMoreLog, setShowMoreLog] = useState(false);
  const [openLogModal, setOpenLogModal] = useState(false);
  const [currentLog, setCurrentLog] = useState(false);

  const [customerNew, setCustomerNew] = useState()
  const [localState, setLocalState] = useState({});

  const {
    code,
    name,
    customer,
    productType,
    specialOffer,
    source,
    note,
  } = localState;

  const isUpdate = (businessOp && businessOp._id) ? true : false

  useEffect(() => {
    if (businessOp) setLocalState(businessOp);
    if (!isUpdate) {
      setLocalState({
        kanbanStatus: kanbanStatus.filter(e => e.code === 1)._id,
        code: 'CHKD' + new Date().valueOf()
      })
    }

    const updateEvent = DeviceEventEmitter.addListener("onUpdateCustomer", (e) => {
      const newC = { ...e, customerId: e._id }
      setCustomerNew([newC])
      setLocalState(data => ({ ...data, customer: _.get(data, 'customer.customerId') === newC.customerId ? newC : customer }))
    })

    const addEvent = DeviceEventEmitter.addListener("onUpdateCustomer", (e) => {
      const newC = { ...e, customerId: e._id }
      setCustomerNew([newC])
      setLocalState(data => ({ ...data, customer: newC }))
    })

    return () => {
      onCleanup();
      updateEvent.remove()
      addEvent.remove()
    };
  }, []);

  useEffect(() => {
    if (createBusinessOpSuccess === true) {
      ToastCustom({ text: 'Thêm mới CHKD thành công', type: 'success' });
      onCreateSuccess && onCreateSuccess()
      handleGoBack();
    }
    if (createBusinessOpSuccess === false) {
      ToastCustom({ text: 'Không được để trống Tên CHKD', type: 'danger' });
    }
  }, [createBusinessOpSuccess]);

  useEffect(() => {
    if (updateBusinessOpSuccess === true) {
      handleGoBack();
    }
  }, [updateBusinessOpSuccess]);

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

  const handleChange = (name, value, uniqueKey = '') => {
    if (uniqueKey) {
      setLocalState({ ...localState, [name]: value[uniqueKey], [`${name}Str`]: value.name || value.title });
    } else {
      switch (name) {
        default:
          setLocalState({ ...localState, [name]: value });
          break;
      }
    }
  };
  const handleSubmit = () => {
    const newBusinessOp = { ...localState }
    if (isUpdate) {
      onUpdateBusinessOp({ businessOp: newBusinessOp });
      DeviceEventEmitter.emit('onUpdateCrm')
    } else {
      onCreateBusinessOp({ businessOp: newBusinessOp });
      DeviceEventEmitter.emit('onUpdateCrm')
    }
  };

  const handleShowComment = () => setShowMoreComment(!showMoreComment);
  const handleShowCustomerInfo = () => setShowCustomerInfo(!showCustomerInfo);

  const handleShowLog = () => {
    if (!showMoreLog) {
      if (businessOp) {
        const query = {
          filter: {
            objectId: businessOp._id,
          },
        };
        onGetBusinessOpLogs(query);
      }
    }

    setShowMoreComment(false);
    setShowMoreLog(!showMoreLog);
  };

  const handleGoBack = () => {
    onGoBack && onGoBack()
    navigation.goBack();
  };

  const handleCloseLogModal = () => {
    setOpenLogModal(false);
    setCurrentLog(null);
  };

  console.log(fieldConfig['customer.name'].checkedShowForm, 'fieldConfig');

  return (

    <Container>
      <BackHeader
        navigation={navigation}
        title={isUpdate ? localState.name : 'Thêm mới CHKD'}
      />
      <Tabs>
        <Tab heading={
          <TabHeading>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Chi Tiết</Text>
          </TabHeading>
        }>
          <LoadingLayout isLoading={isLoading}>
            <Content>
              {!_.get(fieldConfig, 'code.checkedShowForm') ? null : <Item inlineLabel disabled={isUpdate}>
                <Label >{convertLabel(_.get(fieldConfig, 'code.title')) || 'Mã CHKD'}:</Label>
                <Input style={{ textAlign: 'right', minHeight: 45 }} value={code} disabled />
                {/* {isUpdate ? null : <Icon name="information-circle" type="Ionicons" style={{ fontSize: 20 }} />} */}
              </Item>}


              {!_.get(fieldConfig, 'name.checkedShowForm') ? null : <Item inlineLabel error={fieldConfig.name.isRequire && _.isEmpty(name)}>
                <Label >{convertLabel(_.get(fieldConfig, 'name.title')) || 'Tên CHKD'}:</Label>
                <Input
                  style={{ textAlign: 'right', minHeight: 45, paddingTop: 10 }}
                  value={name}
                  multiline={true}
                  onChangeText={(val) => handleChange('name', val)}
                  disabled={!fieldConfig}
                />
                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
              </Item>}


              {!(fieldConfig['customer.name'] && fieldConfig['customer.name'].checkedShowForm) ? null : <Item inlineLabel>
                <Label >{convertLabel(_.get(fieldConfig, 'customer.title')) || 'Khách hàng'}:</Label>
                <SingleAPISearch
                  readOnly={!fieldConfig}
                  uniqueKey='customerId'
                  API={API_CUSTOMER}
                  selectedItems={_.get(customer, 'customerId') ? [_.get(customer, 'customerId')] : []}
                  onSelectedItemObjectsChange={(val) => handleChange('customer', val.length ? val[0] : null)}
                  onRemove={() => handleChange('customer', null)}
                  filterOr={['name', 'customerCif', 'phoneNumber']}
                  selectedDatas={customerNew || _.get(customer, 'customerId') && [customer]}
                  customData={arr => arr.map(e => ({ ...e, customerId: e._id }))}
                />
                <Icon
                  name="user-circle"
                  type="FontAwesome"
                  style={{ fontSize: 20, marginLeft: 5, color: '#ccc' }}
                  onPress={() => navigate('AddCustomer')}

                />
              </Item>}

              {!_.get(fieldConfig, 'source.checkedShowForm') ? null : <Item inlineLabel>
                <Label >{convertLabel(_.get(fieldConfig, 'source.title')) || 'Nguồn cơ hội'}:</Label>
                <Search
                  uniqueKey="title"
                  displayKey="title"
                  items={crmSourceCode['S06']}
                  handleSelectItems={(val) => handleChange('source', val.join(', '))}
                  onRemoveSelectedItem={() => handleChange('source', '')}
                  selectedItems={source ? (source).split(', ') : []}
                  height='auto'
                  readOnly={!fieldConfig}
                />
              </Item>}


              {!_.get(fieldConfig, 'note.checkedShowForm') ? null : <Item inlineLabel style={{ justifyContent: 'center' }} error={_.get(fieldConfig, 'note.isRequire') && _.isEmpty(note)}>
                <Label >{convertLabel(_.get(fieldConfig, 'note.title')) || 'Ghi chú'}:</Label>

                <Input
                  style={{ textAlign: 'right', minHeight: 45, paddingTop: 10 }}
                  multiline={true}
                  value={note}
                  onChangeText={(val) => handleChange('note', val)}
                  disabled={!fieldConfig}
                />
                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
              </Item>}


              {!_.get(fieldConfig, 'productType.checkedShowForm') ? null : <Item inlineLabel error={_.get(fieldConfig, 'productType.isRequire') && _.isEmpty(productType)}>
                <Label >{convertLabel(_.get(fieldConfig, 'productType.title')) || 'Loại sản phẩm'}:</Label>
                <Input
                  style={{ textAlign: 'right', minHeight: 45, paddingTop: 10 }}
                  value={productType}
                  multiline={true}
                  onChangeText={(val) => handleChange('productType', val)}
                  disabled={!fieldConfig}
                />
                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
              </Item>}



              {!_.get(fieldConfig, 'specialOffer.checkedShowForm') ? null : <Item inlineLabel error={_.get(fieldConfig, 'specialOffer.isRequire') && _.isEmpty(specialOffer)}>
                <Label >{convertLabel(_.get(fieldConfig, 'specialOffer.title')) || 'Chương trình ưu đãi'}:</Label>

                <Input
                  style={{ textAlign: 'right', minHeight: 45, paddingTop: 10 }}
                  value={specialOffer}
                  multiline={true}
                  onChangeText={(val) => handleChange('specialOffer', val)}
                  disabled={!fieldConfig}
                />
                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16, color: '#ccc' }} />
              </Item>}


              {!_.get(fieldConfig, 'supervisor.checkedShowForm') ? null : <Item inlineLabel error={_.get(fieldConfig, 'supervisor.isRequire') && _.isEmpty(supervisor)}>
                <Label >{convertLabel(_.get(fieldConfig, 'supervisor.title')) || 'Người giám sát'}:</Label>

                <MultiAPISearch
                  API={API_USERS}
                  onSelectedItemObjectsChange={(e) => handleChange('supervisor', e)}
                  selectedItems={Array.isArray(_.get(localState, 'supervisor')) && localState.supervisor.map(e => e._id)}
                  selectedDatas={_.get(localState, 'supervisor')}
                />
              </Item>}

              {!_.get(fieldConfig, 'responsibilityPerson.checkedShowForm') ? null : <Item inlineLabel error={_.get(fieldConfig, 'responsibilityPerson.isRequire') && _.isEmpty(supervisor)}>
                <Label >{convertLabel(_.get(fieldConfig, 'responsibilityPerson.title')) || 'Người chịu trách nhiệm'}:</Label>
                <MultiAPISearch
                  API={API_USERS}
                  onSelectedItemObjectsChange={(e) => handleChange('responsibilityPerson', e)}
                  selectedItems={Array.isArray(_.get(localState, 'responsibilityPerson')) && localState.responsibilityPerson.map(e => e._id)}
                  selectedDatas={_.get(localState, 'responsibilityPerson')}
                />
              </Item>}

              {_.has(localState, 'customer') && <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Button onPress={handleShowCustomerInfo} transparent iconRight>
                    <Text style={{ color: theme.brandPrimary }}>Thông tin khách hàng</Text>
                    <Icon
                      type="FontAwesome"
                      name={!showCustomerInfo ? 'caret-down' : 'caret-up'}
                      style={{ fontSize: 16, color: theme.brandPrimary }}
                    />
                  </Button>
                </View>
                {showCustomerInfo && (
                  <TouchableWithoutFeedback onPress={() => navigate('AddCustomer', { id: customer.customerId, view: true })}>
                    <CustomerInfo
                      customer={_.get(localState, 'customer')}
                      onCreateLog={onCreateLog}
                      businessOpDetail={businessOp}
                    />
                  </TouchableWithoutFeedback>
                )}
              </>}

              {isUpdate && <>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <Button onPress={handleShowComment} transparent iconRight>
                    <Text style={{ color: theme.brandPrimary }}>Bình luận</Text>
                    <Icon
                      type="FontAwesome"
                      name={!showMoreComment ? 'caret-down' : 'caret-up'}
                      style={{ fontSize: 16, color: theme.brandPrimary }}
                    />
                  </Button>
                </View>
                {showMoreComment && <CommentView project={businessOp} code="BusinessOpportunities" />}
              </>}

              <LoadingButton block isBusy={isBusinessLoading} handlePress={handleSubmit}>
                <Icon name="check" type="Feather" />
              </LoadingButton>
            </Content>
          </LoadingLayout>
        </Tab>
        <Tab heading={
          <TabHeading>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Báo giá</Text>
          </TabHeading>

        }>


          <QuoteSell localData={localState ? localState : {}} kanban={kanban} />



        </Tab>

        <Tab heading={
          <TabHeading>
            <Text style={{ color: '#fff', fontWeight: '700' }}>Hợp Đồng</Text>
          </TabHeading>

        }>

          <BusinessContract localState={localState || {}} />


        </Tab>


      </Tabs >
      {/* <LogModal open={openLogModal} currentLog={currentLog} onClose={handleCloseLogModal} /> */}
    </Container>

  );
}

const mapStateToProps = createStructuredSelector({
  businessOpDetailPage: makeSelectBusinessOpDetailPage(),
  crmSourceCode: crmSourceCode(),
  kanbanStatus: makeSelectKanbanBosConfigs(),
  fieldConfig: makeSelectViewConfig(MODULE.BOS),
});

function mapDispatchToProps(dispatch) {
  return {
    onCreateLog: (log) => dispatch(actions.createLog(log)),
    onCreateBusinessOp: (data) => dispatch(actions.createBusinessOpportunity(data)),
    onUpdateBusinessOp: (data) => dispatch(actions.updateBusinessOpportunity(data)),
    onGetBusinessOpLogs: (data) => dispatch(actions.getBusinessOpportunityLogs(data)),
    onCleanup: () => dispatch(actions.cleanup()),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(BusinessOpDetailPage);
