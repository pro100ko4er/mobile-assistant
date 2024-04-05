import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid } from "react-native";
import AudioRecord from "react-native-audio-record";
import { Socket } from "socket.io-client";
import {Buffer} from 'buffer'
import { readFile } from "../../../utils/read-file";
import clearFile from "../../../utils/clear-file";
import createFile from "../../../utils/create-file";

export default function useRecording(socketInstance: Socket, msgLabel: string) {
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
        AudioRecord.on('data', (data) => {
            // console.log(data)
            const chunk = Buffer.from(data, 'base64');
            const base64data = chunk.toString('base64')
            console.log(base64data);
            socketInstance.emit('voice', {data: chunk.toString('base64')})
        })
    }

    const audioStart = async (voiceDuration: number) => {
        const res = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        ); 
        if (res) {
                if(!audioIsInited) {
                    audioInit()
                    .then(() => AudioRecord.start())
                }
                AudioRecord.start();
                // interval.current = setInterval(() => {
                //      readFile(wavFilePath).then(data => {
                //         if(data) {
                //             console.log(data.length)
                //             console.log(data.slice(dataSlice.current).length)
                //             socketInstance.emit('voice', {data: data})
                //             dataSlice.current = data.length
                //             }
                //      })
                   
                // }, 1000)
        
        } else {
            PermissionsAndroid.request('android.permission.RECORD_AUDIO').then(res => {
                if (res === 'granted') {
                    return audioInit().then(() => {
                            AudioRecord.start();
                            // interval.current = setInterval(() => {
                            //     readFile(wavFilePath).then(data => {
                            //         if(data) {
                            //             console.log(data.length)
                            //             console.log(data.slice(dataSlice.current).length)
                            //             socketInstance.emit('voice', {data: data})
                            //             dataSlice.current = data.length
                            //             }
                            //      })
                            // }, 1000)
                    });
                }
            });
        }
    }

    const audioStop = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        dataSlice.current = 0
        await AudioRecord.stop()
        // .then(path => {
        //     clearFile(path)
        //     .then(() => {
        //         audioInit()
        //         .then(() => {
        //             createFile(path, '', 'base64')
        //             .then(() => console.log("Audio init"))
        //         })
        //     })
            
        // })
        
        if(interval.current) {
        clearInterval(interval.current)
        interval.current = null
        }
        socketInstance.emit('voice_end', { "msgLabel": msgLabel });
    }

    useEffect(() => {
        console.log("useEffect")
        audioInit()
        .then(() => {
            readFile('/data/user/0/com.voiceassistant/files/AudioVoiceAssistant.wav')
            .then((value) => {
                console.log("Содержимое файла: " + value)
            })
        })
    
    }, []);

    return {
        audioIsInited,
        audioStart,
        audioStop
    }
}


