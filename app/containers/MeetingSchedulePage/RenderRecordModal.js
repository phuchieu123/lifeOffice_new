import React, { useEffect, useState } from 'react';
import { View, List, ListItem, Text, Icon, Button, Body, Right } from 'native-base';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import Modal from 'react-native-modal';
import BackHeader from '../../components/Header/BackHeader';
import { TouchableOpacity } from 'react-native';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { Card } from 'react-native-paper';
import { REQUEST_METHOD } from '../../utils/constants';
import { addFile } from '../../api/fileSystem';
import ToastCustom from '../../components/ToastCustom';
// const audioRecorderPlayer = new AudioRecorderPlayer();
const RenderRecordModal = (props) => {
    const {
        isVisible,
        onClose, navigation, localData
    } = props;
    const handleReload = () => setReload(reload + 1)
    useEffect(() => {
        setCode('Record_' + dateConver + '.m4a')

    }, [])
    const defaultBody = {
        method: REQUEST_METHOD.POST,
        body: {
            action: "read",
            data: [],
            path: "/",
            showHiddenItems: false,
        },
    }
    const [reload, setReload] = useState(0)
    const [body, setBody] = useState(defaultBody)
    const [code, setCode] = useState()
    const [uriLink, setUriLink] = useState()
    const [timeStart, setTimeStart] = useState({
        recordSecs: 0,
        recordTime: 0
    })
    const dateConver = new Date().getTime()
    useEffect(() => {
        setCode('Record_' + dateConver + '.m4a')

    }, [])
    const onStartRecord = async () => {

        // const result = await audioRecorderPlayer.startRecorder();

        // audioRecorderPlayer.addRecordBackListener(e => {
        //     setTimeStart({
        //         recordSecs: e.currentPosition,
        //         recordTime: audioRecorderPlayer.mmssss(
        //             Math.floor(e.currentPosition),
        //         ),
        //     })
        //     return;
        // });
        // setUriLink(result)
    };

    const onStopRecord = async () => {
        const audio = await audioRecorderPlayer.stopRecorder();
        audio.removeRecordBackListener();
    };


    const onStartPlay = async () => {
        // const msg = await audioRecorderPlayer.startPlayer();
        // audioRecorderPlayer.addPlayBackListener((e) => {
        //     e.currentPosition,
        //         e.duration,
        //         audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)),
        //         audioRecorderPlayer.mmssss(Math.floor(e.duration))
        // })
    };

    const hendalSend = async () => {
        if (uriLink) {
            try {
                await addFile({ folder: "users", clientId, path: body.body.path, file: { uri: uriLink, name: code, type: 'Record/m4a' }, code: 'Calendar', mid: localData._id, fname: 'root' })
                handleReload()
                ToastCustom({ text: 'Tải file thành công', type: 'success' })
                onClose();
            } catch (err) {
                ToastCustom({ text: 'Tải file không thành công', type: 'danger' })
            }
        }
        else {
            ToastCustom({ text: 'Tải file không thành công', type: 'danger' })
        }


    }
    return (
        <Modal isVisible={isVisible} style={{ height: 'auto' }}>
            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                <BackHeader title='Ghi âm' />

                <View style={{ padding: 40 }}>
                    <TouchableOpacity onPress={onStartRecord} >
                        <Text>Bắt đầu</Text>
                    </TouchableOpacity>


                    <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-around' }}>
                        <Text >{timeStart.recordTime}</Text>

                        <Text>{timeStart.recordSecs}</Text>


                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 50 }}>
                        <TouchableOpacity onPress={onStopRecord}>
                            <Text>Kết Thúc</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onStartPlay}>
                            <Text>Nghe</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <View padder style={{ flexDirection: 'row', marginTop: 40 }}>
                    <Button onPress={hendalSend} block style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
                        <Icon name="check" type="Feather" />
                    </Button>
                    <Button block onPress={onClose} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
                        <Icon name="close" type="AntDesign" />
                    </Button>
                </View>
            </View>

        </Modal >
    );
};

const mapStateToProps = createStructuredSelector({

});

const withConnect = connect(mapStateToProps);

export default compose(withConnect)(RenderRecordModal);
