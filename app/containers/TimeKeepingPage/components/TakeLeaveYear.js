
import React, { useState, useEffect, Fragment } from 'react';
import { Text, View, ActionSheet, Button } from 'native-base';
import { handleSearch, serialize } from 'utils/common';
import { API_TAKE_LEAVE_MANAGER } from 'configs/Paths';
import theme from 'utils/customTheme';

export default TakeLeaveYear = (props) => {
    const { hrmEmployeeId } = props;
    const [data, setData] = useState({});

    useEffect(() => {
        hrmEmployeeId && getData()
    }, [hrmEmployeeId]);

    const getData = async () => {
        const query = {
            filter: {
                hrmEmployeeId
            }
        }
        const url = `${await API_TAKE_LEAVE_MANAGER()}?${serialize(query)}`;
        handleSearch(url, e => Array.isArray(e) && e.length && setData(e[0]));
    };

    return <View style={{ margin: 10 }}>
        <View style={styles.view}>
            {'takeLeaveYear' in data ? <CustomButton name={'Phép năm'} value={data.takeLeaveYear} /> : null}
            {'accumulation' in data ? <CustomButton name={'Tích lũy'} value={data.accumulation} /> : null}
            {'seniority' in data ? <CustomButton name={'Thâm niên'} value={data.seniority} /> : null}
        </View>
        <View style={styles.view}>
            {'total' in data ? <CustomButton name={'Tổng'} value={data.total} /> : null}
            {'numberDayOff' in data ? <CustomButton name={'Ngày nghỉ'} value={data.numberDayOff} /> : null}
            {'remain' in data ? <CustomButton name={'Còn lại'} value={data.remain} /> : null}
        </View>
    </View>

};

const CustomButton = (props) => {
    const { name, value } = props
    return (
        <Button style={styles.button}>
            <Text style={styles.textButton}>
                {value}
            </Text>
            <Text style={styles.textNote}>{name}</Text>
        </Button>
    );
};
const styles = {
    view: {
        flexDirection: 'row',
    },
    textView: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 10,
    },
    buttonView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        flex: 1,
        flexDirection: 'column',
        height: 'auto',
        borderRadius: 15,
        backgroundColor: 'white',
        margin: 3,
    },
    textButton: { color: theme.textTitle, marginBottom: 10, marginTop: 15, fontSize: 28, fontWeight: 'bold' },
    textNote: { color: theme.textTitle, marginBottom: 10, fontSize: 10, textAlign: 'center' },

};
