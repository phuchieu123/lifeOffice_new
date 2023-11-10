import React, { useState, useEffect } from 'react';
import {
    Alert,
    Modal,
    StyleSheet,
    Text,
    Pressable,
    View,
    Dimensions,
    Button,
    TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import _ from 'lodash';
import { Icon } from 'native-base';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const CustomMonthYearPicker = (props) => {
    const { value, onChange, open, onClose } = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [today, setToday] = useState(moment(value));
    const [listYear, setListYear] = useState([]);
    const [reload, setReload] = useState(new Date() * 1);
    const monthOfYear = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
    ];
    const [localState, setLocalState] = useState({
        checkYearPicker: false,
    });
    const [localData, setLocalData] = useState({
        year: moment(value).format("YYYY"),
        month: moment(value).format("MM")
    })

    useEffect(() => {
        let dataFuture = [];
        let dataPast = [];
        let newData = [];
        for (let i = 0; i < 5; i++) {
            dataFuture.push(parseInt(today.format('YYYY')) + i);
        }
        for (let i = 1; i < 5; i++) {
            dataPast.push(parseInt(today.format('YYYY')) - i);
        }
        newData = _.reverse(dataPast).concat(dataFuture);
        setListYear(newData);
    }, [today, reload]);

    // useEffect(() => {
    //     if (modalVisible) {
    //         setToday(moment());
    //     }
    // }, [modalVisible]);

    function handlePrevYear() {
        setToday(today.subtract(5, 'years'));
        setReload(new Date() * 1);
    }

    function handleNextYear() {
        setToday(today.add(5, 'years'));
        setReload(new Date() * 1);
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={open ? open : modalVisible}
                onRequestClose={() => {
                    if (onClose) {
                        onClose();
                    }
                    else {
                        setModalVisible(!modalVisible)
                    }

                }}>
                <View style={styles.centeredView}>
                    <View style={styles.calendaView}>
                        {!localState.checkYearPicker && (
                            <View style={styles.comboButton}>
                                <TouchableOpacity
                                    onPress={() => {
                                        handlePrevYear();
                                    }}>
                                    <View style={styles.changeButton}>
                                        <Text style={{ color: '#00bd1c', fontSize: 18 }}>
                                            {'<'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleNextYear();
                                    }}>
                                    <View style={styles.changeButton}>
                                        <Text style={{ color: '#00bd1c', fontSize: 18 }}>
                                            {'>'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                        {!localState.checkYearPicker ? (
                            <View style={styles.modalView}>
                                {listYear.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setLocalState({ ...localState, checkYearPicker: true });
                                                setLocalData({ ...localData, year: item })
                                            }}>
                                            <View style={parseInt(item) === parseInt(localData.year) ? styles.itemFill : styles.item}>
                                                <Text style={parseInt(item) === parseInt(localData.year) ? styles.textItemFill : styles.textItem}>{item}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : (
                            <View style={styles.modalView}>
                                {monthOfYear.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                setModalVisible(false);
                                                setLocalState({
                                                    ...localState,
                                                    checkYearPicker: false,
                                                });
                                                setLocalData({ ...localData, month: item })
                                                onChange && onChange(localData.year, item)
                                                onClose && onClose();
                                            }}>
                                            <View style={parseInt(item) === parseInt(localData.month) ? styles.itemFill : styles.item}>
                                                <Text style={parseInt(item) === parseInt(localData.month) ? styles.textItemFill : styles.textItem}>Tháng {item}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                        <View style={styles.bottomButton}>
                            {localState.checkYearPicker && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setLocalState({ ...localState, checkYearPicker: false });
                                    }}>
                                    <View style={styles.itemBottomButtonYear}>
                                        <Text
                                            style={{ color: '#00bd1c', fontSize: 18, padding: 8 }}>
                                            {'Chọn năm'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setLocalState({
                                        ...localState,
                                        checkYearPicker: false,
                                    });
                                    onChange && onChange(localData.year, localData.month)
                                    onClose && onClose();
                                }}>
                                <View style={styles.itemBottomButton}>
                                    <Text style={{ color: '#ff0000', fontSize: 18, padding: 8 }}>
                                        {'Đóng'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {
                onClose ? null :
                    <Pressable
                        style={[styles.button, styles.buttonOpen]}
                        onPress={() => setModalVisible(true)}>
                        <Text style={styles.textStyle}>{localData.month}/{localData.year} <Icon name="calendar" type="FontAwesome" style={{ fontSize: 15 }} /></Text>
                    </Pressable>
            }

        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: "center",
        // marginTop: 22
    },
    modalView: {
        // margin: 20,
        backgroundColor: 'transparent',
        borderRadius: 10,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        // width: windowWidth,
        // height: windowHeight / 3,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendaView: {
        backgroundColor: '#ededed',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    item: {
        backgroundColor: 'white',
        width: windowWidth / 3.5,
        height: windowHeight / 10,
        marginRight: 1,
        marginBottom: 1,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00bd1c',
    },
    itemFill: {
        backgroundColor: '#00bd1c',
        width: windowWidth / 3.5,
        height: windowHeight / 10,
        marginRight: 1,
        marginBottom: 1,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#00bd1c',
    },
    comboButton: {
        flexDirection: 'row',
        margin: 10,
    },
    changeButton: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: 30,
        height: 30,
        marginRight: 2,
        borderWidth: 1,
        borderColor: '#00bd1c',
    },
    bottomButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 5,
    },
    itemBottomButton: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: 'auto',
        height: 'auto',
        marginRight: 2,
        borderWidth: 1,
        borderColor: '#ff0000',
    },
    itemBottomButtonYear: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        width: 'auto',
        height: 'auto',
        marginRight: 2,
        borderWidth: 1,
        borderColor: '#00bd1c',
    },
    textItem: {
        color: '#00bd1c',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textItemFill: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    button: {
        borderRadius: 5,
        padding: 10,
    },
    buttonOpen: {
        backgroundColor: 'transparent',
    },
    textStyle: {
        color: 'black',
        textAlign: 'right',
        fontSize: 16
    },
});

export default CustomMonthYearPicker;
