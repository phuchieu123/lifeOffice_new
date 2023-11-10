import {
  Container,
  Tab,
  TabHeading,
  Tabs,
  Text,
  Button,
  View,
  Content,
  Card,
  CardItem,
  Body,
  List,
  ListItem,
  Icon,
  Item,
  Textarea,
} from 'native-base';
import { DeviceEventEmitter, FlatList, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { useInjectSaga } from '../../utils/injectSaga';
import { useInjectReducer } from '../../utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
import CustomHeader from '../../components/Header';
import { API_INCOMMING_DOCUMENT, API_OUTGOING_DOCUMENT, API_DOCUMENT_HISTORY } from '../../configs/Paths';
import { getDocument } from './actions';
import makeSelectTextManagement from './selectors';
import MsgIcon from '../Message/components/MsgIcon';
import moment from 'moment';
import { serialize } from '../../utils/common';
import request from '../../utils/request';
import FileView from './components/FileView';
import CollapseView from './components/CollapseView';
import CollapseText from './components/CollapseText';
import * as RootNavigation from '../../RootNavigation';

export function TextDetail(props) {
  useInjectReducer({ key: 'textDetail', reducer });
  useInjectSaga({ key: 'textDetail', saga });

  const { navigation, route, onGetDocument, textDetail } = props;
  const { localState } = textDetail;
  const { apiDocument } = localState;
  const { params } = route;
  const { item, type, handleSave, signingStatus } = params;

  const [code, setCode] = useState();

  const [docHistory, setDocHistory] = useState([]);
  const [show, setShow] = useState(true);

  const toggle = () => setShow(!show);

  const getDocumentHistory = async () => {
    try {
      const filter = {
        docId: [item._id],
      };
      let url = `${await API_DOCUMENT_HISTORY()}?${serialize({ filter: filter })}`;
      const newBody = {
        method: 'GET',
      };
      const response = await request(url, newBody);

      setDocHistory(response);
      return response;
    } catch (err) {}
    return null;
  };

  useEffect(() => {
    const newCode = type === 1 ? 'IncommingDocument' : 'OutGoingDocument';
    setCode(newCode);
  }, [type]);

  useEffect(() => {
    getDocumentHistory();
  }, []);

  useEffect(() => {
    onGetDocument({
      ...localState,
      changeApi: type === 1 ? API_INCOMMING_DOCUMENT : API_OUTGOING_DOCUMENT,
      id: item._id,
    });
  }, [type]);

  useEffect(() => {
    const updateEvent = DeviceEventEmitter.addListener('updateTextSuccess', (e) => {
      handleReload();
    });
    return () => {
      updateEvent.remove();
    };
  }, []);

  return (
    <ScrollView style={{ backgroundColor: '#99CC99' }} nestedScrollEnabled={true}>
      <CustomHeader
        navigation={navigation}
        title={type === 1 ? 'Chi tiết văn bản đến' : type === 2 ? 'Chi tiết văn bản đi' : ''}
      />
      <View
        style={{
          flex: 0.05,
          flexDirection: 'row',
          marginTop: 10,
          justifyContent: 'flex-end',
          backgroundColor: '#99CC99',
        }}>
        {(handleSave === 1 && !signingStatus) || (handleSave === 1 && signingStatus && signingStatus === 'none') ? (
          <Button
            style={{ borderRadius: 18, backgroundColor: 'rgba(46, 149, 46, 1)', height: 35, marginRight: 10 }}
            onPress={() => navigation.navigate('TextComplete', { item: item, code: code, type: type })}>
            <Text
              style={{
                paddingLeft: 20,
                paddingRight: 20,
                textAlign: 'center',
                fontSize: 10,
                color: '#fff',
                fontWeight: '600',
              }}>
              Hoàn thành
            </Text>
          </Button>
        ) : null}
        <Icon
          name="message-text"
          type="MaterialCommunityIcons"
          style={styles.icon}
          onPress={() => navigation.navigate('TextOpinion', { item: item, code: code, handleSave: handleSave })}
        />
      </View>
      <View style={{ flex: 0.95, margin: 10, backgroundColor: '#99CC99' }} nestedScrollEnabled={true}>
        <Card style={{ borderRadius: 10 }}>
          <CardItem style={{ borderRadius: 10 }}>
            <Body>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <Text>
                  <Text note style={{ fontSize: 14 }}>
                    Trích yếu:{' '}
                  </Text>
                  <CollapseText hide={false} title={item.abstractNote} />
                </Text>
                {type === 1 ? (
                  <Text>
                    <Text note style={{ fontSize: 14 }}>
                      Đơn vị gửi:{' '}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14 }}>
                      {apiDocument && apiDocument.senderUnit && apiDocument.senderUnit.title}
                    </Text>
                  </Text>
                ) : null}
                {type === 2 ? (
                  <Text>
                    <Text note style={{ fontSize: 14 }}>
                      Đơn vị soạn:{' '}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14 }}>
                      {item.senderUnit}
                    </Text>
                  </Text>
                ) : null}
                {type === 1 ? (
                  <Text>
                    <Text note style={{ fontSize: 14 }}>
                      Ngày VB:{' '}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14 }}>
                      {item.documentDate}
                    </Text>
                  </Text>
                ) : null}
                {type === 2 ? (
                  <Text>
                    <Text note style={{ fontSize: 14 }}>
                      Người soạn:{' '}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14 }}>
                      {item['drafter.name']}
                    </Text>
                  </Text>
                ) : null}
                {type === 2 ? (
                  <Text>
                    <Text note style={{ fontSize: 14 }}>
                      Ngày soạn:{' '}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14 }}>
                      {item.createdAt}
                    </Text>
                  </Text>
                ) : null}
                {type === 1 ? (
                  <Text>
                    <Text note style={{ fontSize: 14 }}>
                      Hạn xử lý:{' '}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14 }}>
                      {item.deadline ? moment(item.deadline).format('DD/MM/YYYY') : ''}
                    </Text>
                  </Text>
                ) : null}
                <View style={show ? {} : { display: 'none' }}>
                  {type === 1 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Số văn bản:{' '}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                        {item.toBook}
                      </Text>
                    </Text>
                  ) : null}
                  {type === 1 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Sổ VB đến:{' '}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                        {item.bookDocumentId && item.bookDocumentId.name}
                      </Text>
                    </Text>
                  ) : null}
                  {type === 1 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Số đến:{' '}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                        {item.toBookCode &&
                          item.toBookCode.slice(-(item.toBookCode.length - item.toBookCode.lastIndexOf('/') - 1))}
                      </Text>
                    </Text>
                  ) : null}
                  {type === 1 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Ngày nhận:{' '}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                        {item.receiveDate}
                      </Text>
                    </Text>
                  ) : null}
                  {type === 1 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Ngày vào sổ:{' '}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                        {item.receiveDateDepartment}
                      </Text>
                    </Text>
                  ) : null}
                  <Text>
                    <Text note style={{ fontSize: 14 }}>
                      Độ mật:{' '}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14 }}>
                      {item.privateLevel}
                    </Text>
                  </Text>
                  <Text>
                    <Text note style={{ fontSize: 14 }}>
                      Độ khẩn:{' '}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14 }}>
                      {item.urgencyLevel}
                    </Text>
                  </Text>
                  {type === 1 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Phương thức nhận:{' '}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                        {item.receiveMethod}
                      </Text>
                    </Text>
                  ) : null}
                  <Text>
                    <Text note style={{ fontSize: 14 }}>
                      Loại VB:{' '}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14 }}>
                      {item.documentType}
                    </Text>
                  </Text>
                  <Text>
                    <Text note style={{ fontSize: 14 }}>
                      Lĩnh vực:{' '}
                    </Text>
                    <Text numberOfLines={1} style={{ fontSize: 14 }}>
                      {item.documentField}
                    </Text>
                  </Text>
                  {type === 2 && handleSave === 3 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Sổ VB đi:{' '}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                        {apiDocument && apiDocument.bookDocumentId && apiDocument.bookDocumentId.name}
                      </Text>
                    </Text>
                  ) : null}
                  {type === 2 && handleSave === 3 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Số VB đi:{' '}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                        {item.releaseNo}
                      </Text>
                    </Text>
                  ) : null}
                  {type === 2 && handleSave === 3 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Ngày ban hành:{' '}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                        {item.releaseDate}
                      </Text>
                    </Text>
                  ) : null}
                  {type === 2 && handleSave === 3 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Số, ký hiệu VB:{' '}
                      </Text>
                      <Text numberOfLines={1} style={{ fontSize: 14 }}>
                        {item.textSymbols ? `${item.toBook}/${item.textSymbols}` : item.toBook}
                      </Text>
                    </Text>
                  ) : null}
                  {type === 2 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Hồ sơ CV liên quan:{' '}
                      </Text>
                    </Text>
                  ) : null}
                  {type === 2 ? (
                    <Text>
                      <Text note style={{ fontSize: 14 }}>
                        Phúc đáp VB:{' '}
                      </Text>
                      {/* {apiDocument && apiDocument.docFiles && apiDocument.docFiles.map(i => { return <FileView hide={false} id={i.id} code={'OutGoingDocument'} visible={true} /> })} */}
                    </Text>
                  ) : null}
                  {type === 2 ? (
                    <Text note style={{ fontSize: 14 }}>
                      Văn bản dự thảo:{' '}
                    </Text>
                  ) : null}
                </View>
                <Icon
                  onPress={toggle}
                  type="FontAwesome"
                  name={show ? 'caret-up' : 'caret-down'}
                  style={{ flexDirection: 'row', justifyContent: 'flex-end', fontSize: 14, padding: 5 }}
                />
                <Text note style={{ fontSize: 14 }}>
                  Tệp đính kèm:{' '}
                </Text>
                {type === 1 ? (
                  <View style={{ flexDirection: 'row', padding: 5 }}>
                    <FileView
                      navigation={navigation}
                      hide={false}
                      id={item._id}
                      code={'IncommingDocument'}
                      visible={true}
                    />
                  </View>
                ) : null}
                {type === 2 ? (
                  <View style={{ flexDirection: 'row', padding: 5 }}>
                    <FileView
                      navigation={navigation}
                      hide={false}
                      id={item._id}
                      code={'OutGoingDocument-fileDocs'}
                      visible={true}
                    />
                  </View>
                ) : null}
                <Text style={{ fontSize: 14 }}>Lịch sử gửi nhận: </Text>
                <ScrollView nestedScrollEnabled={true}>
                  {docHistory.map((item) => {
                    return (
                      <View>
                        <CollapseView hide item={item.childs} title={`${item.createdByName}  -  ${item.createdAt}`} />
                      </View>
                    );
                  })}
                </ScrollView>
              </View>
            </Body>
          </CardItem>
        </Card>
      </View>
    </ScrollView>
  );
}


const styles = {
  icon: {
    color: '#fff',
    marginLeft: 15,
    marginRight: 5,
    paddingRight: 5,
    fontSize: 30,
  },
};

const mapStateToProps = createStructuredSelector({
  textDetail: makeSelectTextManagement(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetDocument: (data) => dispatch(getDocument(data)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(withConnect)(TextDetail);
