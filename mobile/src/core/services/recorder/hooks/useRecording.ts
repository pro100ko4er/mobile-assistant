import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid } from "react-native";
import AudioRecord from "react-native-audio-record";
import { Socket } from "socket.io-client";
import {Buffer} from 'buffer'
import { readFile } from "../../../utils/read-file";
export default function useRecording(socketInstance: Socket, msgLabel: string) {
    const [audioIsInited, setAudioIsInited] = useState<boolean>(false)
    const [isInterval, setIsInterval] = useState<NodeJS.Timeout | null>(null)
    const timeRef = useRef(Date.now()); // используем useRef для хранения времени
    const interval = useRef<NodeJS.Timeout | null>(null)
    const dataSlice = useRef<number>(0)
    const audioInit = async () => {
        const res = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ); 
        if (res) {
            const options = {
                sampleRate: 16000,
                channels: 1,
                bitsPerSample: 16,
                audioSource: 6,
                wavFile: 'AudioVoiceAssistant.wav',
            };
            AudioRecord.init(options);
            setAudioIsInited(true);
        }
    }

    const audioStart = async (voiceDuration: number) => {
        const res = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ); 
        if (res) {
            console.log(res);
            return setTimeout(() => {
                AudioRecord.start();
                timeRef.current = Date.now(); // обновляем текущее время через useRef
                interval.current = setInterval(() => {
                     readFile('/data/user/0/com.voiceassistant/files/AudioVoiceAssistant.wav').then(data => {
                        if(data) {
                            console.log(data.slice(dataSlice.current).length)
                            socketInstance.emit('voice', {data: data.slice(dataSlice.current)})
                            dataSlice.current = data.length
                            }
                     })
                   
                }, 1000)
           
            }, voiceDuration * 1000);
        } else {
            PermissionsAndroid.request('android.permission.RECORD_AUDIO').then(res => {
                if (res === 'granted') {
                    return audioInit().then(() => {
                        setTimeout(() => {
                            AudioRecord.start();
                            timeRef.current = Date.now(); // обновляем текущее время через useRef
                            interval.current = setInterval(() => {
                                readFile('/data/user/0/com.voiceassistant/files/AudioVoiceAssistant.wav').then(data => {
                                    if(data) {
                                        console.log(data.slice(dataSlice.current).length)
                                        socketInstance.emit('voice', {data: data.slice(dataSlice.current)})
                                        dataSlice.current = data.length
                                        }
                                 })
                            }, 1000)
                        }, voiceDuration * 1000);
                    });
                }
            });
        }
    }

    const audioStop = async () => {
        dataSlice.current = 0
        await AudioRecord.stop();
        await new Promise(resolve => setTimeout(resolve, 1000));
        if(interval.current) {
        clearInterval(interval.current)
        interval.current = null
        }
        socketInstance.emit('voice_end', { "msgLabel": msgLabel });
    }

    useEffect(() => {
        audioInit();
    }, []);

    return {
        audioIsInited,
        audioStart,
        audioStop
    }
}
