import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid } from "react-native";
import AudioRecord from "react-native-audio-record";
import { Socket } from "socket.io-client";
import {Buffer} from 'buffer'
import { readFile } from "../../../utils/read-file";
export default function useRecording(socketInstance: Socket, msgLabel: string) {
    const [audioIsInited, setAudioIsInited] = useState<boolean>(false)
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
                AudioRecord.start();
                interval.current = setInterval(() => {
                     readFile('/data/user/0/com.voiceassistant/files/AudioVoiceAssistant.wav').then(data => {
                        if(data) {
                            console.log(data.length)
                            console.log(data.slice(dataSlice.current).length)
                            socketInstance.emit('voice', {data: data.slice(dataSlice.current)})
                            dataSlice.current = data.length
                            }
                     })
                   
                }, 2000)
        
        } else {
            PermissionsAndroid.request('android.permission.RECORD_AUDIO').then(res => {
                if (res === 'granted') {
                    return audioInit().then(() => {
                            AudioRecord.start();
                         
                            interval.current = setInterval(() => {
                                readFile('/data/user/0/com.voiceassistant/files/AudioVoiceAssistant.wav').then(data => {
                                    if(data) {
                                        console.log(data.length)
                                        console.log(data.slice(dataSlice.current).length)
                                        socketInstance.emit('voice', {data: data.slice(dataSlice.current)})
                                        dataSlice.current = data.length
                                        }
                                 })
                            }, 1000)
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




export function useRecording1(socketInstance: Socket, msgLabel: string) {
    const [audioIsInited, setAudioIsInited] = useState<boolean>(false)
    const wavFilePath = '/data/user/0/com.voiceassistant/files/AudioVoiceAssistant.wav'
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
                AudioRecord.start();
                interval.current = setInterval(() => {
                     readFile(wavFilePath).then(data => {
                        if(data) {
                            console.log(data.length)
                            console.log(data.slice(dataSlice.current).length)
                            socketInstance.emit('voice', {data: data})
                            dataSlice.current = data.length
                            }
                     })
                   
                }, 1000)
        
        } else {
            PermissionsAndroid.request('android.permission.RECORD_AUDIO').then(res => {
                if (res === 'granted') {
                    return audioInit().then(() => {
                            AudioRecord.start();
                            interval.current = setInterval(() => {
                                readFile(wavFilePath).then(data => {
                                    if(data) {
                                        console.log(data.length)
                                        console.log(data.slice(dataSlice.current).length)
                                        socketInstance.emit('voice', {data: data})
                                        dataSlice.current = data.length
                                        }
                                 })
                            }, 1000)
                    });
                }
            });
        }
    }

    const audioStop = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        dataSlice.current = 0
        await AudioRecord.stop()
        
        if(interval.current) {
        clearInterval(interval.current)
        interval.current = null
        }
        socketInstance.emit('voice_end', { "msgLabel": msgLabel });
        audioInit().then(() => console.log('Audio is inited'))
    }

    useEffect(() => {
        audioInit();
        readFile(wavFilePath)
    }, []);

    return {
        audioIsInited,
        audioStart,
        audioStop
    }
}
