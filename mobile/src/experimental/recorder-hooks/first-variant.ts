import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, NativeModules } from "react-native";
import AudioRecord from "react-native-audio-record";
import { Socket } from "socket.io-client";
import {Buffer} from 'buffer'
import { readFile } from "../../../utils/read-file";

export default function useRecording(socketInstance: Socket, msgLabel: string) {
    const [audioIsInited, setAudioIsInited] = useState<boolean>(false)
    const [isInterval, setIsInterval] = useState<NodeJS.Timeout | null>(null)
    const buffer = useRef<string>('')
    const timeRef = useRef(Date.now()); // use useRef for store time
    const interval = useRef<NodeJS.Timeout | null>(null)
    NativeModules
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
                timeRef.current = Date.now(); // reload current time thousand useRef
                AudioRecord.on('data', (data) => {
                    buffer.current += data
                    if (Date.now() - timeRef.current >= 500) {
                        const audioBuffer = Buffer.from(buffer.current);
                        const base64data = audioBuffer.toString('base64');
                        console.log(base64data)
                        socketInstance.emit('voice', { data: base64data });
                        console.log("time now: " + Date.now());
                        console.log("time old: " + timeRef.current);
                        console.log(Date.now() - timeRef.current);
                        timeRef.current = Date.now(); // reload current time thousand useRef
                        console.log(buffer.current.length)
                        buffer.current = ''
                    } else {
                        console.log("Time is now walk");
                    }
                });
            }, voiceDuration * 1000);
        } else {
            PermissionsAndroid.request('android.permission.RECORD_AUDIO').then(res => {
                if (res === 'granted') {
                    return audioInit().then(() => {
                        setTimeout(() => {
                            AudioRecord.start();
                            timeRef.current = Date.now(); // reload current time thousand useRef
                            AudioRecord.on('data', (data) => {
                                buffer.current += data
                                if (Date.now() - timeRef.current >= 500) {
                                    const audioBuffer = Buffer.from(buffer.current);
                                    const base64data = audioBuffer.toString('base64');
                                    console.log(base64data)
                                    socketInstance.emit('voice', { data: base64data });
                                    console.log("time now: " + Date.now());
                                    console.log("time old: " + timeRef.current);
                                    console.log(Date.now() - timeRef.current);
                                    timeRef.current = Date.now(); // reload current time thousand useRef
                                    console.log(buffer.current.length)
                                    buffer.current = ''
                                }
                            });
                        }, voiceDuration * 1000);
                    });
                }
            });
        }
    }

    const audioStop = async () => {
        buffer.current = ''
        const filePath = await AudioRecord.stop();
        // readFile(filePath)
        console.log(msgLabel);
        await new Promise(resolve => setTimeout(resolve, 1000));
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
