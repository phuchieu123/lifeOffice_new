import React, { useEffect, memo, useState, useRef } from 'react';
import { Image, Platform, Linking, ScrollView } from 'react-native';
import { View, Text, Icon, Button, ListItem } from 'native-base';
import Modal from 'react-native-modal';
import _ from 'lodash';
import moment from 'moment';

const ProfileModal = props => {
    const { isVisible, onPress, employee } = props

    const handlelocation = (lat, long) => {
        const location = `${lat},${long}`
        const url = Platform.select({
            ios: `maps:${location}`,
            android: `geo:${location}?center=${location}&q=${location}&z=16`,
        });
        Linking.openURL(url);
    };

    return <Modal isVisible={isVisible} style={{ height: 'auto' }} >
        <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10 }}>
            <ScrollView>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {employee.msg ?
                        <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15, fontWeight: 'bold' }}>Trạng thái: {employee.msg}</Text>
                        : null}

                    {employee.code ? (
                        <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Mã nhân viên: {employee.code}</Text>
                    ) : null}

                    {employee.name ? (
                        <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Họ tên: {employee.name}</Text>
                    ) : null}

                    {employee.dob ? (
                        <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Ngày sinh: {moment(employee.dob).format('DD/MM/YYYY')}</Text>
                    ) : null}

                    {employee.email ? (
                        <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Email: {employee.email}</Text>
                    ) : null}

                    {(employee.type) ? (
                        <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Trạng thái: {employee.type === 'IN' ? 'Chấm công vào' : 'Chấm công ra'}</Text>
                    ) : null}

                    {(employee.date) ? (
                        <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Ngày chấm: {employee.date}</Text>
                    ) : null}

                    {(employee.in || employee.out) ? (
                        <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Thời gian: {_.has(employee, 'in') ? employee.in : employee.out}</Text>
                    ) : null}

                    {(employee.lat && employee.long) ? (
                        <>
                            <Text style={{ alignSelf: 'center', marginBottom: 10, fontSize: 15 }}>Vị trí: {employee.lat.toString().substr(0, 10)}, {employee.long.toString().substr(0, 10)}</Text>
                            <Text onPress={() => handlelocation(employee.lat, employee.long)} style={{ alignSelf: 'center', fontSize: 15, color: '#0074CC' }}>Xem trên bản đồ</Text>
                        </>
                    ) : null}

                    {employee.link ? (
                        <View style={{ padding: 10 }}>
                            <Image
                                resizeMode="contain"
                                source={{ uri: employee.link }}
                                style={{
                                    alignSelf: 'center',
                                    width: 300,
                                    height: 250,
                                }}
                            />
                        </View>
                    ) : null}
                    <Button block onPress={onPress} style={{ borderRadius: 10, margin: 10 }}>
                        <Icon name="check" type="Feather" />
                    </Button>
                </View>
            </ScrollView>
        </View >
    </Modal >
}

export default ProfileModal