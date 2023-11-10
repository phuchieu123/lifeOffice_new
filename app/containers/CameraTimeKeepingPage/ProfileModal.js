import React, { useEffect, memo, useState, useRef } from 'react';
import { Image, Platform, Linking } from 'react-native';
import { View, Text, Icon, Button, ListItem } from 'native-base';
import Modal from 'react-native-modal';
import _ from 'lodash';
import { getProfile } from '../../utils/authen';
import moment from 'moment';

const ProfileModal = props => {
    const { isVisible, onPress, employee, title = 'Thông tin chấm công' } = props
    const FOMART = (toString().substr(0, 10));
    const [profile, setProfile] = useState({})

    const handlelocation = (lat, long) => {
        const location = `${lat},${long}`
        const url = Platform.select({
            ios: `maps:${location}`,
            android: `geo:${location}?center=${location}&q=${location}&z=16`,
        });



        Linking.openURL(url);

    };



    useEffect(() => {
        if (employee && employee.name) {
            getProfile().then(setProfile)
        } else setProfile({})
    }, [employee])

    if (!employee) return null
    return <Modal isVisible={isVisible} style={{ height: 'auto' }} >
        <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
            <ListItem itemHeader itemDivider style={{ borderRadius: 10, marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>
                    {title}
                </Text>
            </ListItem>

            {profile.code ? (
                <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Mã nhân viên: {profile.code}</Text>
            ) : null}

            {employee.name ? (
                <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Họ tên: {employee.name}</Text>
            ) : null}

            {profile.dob ? (
                <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Ngày sinh: {moment(profile.dob).format('DD/MM/YYYY')}</Text>
            ) : null}

            {employee.email ? (
                <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Email: {employee.email}</Text>
            ) : null}

            {(employee.type) ? (
                <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Trạng thái: {employee.type === 'IN' ? 'Chấm công vào' : 'Chấm công ra'}</Text>
            ) : null}

            {(employee.date) ? (
                <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Ngày chấm: {moment(employee.date).subtract(1, 'days').format('DD/MM/YYYY')}</Text>
            ) : null}

            {(employee.in || employee.out) ? (
                <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Thời gian: {_.has(employee, 'in') ? employee.in : employee.out}</Text>
            ) : null}

            {employee.lat && employee.long ? (
                <>
                    <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Vị trí: {employee.lat.toString().substr(0, 10)}, {employee.long.toString().substr(0, 10)}</Text>
                    <Text onPress={() => handlelocation(employee.lat, employee.long)} style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15, color: '#0074CC' }}>Xem trên bản đồ</Text>
                </>
            ) : null}
            {/*  */}
            {employee.link ? (
                <Image
                    resizeMode="contain"
                    source={{ uri: employee.link }}
                    style={{
                        alignSelf: 'center',
                        margin: 20,
                        width: 250,
                        height: 250,
                        // borderWidth: 2,
                        // borderRadius: 75,
                    }}
                />
            ) : null}
            <Button block onPress={onPress} style={{ borderRadius: 10, margin: 10 }}>
                <Icon name="check" type="Feather" />
            </Button>
        </View>
    </Modal >
}

export default ProfileModal