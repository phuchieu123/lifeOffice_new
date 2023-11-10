import React, { useEffect, useState } from 'react';
import {
    Text,
    ListItem,
    Body,
    Right,
    Icon,
} from 'native-base';
import { API_TAKE_LEAVE } from '../../../configs/Paths';
import ListPage from '../../../components/ListPage';
import moment from 'moment';
import { goBack, navigate } from '../../../RootNavigation';
import _ from 'lodash';
import { getData } from '../../../utils/storage';
import { DeviceEventEmitter } from 'react-native';

export default TakeLeaveDay = (props) => {
    const { profile } = props;

    const [query, setQuery] = useState()

    const [reload, setReload] = useState(0);



    useEffect(() => {
        getData('profile').then(profile => {
            setQuery({
                'organizationUnit.organizationUnitId': _.get(profile, 'organizationUnit.organizationUnitId')
            })
        })
    }, []);



    useEffect(() => {
        const addEvent = DeviceEventEmitter.addListener("onUpdateDaysOff", (e) => {
            handleReload()
        })

        return () => {
            addEvent.remove()
        }
    }, [])

    const handleReload = () => {
        setReload(e => e + 1)
    }
    return (
        <ListPage
            reload={reload}
            query={query}
            api={API_TAKE_LEAVE}
            itemComponent={({ item }) => {
                let time = moment(item.fromDate)
                time = time.isValid() ? time.format('DD-MM-YYYY') : item.fromDate

                const employee = _.get(item, 'name')
                const organization = _.get(item, 'organizationUnit')

                return <ListItem onPress={() => navigate('DetailsDaysOffBoardPage', { item })}>
                    <Body>
                        <Text style={{ fontWeight: 'bold' }}>{time}</Text>
                        {employee && <Text style={{ fontSize: 16, color: "black" }} note numberOfLines={1}>{`Người tạo: ${employee}`}</Text>}
                        {organization && <Text style={{ fontSize: 16, color: "black" }} note numberOfLines={1}>{`Phòng ban: ${organization}`}</Text>}
                        <Text>Tiêu đề: {item.type && item.type.title}</Text>
                        <Text>Lý do: {item.reason}</Text>
                    </Body>
                    <Right>
                        <Icon name="chevron-right" type="Entypo" />
                    </Right>
                </ListItem>
            }}
        />
    );
};
