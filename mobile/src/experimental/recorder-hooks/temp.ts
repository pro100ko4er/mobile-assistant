import { useEffect, useState } from "react";
import { PermissionsAndroid } from "react-native";
import AudioRecord from "react-native-audio-record";
import { Socket } from "socket.io-client";




export default function useRecording(socketInstance: Socket, msgLabel: string) {
    const [audioIsInited, setAudioIsInited] = useState<boolean>(false)
    const audioInit = async () => {
        const res = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );; 
        if(res) {
        const options = {
          sampleRate: 16000,  // default 44100
          channels: 1,        // 1 or 2, default 1
          bitsPerSample: 16,  // 8 or 16, default 16
          audioSource: 6,     // android only (see below)
          wavFile: 'AudioVoiceAssistant.wav', // default 'audio.wav'
          
        };
       
        AudioRecord.init(options);
        setAudioIsInited(true)
      }
      }

      AudioRecord.on('data', (data) => {
        socketInstance.emit('voice', {data})
      })

      const audioStart = async (voiceDuration: number) => {
        const res = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
          );; 
            if(res) {
              console.log(res)
              return setTimeout(() => {
                AudioRecord.start()
              }, voiceDuration * 1000)
            } else {
              PermissionsAndroid.request('android.permission.RECORD_AUDIO').then(res => {
                if(res === 'granted') {
                  return audioInit().then(() => {
                    setTimeout(() => {
                      AudioRecord.start()
                    }, voiceDuration * 1000)
                      
                  })
                }
              })
            }
      }

      const audioStop = async () => {
        await AudioRecord.stop()
            console.log(msgLabel)
            await new Promise(resolve => setTimeout(resolve, 1000))
            socketInstance.emit( 'voice_end', {"msgLabel": msgLabel} )
      }

      useEffect(() => {
        audioInit()
      }, [])

      return {
        audioIsInited,
        audioStart,
        audioStop
      }
}