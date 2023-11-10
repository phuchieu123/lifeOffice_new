import { Button } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { addFile } from '../../api/fileSystem';
import BackHeader from '../../components/Header/BackHeader';
import ToastCustom from '../../components/ToastCustom';
import { REQUEST_METHOD } from '../../utils/constants';
import { startRecording, stopRecording } from '../../utils/record';
// const audioRecorderPlayer = new AudioRecorderPlayer();

export const RenderRecord = (props) => {
    const { navigation } = props
    const [timeStart, setTimeStart] = useState({
        recordSecs: 0,
        recordTime: 0
    })
    const [uriLink, setUriLink] = useState()
    const [sound, setSound] = useState()

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound])

    const hendalSend = async () => {
        const body = {
            method: REQUEST_METHOD.POST,
            body: {
                action: "read",
                data: [],
                path: "/",
                showHiddenItems: false,
            },
        }
        if (uriLink) {
            try {
                await addFile({ folder: 'company', path: body.body.path, file: { uri: uriLink, name: 'Record_' + new Date().getTime() + '.m4a', type: 'Record/m4a' }, name: '.m4a', fileName: '.m4a' })
                ToastCustom({ text: 'Tải file thành công', type: 'success' })
                navigation.goBack();
            } catch (err) {
                ToastCustom({ text: 'Tải file không thành công', type: 'danger' })
            }
        }
        else {
            ToastCustom({ text: 'Tải file không thành công', type: 'danger' })
        }
        // navigation.goBack();
    }

    const onStartRecord = async () => {
        await startRecording()
    };

    const onStopRecord = async () => {
        const uri = await stopRecording()
        setUriLink(uri)
    };
    const onStartPlay = async () => {

    };
    const onPausePlay = async () => {
        // await audioRecorderPlayer.pausePlayer();
    }
    const ResatsAll = () => {
        setTimeStart({
            recordSecs: 0,
            recordTime: 0
        })
    }

    return (
        <>
            <BackHeader navigation={navigation} title="Ghi âm" />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Button onPress={onStartRecord}>
                    <Text>Bắt đầu</Text>
                </Button>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 50, marginTop: 50 }}>
                    <>
                        <View style={{ marginRight: 50 }}>
                            <Text>{timeStart.recordTime}</Text>
                        </View>
                    </>
                    <>
                        <View>
                            <Text>{timeStart.recordSecs}</Text>
                        </View>
                    </>

                </View>
                <Button onPress={onStopRecord}>
                    <Text>Kết thúc không ghi âm nữa</Text>
                </Button>

                <Button onPress={onStartPlay}>
                    <Text>Nghe</Text>
                </Button>
                <Button onPress={onPausePlay}>
                    <Text>Tạm dừng khi đang nghe ghi âm</Text>
                </Button>

                <Button onPress={ResatsAll}>
                    <Text>Bắt Đầu lại</Text>
                </Button>

                <View style={{ marginTop: 50 }}>
                    <Button onPress={hendalSend} >
                        <Text>Gửi Lên</Text>
                    </Button>
                </View>


            </View>
        </>
    );
};
export default (RenderRecord);