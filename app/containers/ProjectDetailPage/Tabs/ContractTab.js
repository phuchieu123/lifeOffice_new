import React, { memo, useEffect, useState } from 'react';
import { Text, Button, View, Content, Card, CardItem, Item, Label, Form, Icon } from 'native-base';
import { API_TASKS_CONTRACT, APP_URL } from '../../../configs/Paths';
import ListPage from '../../../components/ListPage';
import FabLayout from '../../../components/CustomFab/FabLayout';

export function ContractTab(props) {
    const { projectDetail } = props;


    const [handelSave, setHanDelSave] = useState(1)

    return (
        <>
            <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>
                <Button style={{ borderRadius: 18, backgroundColor: handelSave === 1 ? 'rgba(46, 149, 46, 1)' : '#fff', height: 35, marginRight: 10 }} onPress={() => setHanDelSave(1)}>
                    <Text style={{ paddingLeft: 10, paddingRight: 10, textAlign: 'center', fontSize: 10, color: handelSave === 1 ? '#fff' : '#000', fontWeight: '600', paddingLeft: 6 }}>Hợp đồng nhà cung cấp</Text>
                </Button>
                <Button style={{ borderRadius: 18, backgroundColor: handelSave === 2 ? 'rgba(46, 149, 46, 1)' : '#fff', height: 35 }} onPress={() => setHanDelSave(2)}>
                    <Text style={{ paddingLeft: 10, paddingRight: 10, textAlign: 'center', fontSize: 10, color: handelSave === 2 ? '#fff' : '#000', fontWeight: '600', paddingLeft: 6 }}>Hợp đồng khách hàng</Text>
                </Button>
            </View>
            <ListPage
                query={{
                    typeContract: handelSave,
                    taskId: projectDetail ? projectDetail._id : ''
                }}
                api={API_TASKS_CONTRACT}
                itemComponent={({ item }) =>
                    <Card>
                        <CardItem bordered style={{ backgroundColor: '#f2f2f2', flex: 1 }} cardBody>
                            <Form style={{ flex: 1, backgroundColor: 'white' }}>
                                <View style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Label style={{ fontSize: 14, color: 'black' }} >Tên hợp đồng: </Label>
                                        <Text style={{ textAlign: 'center', alignItems: 'center', }}>{item.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }} >
                                        <Label style={{ fontSize: 14, color: 'black' }} >Loại hợp đồng: </Label>
                                        <Text style={{ textAlign: 'center', }}></Text>
                                    </View>

                                </View>
                            </Form>
                        </CardItem>
                    </Card>
                }
            />
            <FabLayout onPress={'handleAddProject'}>
                <Icon type="Entypo" name="plus" style={{ color: '#fff' }} />
            </FabLayout>
        </>

    );
}

export default memo(ContractTab);


