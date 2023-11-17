import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
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

    return <View style={{ borderRadius: 18 }} >
        <View header bordered style={{ flex: 1, borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
        </View>
        <View>
            <Text note style={{ fontWeight: 'bold' }}>
                {item.subCode}
            </Text>
            <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Text note style={{ fontWeight: 'bold' }}>
                    {formartDate(item.createdAt, DATE_FORMAT.DATE)}
                </Text>
            </Right>
        </View>
        <View>
            <Text>
                {item.approveStatus}
            </Text>
        </View>
        <View style={{ borderBottomLeftRadius: 18, borderBottomRightRadius: 18 }} >
            {profile
                ? !checkValidUser(item)
                    ? <TouchableOpacity warning small block rounded style={{ flex: 1 }} onPress={() => handleOpenModal(item)}>
                        <Icon name='hourglass-empty' type='MaterialIcons' style={{ marginRight: 5, paddingRight: 0 }} />
                        <Text style={{ marginLeft: 0, paddingLeft: 0 }} >Đang chờ phê duyệt</Text>
                    </TouchableOpacity>
                    : <TouchableOpacity small block rounded style={{ flex: 1 }} onPress={() => handleOpenModal(item)}>
                        <Text>Phê duyệt</Text>
                    </TouchableOpacity>
                : <TouchableOpacity small block rounded style={{ flex: 1 }} onPress={() => handleOpenModal(item)}>
                    <Text>Thông tin phê duyệt</Text>
                </TouchableOpacity>}
        </View>
    </View>
}

