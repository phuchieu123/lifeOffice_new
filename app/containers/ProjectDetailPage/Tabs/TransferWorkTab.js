/* eslint-disable react-hooks/exhaustive-deps */
/**
 *
 * ApprovedTab
 *
 */

import React, { memo, useEffect, useState } from 'react';
import { Text, Button, View, Content, Card, CardItem, Item, Label, Form, Icon } from 'native-base';
import { APP_URL } from '../../../configs/Paths';
// import { getJwtToken } from '../../../utils/authen';
import { REQUEST_METHOD } from '../../../utils/constants';
import CustomMultiSelect from '../../../components/CustomMultiSelect';
import { useInput } from '../../../utils/useInput';
import { TableWrapper, Table, Row, Rows } from 'react-native-table-component';
import moment from 'moment';
import { StyleSheet } from 'react-native';
import LoadingButton from '../../../components/LoadingButton';
import LoadingLayout from '../../../components/LoadingLayout';

export function TransferWorkTab(props) {
  const {
    projectDetail,
    projectTransfer,
    transferType,
    setTransferType,
    isBusy,
    onUpdateTransfer,
    isLoading,
    employeesOption,
  } = props;

  const [tableData, setTableData] = useState([]);

  const { value: currentEmployees, setValue: setCurrentEmployees } = useInput([]);
  const { value: tranferEmployees, setValue: setTranferEmployees } = useInput([]);

  const { join, inCharge } = projectDetail;

  useEffect(() => {
    const tableRow = [];

    if (projectTransfer && projectTransfer.length > 0) {
      projectTransfer.map(item => {
        let dataItem = [];
        const tt = getStringData(item.currentEmployees);
        const btt = getStringData(item.tranferEmployees);
        const time = moment(item.updatedAt).format('h:mm a DD/MM/YYYY');
        dataItem.push(tt, btt, time);
        tableRow.push(dataItem);
      });
    }
    setTableData(tableRow);
  }, [projectTransfer]);

  const getStringData = array => {
    let string = '';
    array.forEach(e => {
      string += e.name + ', ';
    });
    return string.substring(0, string.length - 2);
  };

  const handleSubmit = () => {
    const data = {
      id: projectDetail._id,
      type: transferType,
      tranferEmployees,
      currentEmployees,
    };
    setCurrentEmployees([]);
    setTranferEmployees([]);
    onUpdateTransfer(data);
  };

  const handleChangeType = index => {
    if (index !== transferType) {

      setTransferType(index);
      setCurrentEmployees([]);
      setTranferEmployees([]);
      setTableData([]);
    }
  };

  return (
    <Content padder>
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <Button style={{ flex: 1 }} bordered={transferType === 1} block onPress={() => handleChangeType(1)}>
          <Text>Người phụ trách</Text>
        </Button>
        <Button style={{ flex: 1 }} bordered={transferType === 2} block onPress={() => handleChangeType(2)}>
          <Text>Người tham gia</Text>
        </Button>
      </View>
      <Card>
        <CardItem bordered style={{ backgroundColor: '#f2f2f2', flex: 1 }} cardBody>
          <Form style={{ flex: 1, backgroundColor: 'white' }}>
            <Item inlineLabel>
              <Label>{transferType === 1 ? 'Người phụ trách:' : 'Người tham gia:'}</Label>
              <CustomMultiSelect
                items={transferType === 1 ? inCharge || [] : join || []}
                handleSelectItems={value => setCurrentEmployees(value)}
                selectedItems={currentEmployees}
              />
            </Item>
            <Item inlineLabel>
              <Label>Người thay thế:</Label>
              <CustomMultiSelect
                items={employeesOption}
                handleSelectItems={value => setTranferEmployees(value)}
                selectedItems={tranferEmployees}
              />
            </Item>
            <LoadingButton block isBusy={isBusy} handlePress={handleSubmit}>
              <Icon name="check" type="Feather" />
            </LoadingButton>
          </Form>
        </CardItem>
      </Card>
      <LoadingLayout isLoading={isLoading} style={styles.container}>
        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
          <Row
            data={['Người thay thế', 'Người bị thay thế', 'Thời gian']}
            style={styles.head}
            textStyle={styles.text}
          />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      </LoadingLayout>
    </Content>
  );
}

export default memo(TransferWorkTab);

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: { height: 28 },
  text: { textAlign: 'center' },
});
