import React from 'react';
import { Text, Card, CardItem, Right, Button, Icon } from 'native-base';
import { formartDate } from '../../../utils/common';
import { DATE_FORMAT } from '../../../utils/constants';

export default ApproveItem = ({ item, profile, handleOpenModal }) => {

    const checkValidUser = (item) => {
        if (item.groupInfo) {
            const approveTurn = item.groupInfo.find((d) => d.order === item.approveIndex);

            if (approveTurn && profile.userId === approveTurn.person && approveTurn.approve === 0) {
                return true;
            }
        }
        return false;
    };

    return <Card style={{ borderRadius: 18 }} >
        <CardItem header bordered style={{ flex: 1, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
        </CardItem>
        <CardItem>
            <Text note style={{ fontWeight: 'bold' }}>
                {item.subCode}
            </Text>
            <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Text note style={{ fontWeight: 'bold' }}>
                    {formartDate(item.createdAt, DATE_FORMAT.DATE)}
                </Text>
            </Right>
        </CardItem>
        <CardItem>
            <Text>
                {item.approveStatus}
            </Text>
        </CardItem>
        <CardItem style={{ borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }} >
            {profile
                ? !checkValidUser(item)
                    ? <Button warning small block rounded style={{ flex: 1 }} onPress={() => handleOpenModal(item)}>
                        <Icon name='hourglass-empty' type='MaterialIcons' style={{ marginRight: 5, paddingRight: 0 }} />
                        <Text style={{ marginLeft: 0, paddingLeft: 0 }} >Đang chờ phê duyệt</Text>
                    </Button>
                    : <Button small block rounded style={{ flex: 1 }} onPress={() => handleOpenModal(item)}>
                        <Text>Phê duyệt</Text>
                    </Button>
                : <Button small block rounded style={{ flex: 1 }} onPress={() => handleOpenModal(item)}>
                    <Text>Thông tin phê duyệt</Text>
                </Button>}
        </CardItem>
    </Card>
}

