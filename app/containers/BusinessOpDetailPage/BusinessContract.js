import React, { memo, useEffect, useState } from 'react';
import { Text, Button, View, Content, Card, CardItem, Item, Label, Form, Icon } from 'native-base';
import { API_CONTRACT } from '../../configs/Paths';
import ListPage from '../../components/ListPage';

// import ListPage from '../../../components/ListPage';
// import FabLayout from '../../../components/CustomFab/FabLayout';

export function BusinessContract(props) {
    const { localState } = props;


    const [handelSave, setHanDelSave] = useState(1)

    return (
        <>
            <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'center' }}>
                <Button style={{ borderRadius: 18, backgroundColor: handelSave === 1 ? 'rgba(46, 149, 46, 1)' : '#fff', height: 35, marginRight: 10 }} onPress={() => setHanDelSave(1)}>
                    <Text style={{ paddingLeft: 10, paddingRight: 10, textAlign: 'center', fontSize: 10, color: handelSave === 1 ? '#fff' : '#000', fontWeight: '600', paddingLeft: 6 }}>Hợp đồng hết hạn</Text>
                </Button>
                <Button style={{ borderRadius: 18, backgroundColor: handelSave === 2 ? 'rgba(46, 149, 46, 1)' : '#fff', height: 35 }} onPress={() => setHanDelSave(2)}>
                    <Text style={{ paddingLeft: 10, paddingRight: 10, textAlign: 'center', fontSize: 10, color: handelSave === 2 ? '#fff' : '#000', fontWeight: '600', paddingLeft: 6 }}>Hợp đồng đến thời hạn</Text>
                </Button>
            </View>
            <ListPage
                query={{
                    filter: {
                        typeContract: handelSave
                    },
                    sort: "-updatedAt",
                    imit: 15,
                    skip: 0

                }}
                api={API_CONTRACT}
                itemComponent={({ item }) =>
                    <View style={{borderBottomWidth: 0.75, borderColor: 'gray', marginHorizontal: 10}}>
                        <View bordered style={{ backgroundColor: '#f2f2f2', flex: 1 }} cardBody>
                            <View style={{ flex: 1, backgroundColor: 'white' }}>
                                <View style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 14, color: 'black' }} >Tên hợp đồng: </Text>
                                        <Text style={{ flex: 1 }}>{item.name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }} >
                                        <Text style={{ fontSize: 14, color: 'black' }} >Loại hợp đồng: </Text>
                                        <Text style={{ textAlign: 'center', }}></Text>
                                    </View>

                                </View>
                            </View>
                        </View>
                    </View>
                }
            />

        </>

    );
}

export default memo(BusinessContract);


