import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid } from "react-native";
import AudioRecord from "react-native-audio-record";
import { Socket } from "socket.io-client";

export default function useRecording(socketInstance: Socket, msgLabel: string) {
    const [audioIsInited, setAudioIsInited] = useState<boolean>(false)
    const [isInterval, setIsInterval] = useState<NodeJS.Timeout | null>(null)
    const [buffer, setBuffer] = useState<string>('')
    const timeRef = useRef(Date.now()); // useing useRef for store time
    const interval = useRef<NodeJS.Timeout | null>(null)
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
                interval.current = setInterval(() => {
                  AudioRecord.on('data', (data) => {
                    setBuffer(prev => prev + data)
                        if(interval.current && Date.now() - timeRef.current >= 1000) {
                          console.log(data)
                          socketInstance.emit('voice', { data });
                          clearInterval(interval.current)
                          timeRef.current = Date.now()
                          setBuffer('')
                        }
                });
                }, 1000)
           
            }, voiceDuration * 1000);
        } else {
            PermissionsAndroid.request('android.permission.RECORD_AUDIO').then(res => {
                if (res === 'granted') {
                    return audioInit().then(() => {
                        setTimeout(() => {
                            AudioRecord.start();
                            timeRef.current = Date.now(); // reload current time thousand useRef
                            interval.current = setInterval(() => {
                              AudioRecord.on('data', (data) => {
                                setBuffer(prev => prev + data)
                                timeRef.current = Date.now()
                                    if(interval.current && Date.now() - timeRef.current >= 1000) {
                                      console.log(data)
                                      socketInstance.emit('voice', { data: buffer });
                                      clearInterval(interval.current)
                                      timeRef.current = Date.now()
                                      setBuffer('')
                                    }
                            });
                            }, 1000)
                        }, voiceDuration * 1000);
                    });
                }
            });
        }
    }

    const audioStop = async () => {
        await AudioRecord.stop();
        console.log(msgLabel);
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
