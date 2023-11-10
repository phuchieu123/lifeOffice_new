import React, { useState, useEffect, Fragment } from 'react';
import { Text, View, Button, Card, ListItem, List, Left, Right, Icon, Body } from 'native-base';
import { TouchableNativeFeedback } from 'react-native';
import * as RootNavigation from '../../RootNavigation';
import { INCOMING_DOCUMENT, MEETING_SCHEDULE } from '../../configs/Paths';
import { handleSearch, serialize } from '../../utils/common';
import { taskKanbanData } from '../../utils/constants';
import LoadingLayout from '../../components/LoadingLayout';
import moment from 'moment';
import _ from 'lodash';
import { getProfile } from '../../utils/authen';

export default IncomingDocument = (props) => {
    const { getCount, profile } = props;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setLoading(true)

        await getProfile().then(async profile => {
            const newQuery = {
                filter: {
                    typeCalendar: 2,
                    people: { $in: [{ _id: profile._id, name: profile.name }] },
                },
                limit: 3,
                skip: 0,
            }
            const url = `${await MEETING_SCHEDULE()}?${serialize(newQuery)}`;

            await handleSearch(url, (e) => {
                if (Array.isArray(e)) {
                    let newData = [...e]
                    newData = newData.map(item => ({
                        ...item,
                        hourStart: moment(item['timeStart']).format('hh:mm'),
                        timeStartFormat: moment(item['timeStart']).format('DD/MM/YY'),
                        timeEndFormat: moment(item['timeEnd']).format('DD/MM/YY'),
                        // dateFormat: moment(item['timeStart']).format('DD-MM-YY'),
                    }))
                    setData(newData);
                }
            }, {
                getResponse: res => {
                    res && res.count && getCount && getCount(res.count)
                }
            })

        })

        setLoading(false)
    }

    return (
        <>
            <View style={styles.view}>
                <Button small rounded block style={{ width: '100%', marginVertical: 2, marginBottom: 5 }} onPress={getData}>
                    <Text style={{ textAlign: 'center' }}>Lịch công tác</Text>
                    <Icon type='Ionicons' name='reload' style={{ position: 'absolute', right: 0, color: '#fff' }} />
                </Button>
            </View>
            <LoadingLayout isLoading={loading}>
                <View style={{ backgroundColor: '#fff', borderRadius: 10, marginBottom: 5 }}>
                    <List>
                        {data && data.length === 0 ?

                            <ListItem>
                                <Body>
                                    <Text>Không có lịch công tác</Text>
                                </Body>
                            </ListItem>
                            :
                            <>
                                {data && data.map((item, index) => {
                                    return <TouchableNativeFeedback
                                        key={`${item._id}`}
                                        onPress={() => RootNavigation.navigate('WorkingScheduleDetailPage', { "item._id": item._id, })}
                                    >
                                        <ListItem>
                                            <Body>
                                                <Text style={{}}>{item.name}</Text>
                                                {_.has(item, 'roomMetting.name') ? <Text note>{item.roomMetting.name}</Text> : null}
                                                <Text note numberOfLines={1}>{item.content}</Text>
                                            </Body>
                                            <Right>
                                                <Text note>{item && item.hourStart}</Text>
                                                <Text note>{item && item.timeEndFormat}</Text>
                                            </Right>
                                        </ListItem>
                                    </TouchableNativeFeedback>
                                })}
                            </>
                        }
                        <TouchableNativeFeedback onPress={() => { RootNavigation.navigate('WorkingSchedulePage') }}>
                            <ListItem>
                                <Body>
                                    <Text>Xem tất cả</Text>
                                </Body>
                                <Right>
                                    <Icon name="arrow-forward" />
                                </Right>
                            </ListItem>
                        </TouchableNativeFeedback>
                    </List>
                </View>
            </LoadingLayout>
        </>
    );
};

const styles = {
    view: {
        flex: 1,
        flexDirection: 'row',
    },
};
