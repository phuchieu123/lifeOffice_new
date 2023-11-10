import _ from 'lodash';
import { Button, Icon, Text, View } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { startRecording } from '../../utils/record';

const Records = (props) => {
    const { handleSend, onclose } = props

    const [uriLink, setUriLink] = useState([])
    const [sound, setSound] = useState()
    const [recording, setRecording] = useState()
    const [time, setTime] = useState(0)
    const [disabled, setDisabled] = useState(0)

    const ss = time % 60
    const mm = _.floor(time / 60)
    console.log(mm, ss)

    const interval = useRef()

    useEffect(() => {
        return () => {
            if (interval.current) clearInterval(interval.current)
        }
    }, [])

    useEffect(() => {
        if (recording) {
            interval.current = setInterval(() => {
                setTime(e => e + 1)
            }, 1000)
        } else {
            setTime(0)
            if (interval.current) clearInterval(interval.current)
        }
    }, [recording])

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const onStartRecord = async () => {
        if (disabled) return
        setDisabled(true)
        startRecording().then(e => {
            if (e) setRecording(true)
            setDisabled(false)
        })
    };

    const onStopRecord = async () => {
        if (disabled) return
        setRecording(false)
        const uri = await stopRecording()
        setUriLink(e => [...e, uri])
    };

    return <View>
        <View>
            <View style={{ justifyContent: 'space-around', paddingTop: 20, paddingBottom: 50 }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 22 }}>
                    <Text style={{ fontSize: 50, margin: 40 }}>{time}</Text>

                    {!recording && <Icon type='Entypo' name='controller-play' onPress={onStartRecord} style={{ fontSize: 80, color: 'green' }}
                    />}
                    {recording && <Icon type='Entypo' name='controller-stop' onPress={onStopRecord} style={{ fontSize: 80, color: 'red' }} />}
                </View>


                {/* 
                <Icon type='Entypo' name='controller-stop' onPress={onStopRecord} />
                <Icon type='Entypo' name='controller-record' onPress={onStartRecord} />
                <Icon type='Entypo' name='controller-play' onPress={onStartPlay} /> */}
            </View>
        </View>

        <View padder style={{ flexDirection: 'row' }}>
            <Button block onPress={handleSend} style={{ flex: 1, borderRadius: 10, marginRight: 5 }}>
                <Icon name="check" type="Feather" />
            </Button>
            <Button block onPress={onclose} full style={{ flex: 1, borderRadius: 10, marginRight: 5 }} warning>
                <Icon name="close" type="AntDesign" />
            </Button>
        </View>
    </View>
}

export default Records