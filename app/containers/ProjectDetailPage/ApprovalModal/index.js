/* eslint-disable react-native/no-inline-styles */
/**
 *
 * ApprovalModal
 *
 */

import React, { useState, useEffect, useRef } from 'react';
// import styled from 'styled-components';
import { Input, Item, Label, Button, Card, CardItem, Form, Icon, View, Text } from 'native-base';
import CustomMultiSelect from '../../../components/CustomMultiSelect';
import LoadingButton from '../../../components/LoadingButton';
import { useInput } from '../../../utils/useInput';
import { getClientId } from '../../../utils/authen';
import { Modal, StyleSheet } from 'react-native';
import SingleAPISearch from 'components/CustomMultiSelect/SingleAPISearch';
import { API_APPROVE_GROUP } from '../../../configs/Paths';
import ToastCustom from 'components/ToastCustom';

function ApprovalModal(props) {
  const { open, onClose, onSave, approverGroupsOption, templatesOption, project } = props;
  const {
    value: approvalName,
    setValue: setApprovalName,
    valid: validApprovalName,
    setValid: setValidApprovalName,
    bind: bindApprovalName,
  } = useInput('');
  const [approveGroups, setApproveGroups] = useState([]);
  const [templates, setTemplates] = useState([]);
  const { value: subcode, setValue: setSubcode, bind: bindSubcode } = useInput('');

  useEffect(() => {
    if (open) {
      setApprovalName(`Công việc ${project.name}`);
      setSubcode('Công việc');
    }
  }, [project.name, open]);

  const handleSave = async () => {
    if (approvalName === '') {
      setValidApprovalName(false);
      // ToastCustom({ text: 'Bạn cần nhập tên phê duyệt', type: 'danger' })
      return;
    }
    if (approveGroups.length === 0) {
      // ToastCustom({ text: 'Bạn cần chọn nhóm phê duyệt', type: 'danger' })
      return;
    }
    // if (templates.length === 0) {
    //   return;
    // }
    const clientId = await getClientId();

    const approvedObj = { ...approveGroups[0] };
    let groupInfo = [];
    approvedObj.group &&
      Array.isArray(approvedObj.group) &&
      approvedObj.group.forEach((item) => {
        groupInfo.push({
          order: item.order,
          person: item.person,
          approve: 0,
          reason: '',
        });
      });

    let body = {
      approveGroup: approveGroups[0]._id,
      clientId,
      collectionCode: 'Task',
      convertMapping: '5d832729c252b2577006c5ab',
      dataInfo: project,
      groupInfo,
      name: approvalName,
      subCode: subcode,
    };

    if (templates.length > 0) {
      body = {
        ...body,
        content: templates[0].content,
        dynamicForm: [0]._id,
      };
    }

    onSave(body);
    handleClose();
  };

  const handleClose = () => {
    setApprovalName('');
    setSubcode('');
    setApproveGroups([]);
    setTemplates([]);
    onClose();
  };

  return (
    <Modal visible={open}>
      <View style={styles.centeredView}>
        <Card>
          <CardItem header>
            <Text uppercase>Tạo phê duyệt</Text>
          </CardItem>
          <CardItem>
            <Form style={{ flex: 1, backgroundColor: 'white' }}>
              <Item inlineLabel error={!validApprovalName}>
                <Label>Tên phê duyệt:</Label>
                <Input
                  {...bindApprovalName}
                  placeholder="Bắt buộc"
                  style={{ textAlign: 'right', marginRight: 5 }}
                  placeholderTextColor="red"
                />
                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
              </Item>
              <Item inlineLabel error={approveGroups.length === 0}>
                <Label>Nhóm phê duyệt:</Label>
                {/* <CustomMultiSelect
                   single
                   items={approverGroupsOption}
                   handleSelectObjectItems={(items) => setApproveGroups(items)}
                   selectedItems={approveGroups ? approveGroups.map((c) => c._id) : [approverGroupsOption[0]._id]}
                   onRemoveSelectedItem={() => setApproveGroups([])}
                   canRemove={false}
                 /> */}
                <SingleAPISearch
                  query={{
                    filter: {
                      clientId,
                    }
                  }}
                  API={API_APPROVE_GROUP}
                  selectedItems={Array.isArray(approveGroups) ? approveGroups.map((c) => c._id) : []}
                  onSelectedItemObjectsChange={setApproveGroups}
                  onRemove={() => setApproveGroups([])}
                  filter={{
                    isActive: true,
                  }}
                />
              </Item>
              <Item inlineLabel>
                <Label>Quy trình:</Label>
                <Input
                  {...bindSubcode}
                  placeholder="Bắt buộc"
                  style={{ textAlign: 'right', marginRight: 5 }}
                  placeholderTextColor="red"
                />
                <Icon active type="Entypo" name="keyboard" style={{ fontSize: 16 }} />
              </Item>
              <Item inlineLabel>
                <Label>Biểu mẫu:</Label>
                <CustomMultiSelect
                  single
                  items={templatesOption}
                  displayKey="title"
                  handleSelectObjectItems={(items) => setTemplates(items)}
                  selectedItems={templates ? templates.map((c) => c._id) : [templatesOption[0]._id]}
                  onRemoveSelectedItem={() => setTemplates([])}
                  canRemove={false}
                />
              </Item>

              <View style={{ flexDirection: 'row', marginTop: 40 }}>
                <LoadingButton block handlePress={handleSave} style={{ flex: 1, marginRight: 10, borderRadius: 10 }}>
                  <Icon name="check" type="Feather" />
                </LoadingButton>
                <Button block onPress={handleClose} full style={{ flex: 1, borderRadius: 10 }} warning>
                  <Icon name="close" type="AntDesign" style={{ color: '#fff' }} />
                </Button>
              </View>
            </Form>
          </CardItem>
        </Card>
      </View>
    </Modal>
  );
}

export default ApprovalModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});